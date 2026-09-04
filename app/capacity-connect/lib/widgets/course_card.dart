import 'package:flutter/material.dart';
import '../models/course.dart';
import '../theme/palette.dart';
import '../widgets/glass_card.dart';

enum CourseCardAction { enroll, continueLearning, review }

/// Course thumbnail card — used both in the "Explore All Courses"
/// catalogue and the "My Enrolled Courses" grid, matching
/// `DomainCatalogue.jsx` / `TraineeDashboard.jsx` course cards.
class CourseCard extends StatelessWidget {
  final Course course;
  final CourseCardAction action;
  final bool showProgress;
  final VoidCallback onPrimaryAction;
  final VoidCallback? onTakeQuiz;

  const CourseCard({
    super.key,
    required this.course,
    required this.action,
    required this.onPrimaryAction,
    this.showProgress = false,
    this.onTakeQuiz,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return GlassCard(
      padding: EdgeInsets.zero,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Thumbnail
          AspectRatio(
            aspectRatio: 16 / 9,
            child: Stack(
              fit: StackFit.expand,
              children: [
                Image.network(
                  course.thumbnail,
                  fit: BoxFit.cover,
                  errorBuilder: (_, __, ___) => Container(color: AppColors.slate800),
                  loadingBuilder: (context, child, progress) {
                    if (progress == null) return child;
                    return Container(color: AppColors.slate800);
                  },
                ),
                DecoratedBox(
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.bottomCenter,
                      end: Alignment.topCenter,
                      colors: [Colors.black.withOpacity(0.75), Colors.transparent],
                    ),
                  ),
                ),
                Positioned(
                  top: 10,
                  left: 10,
                  child: _tag(course.domain, AppColors.moes900.withOpacity(0.9), AppColors.sky300),
                ),
                Positioned(
                  top: 10,
                  right: 10,
                  child: _tag(course.level, Colors.black.withOpacity(0.75), AppColors.amber300),
                ),
                Positioned(
                  bottom: 10,
                  left: 10,
                  right: 10,
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      _metaChip(Icons.star_rounded, '${course.rating} (${course.totalRatings})', AppColors.amber400),
                      _metaChip(Icons.access_time_rounded, course.duration, AppColors.sky300),
                    ],
                  ),
                ),
              ],
            ),
          ),

          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  course.title,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: Theme.of(context).textTheme.titleSmall,
                ),
                const SizedBox(height: 6),
                Text(
                  course.description,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(
                    fontSize: 12,
                    height: 1.4,
                    color: isDark ? AppColors.slate400 : AppColors.slate500,
                  ),
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    CircleAvatar(
                      radius: 12,
                      backgroundColor: isDark ? AppColors.moes900 : AppColors.moes100,
                      child: Text(
                        _trainerInitial(course.trainerName),
                        style: TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                          color: isDark ? AppColors.sky300 : AppColors.moes700,
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        course.trainerName,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                          color: isDark ? AppColors.slate300 : AppColors.slate600,
                        ),
                      ),
                    ),
                    Icon(Icons.menu_book_rounded,
                        size: 14, color: isDark ? AppColors.slate500 : AppColors.slate400),
                    const SizedBox(width: 3),
                    Text('${course.modules.length} Modules',
                        style: TextStyle(fontSize: 11, color: isDark ? AppColors.slate500 : AppColors.slate400)),
                  ],
                ),
                if (showProgress) ...[
                  const SizedBox(height: 12),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('Progress',
                          style: TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.w600,
                              color: isDark ? AppColors.slate400 : AppColors.slate600)),
                      Text(
                        '${course.progressPercent}% (${course.completedModuleCount}/${course.modules.length})',
                        style: TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.w700,
                            color: isDark ? AppColors.sky400 : AppColors.moes600),
                      ),
                    ],
                  ),
                  const SizedBox(height: 6),
                  ClipRRect(
                    borderRadius: BorderRadius.circular(6),
                    child: LinearProgressIndicator(
                      value: course.progressPercent / 100,
                      minHeight: 7,
                      backgroundColor: isDark ? AppColors.slate800 : AppColors.slate100,
                      valueColor: AlwaysStoppedAnimation(
                        course.progressPercent >= 100 ? AppColors.emerald500 : AppColors.moes500,
                      ),
                    ),
                  ),
                ],
                const SizedBox(height: 14),
                _actionButton(context, isDark),
                if (onTakeQuiz != null) ...[
                  const SizedBox(height: 8),
                  SizedBox(
                    width: double.infinity,
                    child: OutlinedButton.icon(
                      onPressed: onTakeQuiz,
                      icon: const Icon(Icons.workspace_premium_outlined, size: 16, color: AppColors.amber600),
                      label: const Text('Take MCQ Assessment'),
                      style: OutlinedButton.styleFrom(
                        foregroundColor: isDark ? AppColors.amber300 : AppColors.amber700,
                        side: BorderSide(color: isDark ? AppColors.amber800 : AppColors.amber300),
                        padding: const EdgeInsets.symmetric(vertical: 10),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        textStyle: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
                      ),
                    ),
                  ),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _actionButton(BuildContext context, bool isDark) {
    switch (action) {
      case CourseCardAction.review:
        return SizedBox(
          width: double.infinity,
          child: ElevatedButton.icon(
            onPressed: onPrimaryAction,
            icon: const Icon(Icons.check_circle_rounded, size: 16),
            label: const Text('Completed • Review Course'),
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.emerald600,
              padding: const EdgeInsets.symmetric(vertical: 11),
              textStyle: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
            ),
          ),
        );
      case CourseCardAction.continueLearning:
        return SizedBox(
          width: double.infinity,
          child: ElevatedButton.icon(
            onPressed: onPrimaryAction,
            icon: const Icon(Icons.play_circle_fill_rounded, size: 16),
            label: const Text('Continue Learning Player'),
            style: ElevatedButton.styleFrom(
              padding: const EdgeInsets.symmetric(vertical: 11),
              textStyle: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
            ),
          ),
        );
      case CourseCardAction.enroll:
        return SizedBox(
          width: double.infinity,
          child: ElevatedButton.icon(
            onPressed: onPrimaryAction,
            icon: const Icon(Icons.chevron_right_rounded, size: 18),
            label: const Text('Enroll & Access Modules'),
            style: ElevatedButton.styleFrom(
              backgroundColor: isDark ? AppColors.slate800 : AppColors.slate900,
              padding: const EdgeInsets.symmetric(vertical: 11),
              textStyle: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
            ),
          ),
        );
    }
  }

  static String _trainerInitial(String name) {
    final parts = name.split(' ');
    if (parts.length > 1 && parts[1].isNotEmpty) return parts[1][0];
    return name.isNotEmpty ? name[0] : 'T';
  }

  Widget _tag(String text, Color bg, Color fg) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(6)),
      child: Text(text,
          style: TextStyle(color: fg, fontSize: 9.5, fontWeight: FontWeight.w800, letterSpacing: 0.3)),
    );
  }

  Widget _metaChip(IconData icon, String text, Color iconColor) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
      decoration: BoxDecoration(color: Colors.black.withOpacity(0.55), borderRadius: BorderRadius.circular(6)),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 12, color: iconColor),
          const SizedBox(width: 3),
          Text(text, style: const TextStyle(color: Colors.white, fontSize: 10.5, fontWeight: FontWeight.w600)),
        ],
      ),
    );
  }
}
