import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../state/app_state.dart';
import '../theme/palette.dart';
import 'app_toast.dart';

/// Mirrors `FeedbackModal.jsx` — a star rating + review submission sheet.
class FeedbackSheet extends StatefulWidget {
  final String courseId;
  const FeedbackSheet({super.key, required this.courseId});

  @override
  State<FeedbackSheet> createState() => _FeedbackSheetState();
}

class _FeedbackSheetState extends State<FeedbackSheet> {
  int _rating = 0;
  final TextEditingController _comment = TextEditingController();

  @override
  void dispose() {
    _comment.dispose();
    super.dispose();
  }

  void _submit() {
    if (_rating == 0) {
      showAppToast(context, 'Please select a star rating.', type: ToastType.warning);
      return;
    }
    context.read<AppState>().submitFeedback(widget.courseId, _rating, _comment.text.trim());
    Navigator.of(context).pop();
    showAppToast(context, 'Thank you for your feedback!', type: ToastType.success);
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Padding(
      padding: EdgeInsets.only(bottom: MediaQuery.of(context).viewInsets.bottom),
      child: Container(
        padding: const EdgeInsets.fromLTRB(20, 14, 20, 24),
        decoration: BoxDecoration(
          color: isDark ? AppColors.navy800 : Colors.white,
          borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(
              child: Container(
                width: 40,
                height: 4,
                margin: const EdgeInsets.only(bottom: 16),
                decoration: BoxDecoration(color: AppColors.slate300, borderRadius: BorderRadius.circular(4)),
              ),
            ),
            const Text('Rate this Course', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
            const SizedBox(height: 4),
            Text('Your feedback helps improve future MoES training cohorts.',
                style: TextStyle(fontSize: 12, color: isDark ? AppColors.slate400 : AppColors.slate500)),
            const SizedBox(height: 18),
            Center(
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: List.generate(5, (i) {
                  final filled = i < _rating;
                  return IconButton(
                    onPressed: () => setState(() => _rating = i + 1),
                    icon: Icon(
                      filled ? Icons.star_rounded : Icons.star_border_rounded,
                      color: AppColors.amber500,
                      size: 34,
                    ),
                  );
                }),
              ),
            ),
            const SizedBox(height: 8),
            TextField(
              controller: _comment,
              maxLines: 4,
              style: const TextStyle(fontSize: 13),
              decoration: const InputDecoration(
                hintText: 'Share your experience with this course (optional)...',
              ),
            ),
            const SizedBox(height: 16),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: _submit,
                icon: const Icon(Icons.send_rounded, size: 16),
                label: const Text('Submit Feedback'),
                style: ElevatedButton.styleFrom(padding: const EdgeInsets.symmetric(vertical: 13)),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
