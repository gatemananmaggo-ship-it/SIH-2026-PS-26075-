import 'package:flutter/material.dart';
import '../theme/palette.dart';

enum ToastType { info, success, warning }

/// Shows a bottom snackbar toast, mirroring `showToast()` in AppContext.jsx
/// (info / success / warning variants).
void showAppToast(BuildContext context, String message, {ToastType type = ToastType.info}) {
  final messenger = ScaffoldMessenger.of(context);
  messenger.hideCurrentSnackBar();

  late final Color accent;
  late final IconData icon;
  switch (type) {
    case ToastType.success:
      accent = AppColors.emerald500;
      icon = Icons.check_circle_rounded;
      break;
    case ToastType.warning:
      accent = AppColors.amber500;
      icon = Icons.error_outline_rounded;
      break;
    case ToastType.info:
      accent = AppColors.sky400;
      icon = Icons.info_rounded;
      break;
  }

  messenger.showSnackBar(
    SnackBar(
      content: Row(
        children: [
          Icon(icon, size: 18, color: accent),
          const SizedBox(width: 10),
          Expanded(
            child: Text(message, style: const TextStyle(fontSize: 13, color: Colors.white)),
          ),
        ],
      ),
      backgroundColor: AppColors.slate900,
      duration: const Duration(seconds: 3),
      behavior: SnackBarBehavior.floating,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: BorderSide(color: accent.withOpacity(0.4)),
      ),
      margin: const EdgeInsets.all(14),
    ),
  );
}
