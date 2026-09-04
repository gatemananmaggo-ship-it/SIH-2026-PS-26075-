class Qualification {
  String degree;
  String institute;
  String year;

  Qualification({required this.degree, required this.institute, required this.year});
}

class WorkExperience {
  String role;
  String org;
  String duration;
  String description;

  WorkExperience({
    required this.role,
    required this.org,
    required this.duration,
    required this.description,
  });
}

class SkillItem {
  String name;
  int level;
  String category;

  SkillItem({required this.name, required this.level, required this.category});
}

class TraineeCertificate {
  final String id;
  final String courseId;
  final String courseTitle;
  final String issueDate;
  final int score;
  final String grade;
  final String trainerName;
  final String verificationHash;

  const TraineeCertificate({
    required this.id,
    required this.courseId,
    required this.courseTitle,
    required this.issueDate,
    required this.score,
    required this.grade,
    required this.trainerName,
    required this.verificationHash,
  });
}

class SubmittedFeedback {
  final String courseId;
  final int rating;
  final String review;
  final String date;

  const SubmittedFeedback({
    required this.courseId,
    required this.rating,
    required this.review,
    required this.date,
  });
}

class TraineeUser {
  String id;
  String name;
  String email;
  String avatar;
  String designation;
  String department;
  String organization;
  String location;
  String joinedDate;
  List<Qualification> qualifications;
  List<WorkExperience> experience;
  List<String> interests;
  List<SkillItem> skills;
  List<String> enrolledCourses;
  List<String> completedCourses;
  List<TraineeCertificate> certificates;
  List<SubmittedFeedback> feedbacksSubmitted;

  TraineeUser({
    required this.id,
    required this.name,
    required this.email,
    required this.avatar,
    required this.designation,
    required this.department,
    required this.organization,
    required this.location,
    required this.joinedDate,
    List<Qualification>? qualifications,
    List<WorkExperience>? experience,
    List<String>? interests,
    List<SkillItem>? skills,
    List<String>? enrolledCourses,
    List<String>? completedCourses,
    List<TraineeCertificate>? certificates,
    List<SubmittedFeedback>? feedbacksSubmitted,
  })  : qualifications = qualifications ?? [],
        experience = experience ?? [],
        interests = interests ?? [],
        skills = skills ?? [],
        enrolledCourses = enrolledCourses ?? [],
        completedCourses = completedCourses ?? [],
        certificates = certificates ?? [],
        feedbacksSubmitted = feedbacksSubmitted ?? [];
}
