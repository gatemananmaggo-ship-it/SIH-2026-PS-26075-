import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../data/mock_data.dart';
import '../models/course.dart';
import '../models/assessment.dart';
import '../models/trainee_user.dart';
import '../models/misc.dart';

/// Result of submitting an MCQ assessment.
class QuizResult {
  final int totalQuestions;
  final int correctCount;
  final int percentage;
  final bool passed;
  final int passingScore;
  final TraineeCertificate? certificate;

  const QuizResult({
    required this.totalQuestions,
    required this.correctCount,
    required this.percentage,
    required this.passed,
    required this.passingScore,
    this.certificate,
  });
}

/// Central app state — mirrors the responsibilities of the web app's
/// `AppContext.jsx`, scoped to the trainee-only feature set.
class AppState extends ChangeNotifier {
  static const _prefsKey = 'capacity_connect_trainee_state_v1';

  late TraineeUser currentUser;
  late List<Course> courses;
  late List<Assessment> assessments;
  late List<TrainerMaterial> trainerMaterials;
  final List<Announcement> announcements = MockData.announcements;
  final List<Faculty> faculty = MockData.faculty;

  bool isLoggedIn = false;
  bool darkMode = false;
  bool _initialized = false;

  bool get isInitialized => _initialized;

  AppState() {
    currentUser = MockData.buildDefaultTrainee();
    courses = MockData.buildCourses();
    assessments = MockData.buildAssessments();
    trainerMaterials = MockData.buildTrainerMaterials();
  }

  Course? courseById(String id) {
    for (final c in courses) {
      if (c.id == id) return c;
    }
    return null;
  }

  Assessment assessmentById(String id) {
    for (final a in assessments) {
      if (a.id == id) return a;
    }
    return assessments.first;
  }

  List<Course> get enrolledCourses =>
      courses.where((c) => currentUser.enrolledCourses.contains(c.id)).toList();

  // ---------------------------------------------------------------
  // Bootstrapping / persistence
  // ---------------------------------------------------------------
  Future<void> init() async {
    final prefs = await SharedPreferences.getInstance();
    darkMode = prefs.getBool('dark_mode') ?? false;
    isLoggedIn = prefs.getBool('is_logged_in') ?? false;

    final raw = prefs.getString(_prefsKey);
    if (raw != null) {
      try {
        final data = jsonDecode(raw) as Map<String, dynamic>;
        _hydrateFromJson(data);
      } catch (_) {
        // Corrupt or outdated cache — fall back to fresh seed data.
      }
    }
    _initialized = true;
    notifyListeners();
  }

  void _hydrateFromJson(Map<String, dynamic> data) {
    final enrolled = (data['enrolledCourses'] as List?)?.cast<String>();
    final completed = (data['completedCourses'] as List?)?.cast<String>();
    if (enrolled != null) currentUser.enrolledCourses = enrolled;
    if (completed != null) currentUser.completedCourses = completed;

    final certs = data['certificates'] as List?;
    if (certs != null) {
      currentUser.certificates = certs
          .map((c) => TraineeCertificate(
                id: c['id'],
                courseId: c['courseId'],
                courseTitle: c['courseTitle'],
                issueDate: c['issueDate'],
                score: c['score'],
                grade: c['grade'],
                trainerName: c['trainerName'],
                verificationHash: c['verificationHash'],
              ))
          .toList();
    }

    final moduleProgress = data['moduleProgress'] as Map<String, dynamic>?;
    if (moduleProgress != null) {
      for (final course in courses) {
        final doneIds = (moduleProgress[course.id] as List?)?.cast<String>();
        if (doneIds == null) continue;
        for (final m in course.modules) {
          m.completed = doneIds.contains(m.id);
        }
      }
    }

    final profile = data['profile'] as Map<String, dynamic>?;
    if (profile != null) {
      currentUser.name = profile['name'] ?? currentUser.name;
      currentUser.designation = profile['designation'] ?? currentUser.designation;
      currentUser.department = profile['department'] ?? currentUser.department;
      currentUser.organization = profile['organization'] ?? currentUser.organization;
      currentUser.location = profile['location'] ?? currentUser.location;
      final quals = profile['qualifications'] as List?;
      if (quals != null) {
        currentUser.qualifications = quals
            .map((q) => Qualification(degree: q['degree'], institute: q['institute'], year: q['year']))
            .toList();
      }
      final exps = profile['experience'] as List?;
      if (exps != null) {
        currentUser.experience = exps
            .map((e) => WorkExperience(
                role: e['role'], org: e['org'], duration: e['duration'], description: e['description']))
            .toList();
      }
      final interests = profile['interests'] as List?;
      if (interests != null) currentUser.interests = interests.cast<String>();
      final skills = profile['skills'] as List?;
      if (skills != null) {
        currentUser.skills = skills
            .map((s) => SkillItem(name: s['name'], level: s['level'], category: s['category']))
            .toList();
      }
    }
  }

  Future<void> _persist() async {
    final prefs = await SharedPreferences.getInstance();
    final moduleProgress = <String, List<String>>{};
    for (final c in courses) {
      moduleProgress[c.id] = c.modules.where((m) => m.completed).map((m) => m.id).toList();
    }
    final data = {
      'enrolledCourses': currentUser.enrolledCourses,
      'completedCourses': currentUser.completedCourses,
      'certificates': currentUser.certificates
          .map((c) => {
                'id': c.id,
                'courseId': c.courseId,
                'courseTitle': c.courseTitle,
                'issueDate': c.issueDate,
                'score': c.score,
                'grade': c.grade,
                'trainerName': c.trainerName,
                'verificationHash': c.verificationHash,
              })
          .toList(),
      'moduleProgress': moduleProgress,
      'profile': {
        'name': currentUser.name,
        'designation': currentUser.designation,
        'department': currentUser.department,
        'organization': currentUser.organization,
        'location': currentUser.location,
        'qualifications': currentUser.qualifications
            .map((q) => {'degree': q.degree, 'institute': q.institute, 'year': q.year})
            .toList(),
        'experience': currentUser.experience
            .map((e) => {
                  'role': e.role,
                  'org': e.org,
                  'duration': e.duration,
                  'description': e.description,
                })
            .toList(),
        'interests': currentUser.interests,
        'skills': currentUser.skills
            .map((s) => {'name': s.name, 'level': s.level, 'category': s.category})
            .toList(),
      },
    };
    await prefs.setString(_prefsKey, jsonEncode(data));
  }

  Future<void> setDarkMode(bool value) async {
    darkMode = value;
    notifyListeners();
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('dark_mode', value);
  }

  // ---------------------------------------------------------------
  // Auth (trainee-only)
  // ---------------------------------------------------------------
  Future<void> login() async {
    isLoggedIn = true;
    notifyListeners();
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('is_logged_in', true);
  }

  Future<void> logout() async {
    isLoggedIn = false;
    notifyListeners();
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('is_logged_in', false);
  }

  // ---------------------------------------------------------------
  // Trainee actions
  // ---------------------------------------------------------------
  bool enrollCourse(String courseId) {
    if (currentUser.enrolledCourses.contains(courseId)) return false;
    currentUser.enrolledCourses.add(courseId);
    final course = courseById(courseId);
    if (course != null) course.enrolledCount += 1;
    notifyListeners();
    _persist();
    return true;
  }

  void toggleModuleProgress(String courseId, String moduleId) {
    final course = courseById(courseId);
    if (course == null) return;
    for (final m in course.modules) {
      if (m.id == moduleId) {
        m.completed = !m.completed;
        break;
      }
    }
    notifyListeners();
    _persist();
  }

  QuizResult submitQuizAnswers(String assessmentId, Map<int, int> selectedAnswers) {
    final assessment = assessmentById(assessmentId);
    final questions = assessment.questions;
    var correct = 0;
    for (var i = 0; i < questions.length; i++) {
      if (selectedAnswers[i] == questions[i].correctIndex) correct++;
    }
    final percentage = questions.isEmpty ? 0 : ((correct / questions.length) * 100).round();
    final passed = percentage >= assessment.passingScore;

    TraineeCertificate? cert;
    if (passed) {
      final grade = percentage >= 90 ? 'Distinction' : (percentage >= 80 ? 'First Class' : 'Pass');
      final now = DateTime.now();
      final issueDate =
          '${now.year.toString().padLeft(4, '0')}-${now.month.toString().padLeft(2, '0')}-${now.day.toString().padLeft(2, '0')}';
      final hash = _randomHash();
      cert = TraineeCertificate(
        id: 'CERT-MOES-${now.year}-${1000 + (now.millisecondsSinceEpoch % 9000)}',
        courseId: assessment.courseId,
        courseTitle: assessment.courseTitle,
        issueDate: issueDate,
        score: percentage,
        grade: grade,
        trainerName: assessment.creatorName,
        verificationHash: hash,
      );
      currentUser.certificates =
          currentUser.certificates.where((c) => c.courseId != assessment.courseId).toList()..add(cert);
      if (!currentUser.completedCourses.contains(assessment.courseId)) {
        currentUser.completedCourses.add(assessment.courseId);
      }
      notifyListeners();
      _persist();
    }

    return QuizResult(
      totalQuestions: questions.length,
      correctCount: correct,
      percentage: percentage,
      passed: passed,
      passingScore: assessment.passingScore,
      certificate: cert,
    );
  }

  void submitFeedback(String courseId, int rating, String comment) {
    final course = courseById(courseId);
    if (course == null) return;
    final entry = CourseFeedback(
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      rating: rating,
      date: _todayString(),
      comment: comment,
    );
    course.feedbacks.insert(0, entry);
    final total = course.feedbacks.fold<int>(0, (sum, f) => sum + f.rating);
    course.rating = double.parse((total / course.feedbacks.length).toStringAsFixed(1));
    course.totalRatings = course.feedbacks.length;

    currentUser.feedbacksSubmitted.add(
      SubmittedFeedback(courseId: courseId, rating: rating, review: comment, date: _todayString()),
    );
    notifyListeners();
    _persist();
  }

  void updateProfile({
    required String name,
    required String designation,
    required String department,
    required String organization,
    required String location,
    required List<Qualification> qualifications,
    required List<WorkExperience> experience,
    required List<String> interests,
    required List<SkillItem> skills,
  }) {
    currentUser.name = name;
    currentUser.designation = designation;
    currentUser.department = department;
    currentUser.organization = organization;
    currentUser.location = location;
    currentUser.qualifications = qualifications;
    currentUser.experience = experience;
    currentUser.interests = interests;
    currentUser.skills = skills;
    notifyListeners();
    _persist();
  }

  String _todayString() {
    final now = DateTime.now();
    return '${now.year.toString().padLeft(4, '0')}-${now.month.toString().padLeft(2, '0')}-${now.day.toString().padLeft(2, '0')}';
  }

  String _randomHash() {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    final seed = DateTime.now().microsecondsSinceEpoch;
    final buffer = StringBuffer();
    var n = seed;
    for (var i = 0; i < 16; i++) {
      n = (n * 1103515245 + 12345) & 0x7fffffff;
      buffer.write(chars[n % chars.length]);
    }
    return buffer.toString();
  }
}
