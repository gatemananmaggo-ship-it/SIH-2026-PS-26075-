import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../state/app_state.dart';
import '../theme/palette.dart';
import '../widgets/glass_card.dart';
import 'quiz_screen.dart';

class AssessmentsTab extends StatelessWidget {
  const AssessmentsTab({super.key});

  @override
  Widget build(BuildContext context) {
    final state = context.watch<AppState>();
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final enrolledIds = state.currentUser.enrolledCourses;

    final myAssessments = state.assessments.where((a) => enrolledIds.contains(a.courseId)).toList();
    final otherAssessments = state.assessments.where((a) => !enrolledIds.contains(a.courseId)).toList();

    if (state.assessments.isEmpty) {
      return const Center(child: Text('No assessments available yet.'));
    }

    return ListView(
      padding: const EdgeInsets.fromLTRB(16, 14, 16, 24),
      children: [
        const SectionLabel(text: 'YOUR ENROLLED COURSE ASSESSMENTS'),
        const SizedBox(height: 10),
        if (myAssessments.isEmpty)
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 8),
            child: Text(
              'Enroll in a course from "My Learning" to unlock its MCQ assessment here.',
              style: TextStyle(fontSize: 12.5, color: isDark ? AppColors.slate400 : AppColors.slate500),
            ),
          )
        else
          ...myAssessments.map((a) => Padding(
                padding: const EdgeInsets.only(bottom: 14),
                child: _AssessmentCard(assessmentId: a.id, highlighted: true),
              )),
        if (otherAssessments.isNotEmpty) ...[
          const SizedBox(height: 12),
          const SectionLabel(text: 'OTHER AVAILABLE ASSESSMENTS'),
          const SizedBox(height: 10),
          ...otherAssessments.map((a) => Padding(
                padding: const EdgeInsets.only(bottom: 14),
                child: _AssessmentCard(assessmentId: a.id, highlighted: false),
              )),
        ],
      ],
    );
  }
}

class SectionLabel extends StatelessWidget {
  final String text;
  const SectionLabel({super.key, required this.text});

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Text(
      text,
      style: TextStyle(
        fontSize: 10.5,
        fontWeight: FontWeight.w800,
        letterSpacing: 0.6,
        color: isDark ? AppColors.slate400 : AppColors.slate500,
      ),
    );
  }
}

class _AssessmentCard extends StatelessWidget {
  final String assessmentId;
  final bool highlighted;
  const _AssessmentCard({required this.assessmentId, required this.highlighted});

  @override
  Widget build(BuildContext context) {
    final state = context.watch<AppState>();
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final assessment = state.assessmentById(assessmentId);
    final passedCert = state.currentUser.certificates
        .where((c) => c.courseId == assessment.courseId)
        .toList();
    final hasPassed = passedCert.isNotEmpty;

    return GlassCard(
      borderColor: highlighted ? (isDark ? AppColors.moes700 : AppColors.moes200) : null,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: hasPassed
                      ? AppColors.emerald500.withOpacity(0.15)
                      : AppColors.amber500.withOpacity(0.15),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(
                  hasPassed ? Icons.verified_rounded : Icons.workspace_premium_rounded,
                  color: hasPassed ? AppColors.emerald600 : AppColors.amber600,
                  size: 20,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(assessment.courseTitle,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(
                            fontSize: 10.5,
                            fontWeight: FontWeight.w700,
                            color: isDark ? AppColors.sky300 : AppColors.moes700)),
                    Text(assessment.title,
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(fontSize: 13.5, fontWeight: FontWeight.bold)),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [
              _metaPill(Icons.timer_outlined, '${assessment.durationMinutes} min', isDark),
              _metaPill(Icons.help_outline_rounded, '${assessment.totalQuestions} Questions', isDark),
              _metaPill(Icons.check_circle_outline_rounded, 'Pass: ${assessment.passingScore}%', isDark),
              if (assessment.deadline != null)
                _metaPill(Icons.event_outlined, assessment.deadline!.split('T').first, isDark),
            ],
          ),
          const SizedBox(height: 10),
          Row(
            children: [
              Icon(Icons.person_outline_rounded, size: 13, color: isDark ? AppColors.slate400 : AppColors.slate500),
              const SizedBox(width: 4),
              Expanded(
                child: Text('Set by ${assessment.creatorName}',
                    style: TextStyle(fontSize: 11, color: isDark ? AppColors.slate400 : AppColors.slate500)),
              ),
            ],
          ),
          const SizedBox(height: 14),
          if (hasPassed)
            Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(vertical: 11),
              decoration: BoxDecoration(
                color: AppColors.emerald500.withOpacity(0.12),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: AppColors.emerald500.withOpacity(0.4)),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.check_circle_rounded, size: 16, color: AppColors.emerald600),
                  const SizedBox(width: 8),
                  Text('Passed • Score ${passedCert.first.score}%',
                      style: const TextStyle(
                          color: AppColors.emerald600, fontWeight: FontWeight.bold, fontSize: 12.5)),
                ],
              ),
            )
          else
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: () => Navigator.of(context)
                    .push(MaterialPageRoute(builder: (_) => QuizScreen(assessmentId: assessmentId))),
                icon: const Icon(Icons.play_arrow_rounded, size: 18),
                label: const Text('Start Assessment'),
                style: ElevatedButton.styleFrom(padding: const EdgeInsets.symmetric(vertical: 11)),
              ),
            ),
        ],
      ),
    );
  }

  Widget _metaPill(IconData icon, String text, bool isDark) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 5),
      decoration: BoxDecoration(
        color: isDark ? AppColors.slate800 : AppColors.slate100,
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 12, color: isDark ? AppColors.slate400 : AppColors.slate500),
          const SizedBox(width: 4),
          Text(text,
              style: TextStyle(
                  fontSize: 10.5,
                  fontWeight: FontWeight.w600,
                  color: isDark ? AppColors.slate300 : AppColors.slate600)),
        ],
      ),
    );
  }
}
