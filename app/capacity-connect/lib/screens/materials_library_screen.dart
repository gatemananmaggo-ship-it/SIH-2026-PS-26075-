import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../state/app_state.dart';
import '../theme/palette.dart';
import '../widgets/glass_card.dart';
import '../widgets/app_toast.dart';

class MaterialsLibraryScreen extends StatelessWidget {
  const MaterialsLibraryScreen({super.key});

  IconData _icon(String type) {
    switch (type) {
      case 'PDF':
        return Icons.picture_as_pdf_rounded;
      case 'PPTX':
        return Icons.slideshow_rounded;
      case 'NetCDF':
        return Icons.dataset_rounded;
      default:
        return Icons.description_rounded;
    }
  }

  @override
  Widget build(BuildContext context) {
    final state = context.watch<AppState>();
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final materials = state.trainerMaterials;

    return Scaffold(
      appBar: AppBar(title: const Text('Trainer Shared Library', style: TextStyle(fontSize: 15))),
      body: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: materials.length,
        separatorBuilder: (_, __) => const SizedBox(height: 12),
        itemBuilder: (context, i) {
          final m = materials[i];
          return GlassCard(
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  width: 42,
                  height: 42,
                  decoration: BoxDecoration(
                    color: AppColors.moes500.withOpacity(0.12),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(_icon(m.fileType), color: AppColors.moes600, size: 21),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Expanded(
                            child: Text(m.title,
                                maxLines: 2,
                                overflow: TextOverflow.ellipsis,
                                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                          ),
                        ],
                      ),
                      const SizedBox(height: 4),
                      Text(m.description,
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                          style: TextStyle(
                              fontSize: 11.5, color: isDark ? AppColors.slate400 : AppColors.slate500, height: 1.4)),
                      const SizedBox(height: 8),
                      Wrap(
                        spacing: 6,
                        runSpacing: 6,
                        children: [
                          _chip(m.domain, isDark),
                          _chip('${m.fileType} • ${m.fileSize}', isDark),
                          _chip(m.accessRole, isDark),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Row(
                        children: [
                          Icon(Icons.person_outline_rounded, size: 12, color: isDark ? AppColors.slate500 : AppColors.slate400),
                          const SizedBox(width: 4),
                          Expanded(
                            child: Text('${m.trainerName} • ${m.uploadDate}',
                                style: TextStyle(fontSize: 10.5, color: isDark ? AppColors.slate500 : AppColors.slate400)),
                          ),
                          Icon(Icons.download_rounded, size: 12, color: isDark ? AppColors.slate500 : AppColors.slate400),
                          const SizedBox(width: 3),
                          Text('${m.downloads}',
                              style: TextStyle(fontSize: 10.5, color: isDark ? AppColors.slate500 : AppColors.slate400)),
                        ],
                      ),
                      const SizedBox(height: 10),
                      SizedBox(
                        width: double.infinity,
                        child: OutlinedButton.icon(
                          onPressed: () => showAppToast(context, 'Downloading ${m.title}...'),
                          icon: const Icon(Icons.download_rounded, size: 15),
                          label: const Text('Download'),
                          style: OutlinedButton.styleFrom(
                              padding: const EdgeInsets.symmetric(vertical: 9),
                              textStyle: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _chip(String text, bool isDark) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
      decoration: BoxDecoration(
        color: isDark ? AppColors.slate800 : AppColors.slate100,
        borderRadius: BorderRadius.circular(6),
      ),
      child: Text(text,
          style: TextStyle(fontSize: 9.5, fontWeight: FontWeight.w600, color: isDark ? AppColors.slate300 : AppColors.slate600)),
    );
  }
}
