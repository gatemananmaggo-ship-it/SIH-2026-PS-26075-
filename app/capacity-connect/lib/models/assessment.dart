class QuizQuestion {
  final String id;
  final String question;
  final List<String> options;
  final int correctIndex;
  final String explanation;

  const QuizQuestion({
    required this.id,
    required this.question,
    required this.options,
    required this.correctIndex,
    required this.explanation,
  });
}

class Assessment {
  final String id;
  final String courseId;
  final String courseTitle;
  final String title;
  final int durationMinutes;
  final int passingScore;
  final String? deadline;
  final int totalQuestions;
  final String creatorId;
  final String creatorName;
  final List<QuizQuestion> questions;

  const Assessment({
    required this.id,
    required this.courseId,
    required this.courseTitle,
    required this.title,
    required this.durationMinutes,
    required this.passingScore,
    this.deadline,
    required this.totalQuestions,
    required this.creatorId,
    required this.creatorName,
    required this.questions,
  });
}
