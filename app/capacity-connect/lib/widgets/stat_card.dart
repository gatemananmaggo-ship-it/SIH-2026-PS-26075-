import 'package:flutter/material.dart';
import '../theme/palette.dart';
import 'glass_card.dart';

class StatCardData {
  final String label;
  final String value;
  final String subtext;
  final IconData icon;
  final Color color;
  final Color bg;

  const StatCardData({
    required this.label,
    required this.value,
    required this.subtext,
    required this.icon,
    required this.color,
    required this.bg,
  });
}

/// Mirrors `StatCounter.jsx` — the four highlight metric cards.
class StatCard extends StatelessWidget {
  final StatCardData data;

  const StatCard({super.key, required this.data});

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return GlassCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                width: 38,
                height: 38,
                decoration: BoxDecoration(color: data.bg, borderRadius: BorderRadius.circular(11)),
                child: Icon(data.icon, size: 19, color: data.color),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
                decoration: BoxDecoration(
                  color: isDark ? AppColors.emerald950.withOpacity(0.5) : AppColors.emerald50,
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(Icons.trending_up_rounded,
                        size: 11, color: isDark ? AppColors.emerald400 : AppColors.emerald600),
                    const SizedBox(width: 3),
                    Text('Active',
                        style: TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.w700,
                            color: isDark ? AppColors.emerald400 : AppColors.emerald600)),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Text(data.value, style: Theme.of(context).textTheme.headlineMedium),
          const SizedBox(height: 2),
          Text(data.label, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
          const SizedBox(height: 2),
          Text(data.subtext,
              style: TextStyle(fontSize: 11, color: isDark ? AppColors.slate400 : AppColors.slate500)),
        ],
      ),
    );
  }
}
