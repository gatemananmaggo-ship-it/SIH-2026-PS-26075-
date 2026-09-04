class ModuleResource {
  final String name;
  final String size;
  final String type;

  const ModuleResource({required this.name, required this.size, required this.type});
}

class CourseModule {
  final String id;
  final String title;
  final String duration;
  final String videoUrl;
  final String summary;
  bool completed;
  final List<ModuleResource> resources;

  CourseModule({
    required this.id,
    required this.title,
    required this.duration,
    required this.videoUrl,
    required this.summary,
    this.completed = false,
    this.resources = const [],
  });
}

class CourseFeedback {
  final String userName;
  final String userAvatar;
  final int rating;
  final String date;
  final String comment;

  const CourseFeedback({
    required this.userName,
    required this.userAvatar,
    required this.rating,
    required this.date,
    required this.comment,
  });
}

class Course {
  final String id;
  final String title;
  final String domain;
  final String department;
  final String trainerId;
  final String trainerName;
  final String trainerRole;
  final String level;
  final String duration;
  int enrolledCount;
  double rating;
  int totalRatings;
  final String thumbnail;
  final String description;
  final List<String> prerequisites;
  final bool featured;
  final List<CourseModule> modules;
  final String? assessmentId;
  final List<CourseFeedback> feedbacks;

  Course({
    required this.id,
    required this.title,
    required this.domain,
    required this.department,
    required this.trainerId,
    required this.trainerName,
    required this.trainerRole,
    required this.level,
    required this.duration,
    required this.enrolledCount,
    required this.rating,
    required this.totalRatings,
    required this.thumbnail,
    required this.description,
    this.prerequisites = const [],
    this.featured = false,
    this.modules = const [],
    this.assessmentId,
    List<CourseFeedback>? feedbacks,
  }) : feedbacks = feedbacks ?? [];

  int get completedModuleCount => modules.where((m) => m.completed).length;

  int get progressPercent {
    if (modules.isEmpty) return 0;
    return ((completedModuleCount / modules.length) * 100).round();
  }
}
