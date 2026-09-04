class Announcement {
  final String id;
  final String title;
  final String category;
  final String date;
  final bool urgent;
  final String publishedBy;
  final String summary;
  final String linkText;
  final String targetRole;

  const Announcement({
    required this.id,
    required this.title,
    required this.category,
    required this.date,
    required this.urgent,
    required this.publishedBy,
    required this.summary,
    required this.linkText,
    this.targetRole = 'all',
  });
}

class TrainerMaterial {
  final String id;
  final String trainerId;
  final String trainerName;
  final String title;
  final String domain;
  final String fileType;
  final String fileSize;
  final String uploadDate;
  int downloads;
  final String accessRole;
  final String description;

  TrainerMaterial({
    required this.id,
    required this.trainerId,
    required this.trainerName,
    required this.title,
    required this.domain,
    required this.fileType,
    required this.fileSize,
    required this.uploadDate,
    required this.downloads,
    required this.accessRole,
    required this.description,
  });
}

class Faculty {
  final String id;
  final String name;
  final String avatar;
  final String designation;
  final String organization;
  final double rating;
  final String bio;
  final List<String> specializations;

  const Faculty({
    required this.id,
    required this.name,
    required this.avatar,
    required this.designation,
    required this.organization,
    required this.rating,
    required this.bio,
    required this.specializations,
  });
}
