import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../state/app_state.dart';
import '../theme/palette.dart';
import '../widgets/glass_card.dart';
import 'certificate_detail_screen.dart';

class CertificatesTab extends StatelessWidget {
  const CertificatesTab({super.key});

  @override
  Widget build(BuildContext context) {
    final state = context.watch<AppState>();
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final certs = state.currentUser.certificates;

    if (certs.isEmpty) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(32),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(Icons.workspace_premium_outlined, size: 56, color: AppColors.slate400),
              const SizedBox(height: 16),
              const Text('No certificates earned yet',
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
              const SizedBox(height: 8),
              Text(
                'Pass a course MCQ assessment to earn a tamper-evident e-Certificate with QR verification.',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 12, color: isDark ? AppColors.slate400 : AppColors.slate500, height: 1.5),
              ),
            ],
          ),
        ),
      );
    }

    return ListView.separated(
      padding: const EdgeInsets.fromLTRB(16, 14, 16, 24),
      itemCount: certs.length,
      separatorBuilder: (_, __) => const SizedBox(height: 14),
      itemBuilder: (context, i) {
        final cert = certs[i];
        return GlassCard(
          onTap: () => Navigator.of(context)
              .push(MaterialPageRoute(builder: (_) => CertificateDetailScreen(certificateId: cert.id))),
          padding: EdgeInsets.zero,
          child: Column(
            children: [
              Container(
                height: 8,
                decoration: const BoxDecoration(
                  gradient: LinearGradient(colors: [AppColors.saffron500, AppColors.saffron600]),
                ),
              ),
              Padding(
                padding: const EdgeInsets.all(16),
                child: Row(
                  children: [
                    Container(
                      width: 46,
                      height: 46,
                      decoration: BoxDecoration(
                        color: AppColors.amber500.withOpacity(0.15),
                        borderRadius: BorderRadius.circular(13),
                      ),
                      child: const Icon(Icons.workspace_premium_rounded, color: AppColors.amber600, size: 24),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(cert.courseTitle,
                              maxLines: 2,
                              overflow: TextOverflow.ellipsis,
                              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13.5)),
                          const SizedBox(height: 4),
                          Text('Issued ${cert.issueDate} • ${cert.grade}',
                              style: TextStyle(
                                  fontSize: 11, color: isDark ? AppColors.slate400 : AppColors.slate500)),
                        ],
                      ),
                    ),
                    Column(
                      children: [
                        Text('${cert.score}%',
                            style: const TextStyle(
                                color: AppColors.emerald600, fontWeight: FontWeight.w900, fontSize: 16)),
                        const Icon(Icons.chevron_right_rounded, size: 18, color: AppColors.slate400),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}
