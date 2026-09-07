const User = require('../models/user');
const TrainerProfile = require('../models/trainer');
const Course = require('../models/course');
const Feedback = require('../models/feedback');
const { optimizeAssignment } = require('../utils/ml.service');

/**
 * Calculate total experience years from workExperience array.
 * Merges overlapping intervals to avoid double-counting.
 */
function calcExperienceYears(workExperience = []) {
  const intervals = workExperience
    .filter((w) => w.startDate)
    .map((w) => ({
      start: new Date(w.startDate).getTime(),
      end: w.endDate ? new Date(w.endDate).getTime() : Date.now(),
    }))
    .sort((a, b) => a.start - b.start);

  let totalMs = 0;
  let currentEnd = -Infinity;

  for (const interval of intervals) {
    const start = Math.max(interval.start, currentEnd);
    const end = Math.max(interval.end, currentEnd);
    totalMs += Math.max(0, end - start);
    currentEnd = end;
  }

  return parseFloat((totalMs / (1000 * 60 * 60 * 24 * 365.25)).toFixed(2));
}

/**
 * GET /api/admin/trainer-assignments/optimize
 *
 * Aggregates real trainer data from MongoDB, calls the private ML service,
 * and returns the optimized assignment recommendations.
 */
async function optimizeTrainerAssignments(req, res) {
  try {
    // ── 1. Load all active, approved trainers ──────────────────────────────
    const trainerUsers = await User.find({
      role: 'trainer',
      isApproved: true,
      isActive: true,
    }).lean();

    if (trainerUsers.length === 0) {
      return res.status(200).json({
        message: 'No active approved trainers found.',
        assignments: [],
        unassigned_subjects: [],
        valid: false,
      });
    }

    const trainerUserIds = trainerUsers.map((u) => u._id);

    // ── 2. Load trainer profiles (skills, workExperience, certifications) ──
    const trainerProfiles = await TrainerProfile.find({
      userId: { $in: trainerUserIds },
    }).lean();

    const profileByUserId = {};
    for (const profile of trainerProfiles) {
      profileByUserId[profile.userId.toString()] = profile;
    }

    // ── 3. Load average performance ratings from Feedback ─────────────────
    //   Find all courses by these trainers, then aggregate feedback ratings
    const trainerCourses = await Course.find({
      trainerId: { $in: trainerUserIds },
    }).lean();

    const coursesByTrainerId = {};
    for (const course of trainerCourses) {
      const tid = course.trainerId.toString();
      if (!coursesByTrainerId[tid]) coursesByTrainerId[tid] = [];
      coursesByTrainerId[tid].push(course._id);
    }

    const allCourseIds = trainerCourses.map((c) => c._id);
    const feedbacks = await Feedback.find({
      courseId: { $in: allCourseIds },
    }).lean();

    // Group feedback ratings by trainerId via course lookup
    const courseToTrainer = {};
    for (const course of trainerCourses) {
      courseToTrainer[course._id.toString()] = course.trainerId.toString();
    }

    const ratingsByTrainer = {};
    for (const fb of feedbacks) {
      const tid = courseToTrainer[fb.courseId.toString()];
      if (!tid) continue;
      if (!ratingsByTrainer[tid]) ratingsByTrainer[tid] = [];
      ratingsByTrainer[tid].push(fb.rating);
    }

    // ── 4. Build ML trainer payload ────────────────────────────────────────
    const mlTrainers = trainerUsers.map((user) => {
      const uid = user._id.toString();
      const profile = profileByUserId[uid] || {};
      const ratings = ratingsByTrainer[uid] || [];
      const avgRating =
        ratings.length > 0
          ? parseFloat((ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2))
          : 0;

      return {
        id: uid,
        name: user.name,
        skills: profile.skills || [],
        experience_years: calcExperienceYears(profile.workExperience || []),
        certifications: profile.qualifications ? profile.qualifications.length : 0,
        performance_rating: avgRating,
        available: true, // already filtered to active+approved
      };
    });

    // ── 5. Build ML subject payload from request body ──────────────────────
    //   Subjects are passed from the frontend admin UI
    const { subjects } = req.body;

    if (!subjects || !Array.isArray(subjects) || subjects.length === 0) {
      return res.status(400).json({
        error: 'subjects array is required in the request body.',
      });
    }

    // Validate and normalize subjects to ML contract
    const mlSubjects = subjects.map((s, index) => {
      if (!s.id && !s.subject_id) {
        throw new Error(`Subject at index ${index} is missing an id field.`);
      }
      return {
        id: s.id || s.subject_id,
        name: s.name || s.subject_name || `Subject ${index + 1}`,
        required_skills: Array.isArray(s.required_skills) ? s.required_skills : [],
      };
    });

    // ── 6. Call ML service ─────────────────────────────────────────────────
    const mlResult = await optimizeAssignment(mlTrainers, mlSubjects);

    // ── 7. Return result ───────────────────────────────────────────────────
    return res.status(200).json(mlResult);
  } catch (err) {
    console.error('[optimizeTrainerAssignments] Error:', err.message);

    // Distinguish ML service errors from server errors
    const mlErrors = [
      'ML_SERVICE_API_KEY',
      'ML service',
      'http://localhost:8000',
    ];
    const isMlError = mlErrors.some((kw) => err.message.includes(kw));

    if (isMlError) {
      return res.status(502).json({
        error: 'ML optimization service is unavailable.',
        detail: err.message,
      });
    }

    return res.status(500).json({
      error: 'Failed to run trainer assignment optimization.',
      detail: err.message,
    });
  }
}

module.exports = { optimizeTrainerAssignments };
