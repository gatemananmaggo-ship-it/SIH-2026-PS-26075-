import 'dart:async';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../models/assessment.dart';
import '../state/app_state.dart';
import '../theme/palette.dart';
import '../widgets/glass_card.dart';
import 'certificate_detail_screen.dart';

class QuizScreen extends StatefulWidget {
  final String assessmentId;
  const QuizScreen({super.key, required this.assessmentId});

  @override
  State<QuizScreen> createState() => _QuizScreenState();
}

class _QuizScreenState extends State<QuizScreen> {
  final Map<int, int> _answers = {};
  final Set<int> _flagged = {};
  int _current = 0;
  Timer? _timer;
  int _secondsLeft = 0;
  QuizResult? _result;
  bool _started = false;

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  void _startQuiz(int durationMinutes) {
    setState(() {
      _started = true;
      _secondsLeft = durationMinutes * 60;
    });
    _timer = Timer.periodic(const Duration(seconds: 1), (t) {
      if (_secondsLeft <= 1) {
        t.cancel();
        setState(() => _secondsLeft = 0);
        _submit();
      } else {
        setState(() => _secondsLeft--);
      }
    });
  }

  void _submit() {
    if (_result != null) return;
    _timer?.cancel();
    final state = context.read<AppState>();
    final result = state.submitQuizAnswers(widget.assessmentId, _answers);
    setState(() => _result = result);
  }

  String _fmtTime(int seconds) {
    final m = (seconds ~/ 60).toString().padLeft(2, '0');
    final s = (seconds % 60).toString().padLeft(2, '0');
    return '$m:$s';
  }

  @override
  Widget build(BuildContext context) {
    final state = context.watch<AppState>();
    final assessment = state.assessmentById(widget.assessmentId);
    final isDark = Theme.of(context).brightness == Brightness.dark;

    if (_result != null) {
      return _buildResultsScreen(context, assessment, isDark);
    }

    if (!_started) {
      return _buildIntroScreen(context, assessment, isDark);
    }

    final question = assessment.questions[_current];
    final urgent = _secondsLeft <= 60;

    return Scaffold(
      backgroundColor: isDark ? AppColors.navy900 : AppColors.slate50,
      appBar: AppBar(
        title: Text('Question ${_current + 1} / ${assessment.questions.length}', style: const TextStyle(fontSize: 14)),
        actions: [
          Container(
            margin: const EdgeInsets.only(right: 14),
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
            decoration: BoxDecoration(
              color: urgent ? AppColors.red500.withOpacity(0.15) : AppColors.moes500.withOpacity(0.12),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: urgent ? AppColors.red400 : AppColors.moes400),
            ),
            child: Row(
              children: [
                Icon(Icons.timer_outlined, size: 14, color: urgent ? AppColors.red600 : AppColors.moes600),
                const SizedBox(width: 5),
                Text(_fmtTime(_secondsLeft),
                    style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 12.5,
                        color: urgent ? AppColors.red600 : AppColors.moes600)),
              ],
            ),
          ),
        ],
      ),
      body: Column(
        children: [
          LinearProgressIndicator(
            value: (_current + 1) / assessment.questions.length,
            minHeight: 3,
            backgroundColor: isDark ? AppColors.slate800 : AppColors.slate200,
            valueColor: const AlwaysStoppedAnimation(AppColors.moes500),
          ),
          Expanded(
            child: ListView(
              padding: const EdgeInsets.fromLTRB(16, 16, 16, 12),
              children: [
                _questionNavigator(assessment.questions.length, isDark),
                const SizedBox(height: 16),
                GlassCard(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Expanded(
                            child: Text(question.question,
                                style: const TextStyle(fontSize: 14.5, fontWeight: FontWeight.w700, height: 1.4)),
                          ),
                          IconButton(
                            icon: Icon(
                              _flagged.contains(_current) ? Icons.flag_rounded : Icons.outlined_flag_rounded,
                              color: _flagged.contains(_current) ? AppColors.amber600 : AppColors.slate400,
                              size: 20,
                            ),
                            onPressed: () => setState(() {
                              if (_flagged.contains(_current)) {
                                _flagged.remove(_current);
                              } else {
                                _flagged.add(_current);
                              }
                            }),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      ...List.generate(question.options.length, (i) {
                        final selected = _answers[_current] == i;
                        return Padding(
                          padding: const EdgeInsets.only(bottom: 10),
                          child: InkWell(
                            borderRadius: BorderRadius.circular(13),
                            onTap: () => setState(() => _answers[_current] = i),
                            child: Container(
                              padding: const EdgeInsets.all(13),
                              decoration: BoxDecoration(
                                color: selected
                                    ? AppColors.moes500.withOpacity(isDark ? 0.22 : 0.08)
                                    : (isDark ? AppColors.slate800.withOpacity(0.4) : Colors.white),
                                borderRadius: BorderRadius.circular(13),
                                border: Border.all(
                                  color: selected
                                      ? AppColors.moes500
                                      : (isDark ? AppColors.slate700 : AppColors.slate200),
                                  width: selected ? 1.6 : 1,
                                ),
                              ),
                              child: Row(
                                children: [
                                  Container(
                                    width: 22,
                                    height: 22,
                                    decoration: BoxDecoration(
                                      shape: BoxShape.circle,
                                      color: selected ? AppColors.moes500 : Colors.transparent,
                                      border: Border.all(
                                          color: selected
                                              ? AppColors.moes500
                                              : (isDark ? AppColors.slate500 : AppColors.slate300),
                                          width: 1.4),
                                    ),
                                    child: selected
                                        ? const Icon(Icons.check_rounded, size: 14, color: Colors.white)
                                        : null,
                                  ),
                                  const SizedBox(width: 12),
                                  Expanded(
                                    child: Text(question.options[i],
                                        style: TextStyle(
                                            fontSize: 12.8,
                                            height: 1.4,
                                            fontWeight: selected ? FontWeight.w600 : FontWeight.normal)),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        );
                      }),
                    ],
                  ),
                ),
              ],
            ),
          ),
          SafeArea(
            top: false,
            child: Padding(
              padding: const EdgeInsets.fromLTRB(16, 8, 16, 12),
              child: Row(
                children: [
                  if (_current > 0)
                    Expanded(
                      child: OutlinedButton.icon(
                        onPressed: () => setState(() => _current--),
                        icon: const Icon(Icons.chevron_left_rounded, size: 18),
                        label: const Text('Previous'),
                        style: OutlinedButton.styleFrom(padding: const EdgeInsets.symmetric(vertical: 13)),
                      ),
                    ),
                  if (_current > 0) const SizedBox(width: 10),
                  Expanded(
                    flex: 2,
                    child: _current < assessment.questions.length - 1
                        ? ElevatedButton.icon(
                            onPressed: () => setState(() => _current++),
                            icon: const Icon(Icons.chevron_right_rounded, size: 18),
                            label: const Text('Next Question'),
                            style: ElevatedButton.styleFrom(padding: const EdgeInsets.symmetric(vertical: 13)),
                          )
                        : ElevatedButton.icon(
                            onPressed: () => _confirmSubmit(context, assessment.questions.length),
                            icon: const Icon(Icons.check_circle_outline_rounded, size: 18),
                            label: const Text('Submit Assessment'),
                            style: ElevatedButton.styleFrom(
                                backgroundColor: AppColors.emerald600, padding: const EdgeInsets.symmetric(vertical: 13)),
                          ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Future<void> _confirmSubmit(BuildContext context, int totalQuestions) async {
    final unanswered = totalQuestions - _answers.length;
    if (unanswered > 0) {
      final proceed = await showDialog<bool>(
        context: context,
        builder: (context) => AlertDialog(
          title: const Text('Submit assessment?'),
          content: Text('You have $unanswered unanswered question${unanswered > 1 ? 's' : ''}. Submit anyway?'),
          actions: [
            TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('Go Back')),
            ElevatedButton(onPressed: () => Navigator.pop(context, true), child: const Text('Submit')),
          ],
        ),
      );
      if (proceed != true) return;
    }
    _submit();
  }

  Widget _questionNavigator(int count, bool isDark) {
    return SizedBox(
      height: 40,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        itemCount: count,
        separatorBuilder: (_, __) => const SizedBox(width: 8),
        itemBuilder: (context, i) {
          final answered = _answers.containsKey(i);
          final flagged = _flagged.contains(i);
          final active = i == _current;
          Color bg;
          Color fg;
          if (active) {
            bg = AppColors.moes600;
            fg = Colors.white;
          } else if (flagged) {
            bg = AppColors.amber100;
            fg = AppColors.amber800;
          } else if (answered) {
            bg = AppColors.emerald100;
            fg = AppColors.emerald800;
          } else {
            bg = isDark ? AppColors.slate800 : AppColors.slate100;
            fg = isDark ? AppColors.slate300 : AppColors.slate500;
          }
          return GestureDetector(
            onTap: () => setState(() => _current = i),
            child: Container(
              width: 36,
              alignment: Alignment.center,
              decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(10)),
              child: Text('${i + 1}', style: TextStyle(color: fg, fontWeight: FontWeight.bold, fontSize: 12.5)),
            ),
          );
        },
      ),
    );
  }

  Widget _buildIntroScreen(BuildContext context, Assessment assessment, bool isDark) {
    return Scaffold(
      appBar: AppBar(title: const Text('Assessment Instructions', style: TextStyle(fontSize: 14))),
      body: ListView(
        padding: const EdgeInsets.all(18),
        children: [
          Container(
            width: 60,
            height: 60,
            decoration: BoxDecoration(
              color: AppColors.amber500.withOpacity(0.15),
              borderRadius: BorderRadius.circular(18),
            ),
            child: const Icon(Icons.workspace_premium_rounded, color: AppColors.amber600, size: 30),
          ),
          const SizedBox(height: 16),
          Text(assessment.title, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          const SizedBox(height: 4),
          Text(assessment.courseTitle,
              style: TextStyle(fontSize: 12.5, color: isDark ? AppColors.slate400 : AppColors.slate500)),
          const SizedBox(height: 20),
          GlassCard(
            child: Column(
              children: [
                _introRow(Icons.help_outline_rounded, 'Total Questions', '${assessment.totalQuestions}'),
                const Divider(height: 20),
                _introRow(Icons.timer_outlined, 'Time Limit', '${assessment.durationMinutes} minutes'),
                const Divider(height: 20),
                _introRow(Icons.check_circle_outline_rounded, 'Passing Score', '${assessment.passingScore}%'),
                const Divider(height: 20),
                _introRow(Icons.person_outline_rounded, 'Set By', assessment.creatorName),
              ],
            ),
          ),
          const SizedBox(height: 16),
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: AppColors.sky500.withOpacity(0.08),
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: AppColors.sky500.withOpacity(0.25)),
            ),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Icon(Icons.info_outline_rounded, size: 17, color: AppColors.sky600),
                const SizedBox(width: 10),
                Expanded(
                  child: Text(
                    'The timer starts as soon as you begin and cannot be paused. Passing this assessment issues a tamper-evident e-Certificate to your profile.',
                    style: TextStyle(fontSize: 11.5, height: 1.5, color: isDark ? AppColors.slate300 : AppColors.slate600),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton.icon(
              onPressed: () => _startQuiz(assessment.durationMinutes),
              icon: const Icon(Icons.play_arrow_rounded, size: 19),
              label: const Text('Begin Assessment'),
              style: ElevatedButton.styleFrom(padding: const EdgeInsets.symmetric(vertical: 14)),
            ),
          ),
        ],
      ),
    );
  }

  Widget _introRow(IconData icon, String label, String value) {
    return Row(
      children: [
        Icon(icon, size: 16, color: AppColors.moes600),
        const SizedBox(width: 10),
        Expanded(child: Text(label, style: const TextStyle(fontSize: 12.5))),
        Text(value, style: const TextStyle(fontSize: 12.5, fontWeight: FontWeight.bold)),
      ],
    );
  }

  Widget _buildResultsScreen(BuildContext context, Assessment assessment, bool isDark) {
    final result = _result!;
    final passed = result.passed;

    return Scaffold(
      appBar: AppBar(title: const Text('Assessment Result', style: TextStyle(fontSize: 14))),
      body: ListView(
        padding: const EdgeInsets.all(18),
        children: [
          Center(
            child: Column(
              children: [
                Container(
                  width: 92,
                  height: 92,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: (passed ? AppColors.emerald500 : AppColors.red500).withOpacity(0.14),
                  ),
                  child: Icon(
                    passed ? Icons.emoji_events_rounded : Icons.replay_rounded,
                    color: passed ? AppColors.emerald600 : AppColors.red500,
                    size: 44,
                  ),
                ),
                const SizedBox(height: 16),
                Text(passed ? 'Congratulations!' : 'Not Quite There',
                    style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w900)),
                const SizedBox(height: 4),
                Text(
                  passed
                      ? 'You passed the assessment and earned a certificate.'
                      : 'You need ${result.passingScore}% to pass. Review the material and try again.',
                  textAlign: TextAlign.center,
                  style: TextStyle(fontSize: 12.5, color: isDark ? AppColors.slate400 : AppColors.slate500),
                ),
              ],
            ),
          ),
          const SizedBox(height: 22),
          Row(
            children: [
              Expanded(
                child: _resultStat('${result.percentage}%', 'Your Score', AppColors.moes600),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: _resultStat('${result.correctCount}/${result.totalQuestions}', 'Correct', AppColors.emerald600),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: _resultStat('${result.passingScore}%', 'Required', AppColors.amber600),
              ),
            ],
          ),
          const SizedBox(height: 22),
          const Text('Answer Review', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
          const SizedBox(height: 10),
          ...List.generate(assessment.questions.length, (i) {
            final q = assessment.questions[i];
            final userAnswer = _answers[i];
            final correct = userAnswer == q.correctIndex;
            return Padding(
              padding: const EdgeInsets.only(bottom: 10),
              child: GlassCard(
                borderColor: correct ? AppColors.emerald300 : AppColors.red300,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Icon(correct ? Icons.check_circle_rounded : Icons.cancel_rounded,
                            size: 18, color: correct ? AppColors.emerald600 : AppColors.red500),
                        const SizedBox(width: 8),
                        Expanded(
                          child: Text('${i + 1}. ${q.question}',
                              style: const TextStyle(fontSize: 12.5, fontWeight: FontWeight.w600, height: 1.4)),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Text('Correct answer: ${q.options[q.correctIndex]}',
                        style: const TextStyle(fontSize: 11.5, color: AppColors.emerald700, fontWeight: FontWeight.w600)),
                    if (!correct && userAnswer != null)
                      Padding(
                        padding: const EdgeInsets.only(top: 3),
                        child: Text('Your answer: ${q.options[userAnswer]}',
                            style: const TextStyle(fontSize: 11.5, color: AppColors.red600)),
                      ),
                    const SizedBox(height: 6),
                    Text(q.explanation,
                        style: TextStyle(fontSize: 11, height: 1.5, color: isDark ? AppColors.slate400 : AppColors.slate500)),
                  ],
                ),
              ),
            );
          }),
          const SizedBox(height: 12),
          if (passed && result.certificate != null)
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: () => Navigator.of(context).pushReplacement(
                  MaterialPageRoute(
                    builder: (_) => CertificateDetailScreen(
                      certificateId: result.certificate!.id,
                      celebrate: true,
                    ),
                  ),
                ),
                icon: const Icon(Icons.workspace_premium_rounded, size: 18),
                label: const Text('View My e-Certificate'),
                style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.amber600, padding: const EdgeInsets.symmetric(vertical: 14)),
              ),
            )
          else
            SizedBox(
              width: double.infinity,
              child: OutlinedButton.icon(
                onPressed: () => Navigator.of(context).pop(),
                icon: const Icon(Icons.arrow_back_rounded, size: 17),
                label: const Text('Return to Course'),
                style: OutlinedButton.styleFrom(padding: const EdgeInsets.symmetric(vertical: 13)),
              ),
            ),
        ],
      ),
    );
  }

  Widget _resultStat(String value, String label, Color color) {
    return GlassCard(
      padding: const EdgeInsets.symmetric(vertical: 14),
      child: Column(
        children: [
          Text(value, style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: color)),
          const SizedBox(height: 3),
          Text(label, style: const TextStyle(fontSize: 10.5, color: AppColors.slate500)),
        ],
      ),
    );
  }
}
