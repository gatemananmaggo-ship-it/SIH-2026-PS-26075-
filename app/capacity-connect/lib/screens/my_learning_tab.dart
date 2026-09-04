import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../models/course.dart';
import '../state/app_state.dart';
import '../theme/palette.dart';
import '../widgets/course_card.dart';
import '../widgets/app_toast.dart';
import 'course_player_screen.dart';
import 'quiz_screen.dart';

class MyLearningTab extends StatefulWidget {
  const MyLearningTab({super.key});

  @override
  State<MyLearningTab> createState() => _MyLearningTabState();
}

class _MyLearningTabState extends State<MyLearningTab> {
  bool _showExplore = false;
  String _domain = 'All';
  String _search = '';

  static const domains = [
    'All',
    'Radar Meteorology',
    'Atmospheric Modeling',
    'Oceanography',
    'Satellite Remote Sensing',
    'Seismology & Solid Earth',
  ];

  void _openCourse(Course course) {
    Navigator.of(context).push(MaterialPageRoute(builder: (_) => CoursePlayerScreen(courseId: course.id)));
  }

  @override
  Widget build(BuildContext context) {
    final state = context.watch<AppState>();
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 14, 16, 8),
          child: Container(
            padding: const EdgeInsets.all(4),
            decoration: BoxDecoration(
              color: isDark ? AppColors.slate800 : AppColors.slate100,
              borderRadius: BorderRadius.circular(14),
            ),
            child: Row(
              children: [
                Expanded(
                  child: _segment(
                    context,
                    label: 'My Courses (${state.currentUser.enrolledCourses.length})',
                    selected: !_showExplore,
                    onTap: () => setState(() => _showExplore = false),
                  ),
                ),
                Expanded(
                  child: _segment(
                    context,
                    label: 'Explore All',
                    selected: _showExplore,
                    onTap: () => setState(() => _showExplore = true),
                  ),
                ),
              ],
            ),
          ),
        ),
        if (_showExplore) ...[
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: TextField(
              onChanged: (v) => setState(() => _search = v),
              decoration: InputDecoration(
                hintText: "Search 'Doppler Radar', '4D-Var', 'INSAT-3D'...",
                prefixIcon: const Icon(Icons.search_rounded, size: 19),
                isDense: true,
              ),
              style: const TextStyle(fontSize: 13),
            ),
          ),
          const SizedBox(height: 10),
          // SingleChildScrollView instead of a fixed-height ListView — a
          // ChoiceChip's rendered height can vary with the platform's chip
          // theme / system font scale, so we let it size itself rather
          // than risk clipping it inside a guessed fixed height.
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Row(
              children: [
                for (final d in domains) ...[
                  ChoiceChip(
                    label: Text(d, style: const TextStyle(fontSize: 11.5, fontWeight: FontWeight.w600)),
                    selected: d == _domain,
                    onSelected: (_) => setState(() => _domain = d),
                    selectedColor: AppColors.moes600,
                    backgroundColor: isDark ? AppColors.slate800 : Colors.white,
                    labelStyle: TextStyle(color: d == _domain ? Colors.white : null),
                    side: BorderSide(color: isDark ? AppColors.slate700 : AppColors.slate200),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                    visualDensity: VisualDensity.compact,
                    materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
                  ),
                  const SizedBox(width: 8),
                ],
              ],
            ),
          ),
          const SizedBox(height: 6),
        ],
        Expanded(child: _showExplore ? _buildExplore(state) : _buildMyCourses(context, state)),
      ],
    );
  }

  Widget _segment(BuildContext context,
      {required String label, required bool selected, required VoidCallback onTap}) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 180),
        padding: const EdgeInsets.symmetric(vertical: 10),
        decoration: BoxDecoration(
          color: selected ? (isDark ? AppColors.moes700 : Colors.white) : Colors.transparent,
          borderRadius: BorderRadius.circular(11),
          boxShadow: selected
              ? [BoxShadow(color: Colors.black.withOpacity(0.08), blurRadius: 6, offset: const Offset(0, 2))]
              : null,
        ),
        child: Text(
          label,
          textAlign: TextAlign.center,
          style: TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.w700,
            color: selected
                ? (isDark ? Colors.white : AppColors.moes700)
                : (isDark ? AppColors.slate400 : AppColors.slate500),
          ),
        ),
      ),
    );
  }

  Widget _buildMyCourses(BuildContext context, AppState state) {
    final courses = state.enrolledCourses;
    if (courses.isEmpty) {
      return _emptyState(
        icon: Icons.menu_book_outlined,
        title: 'You have not enrolled in any courses yet',
        subtitle: 'Explore the specialized MoES/IMD catalogue and enroll in courses to start learning.',
        actionLabel: 'Browse Course Catalogue',
        onAction: () => setState(() => _showExplore = true),
      );
    }
    return ListView.separated(
      padding: const EdgeInsets.fromLTRB(16, 10, 16, 24),
      itemCount: courses.length,
      separatorBuilder: (_, __) => const SizedBox(height: 16),
      itemBuilder: (context, i) {
        final course = courses[i];
        final isCompleted = state.currentUser.completedCourses.contains(course.id) ||
            course.progressPercent == 100;
        return CourseCard(
          course: course,
          showProgress: true,
          action: isCompleted ? CourseCardAction.review : CourseCardAction.continueLearning,
          onPrimaryAction: () => _openCourse(course),
          onTakeQuiz: course.assessmentId != null
              ? () => _launchQuiz(context, state, course.assessmentId!)
              : null,
        );
      },
    );
  }

  Widget _buildExplore(AppState state) {
    final filtered = state.courses.where((c) {
      final matchesDomain = _domain == 'All' || c.domain == _domain;
      final q = _search.toLowerCase();
      final matchesSearch = q.isEmpty ||
          c.title.toLowerCase().contains(q) ||
          c.domain.toLowerCase().contains(q) ||
          c.description.toLowerCase().contains(q) ||
          c.trainerName.toLowerCase().contains(q);
      return matchesDomain && matchesSearch;
    }).toList();

    if (filtered.isEmpty) {
      return _emptyState(
        icon: Icons.menu_book_outlined,
        title: 'No courses match your filter',
        subtitle: 'Try resetting the domain category or clearing your search term.',
      );
    }

    return ListView.separated(
      padding: const EdgeInsets.fromLTRB(16, 10, 16, 24),
      itemCount: filtered.length,
      separatorBuilder: (_, __) => const SizedBox(height: 16),
      itemBuilder: (context, i) {
        final course = filtered[i];
        final isEnrolled = state.currentUser.enrolledCourses.contains(course.id);
        final isCompleted = state.currentUser.completedCourses.contains(course.id);
        return CourseCard(
          course: course,
          showProgress: isEnrolled,
          action: isCompleted
              ? CourseCardAction.review
              : (isEnrolled ? CourseCardAction.continueLearning : CourseCardAction.enroll),
          onPrimaryAction: () {
            if (!isEnrolled) {
              state.enrollCourse(course.id);
              showAppToast(context, 'Successfully enrolled in course!', type: ToastType.success);
            }
            _openCourse(course);
          },
        );
      },
    );
  }

  void _launchQuiz(BuildContext context, AppState state, String assessmentId) {
    Navigator.of(context)
        .push(MaterialPageRoute(builder: (_) => QuizScreen(assessmentId: assessmentId)));
  }

  Widget _emptyState({
    required IconData icon,
    required String title,
    required String subtitle,
    String? actionLabel,
    VoidCallback? onAction,
  }) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, size: 52, color: AppColors.slate400),
            const SizedBox(height: 16),
            Text(title, textAlign: TextAlign.center, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
            const SizedBox(height: 8),
            Text(subtitle,
                textAlign: TextAlign.center,
                style: const TextStyle(fontSize: 12, color: AppColors.slate500, height: 1.5)),
            if (actionLabel != null) ...[
              const SizedBox(height: 18),
              ElevatedButton(onPressed: onAction, child: Text(actionLabel)),
            ],
          ],
        ),
      ),
    );
  }
}
