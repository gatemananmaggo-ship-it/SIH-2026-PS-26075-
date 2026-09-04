import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../state/app_state.dart';
import '../theme/palette.dart';
import '../widgets/glass_card.dart';
import '../widgets/pill_badge.dart';

class AnnouncementsScreen extends StatelessWidget {
  const AnnouncementsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final state = context.watch<AppState>();
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final announcements = state.announcements.where((a) => a.targetRole == 'all' || a.targetRole == 'trainee').toList();

    return Scaffold(
      appBar: AppBar(title: const Text('Announcements & Circulars', style: TextStyle(fontSize: 15))),
      body: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: announcements.length,
        separatorBuilder: (_, __) => const SizedBox(height: 12),
        itemBuilder: (context, i) {
          final a = announcements[i];
          return GlassCard(
            borderColor: a.urgent ? AppColors.red300 : null,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    PillBadge(
                      text: a.category,
                      background: a.urgent ? AppColors.red100 : (isDark ? AppColors.moes900 : AppColors.moes100),
                      foreground: a.urgent ? AppColors.red700 : AppColors.moes700,
                      icon: a.urgent ? Icons.warning_amber_rounded : null,
                    ),
                    const Spacer(),
                    Text(a.date, style: TextStyle(fontSize: 11, color: isDark ? AppColors.slate400 : AppColors.slate500)),
                  ],
                ),
                const SizedBox(height: 10),
                Text(a.title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, height: 1.3)),
                const SizedBox(height: 6),
                Text(a.summary,
                    style: TextStyle(fontSize: 12.5, color: isDark ? AppColors.slate300 : AppColors.slate600, height: 1.5)),
                const SizedBox(height: 10),
                Row(
                  children: [
                    Icon(Icons.person_outline_rounded, size: 13, color: isDark ? AppColors.slate500 : AppColors.slate400),
                    const SizedBox(width: 4),
                    Expanded(
                      child: Text(a.publishedBy,
                          style: TextStyle(fontSize: 10.5, color: isDark ? AppColors.slate500 : AppColors.slate400)),
                    ),
                    Text(a.linkText,
                        style: const TextStyle(fontSize: 11.5, fontWeight: FontWeight.bold, color: AppColors.moes600)),
                    const Icon(Icons.chevron_right_rounded, size: 15, color: AppColors.moes600),
                  ],
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}
