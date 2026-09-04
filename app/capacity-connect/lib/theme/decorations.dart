import 'dart:ui';
import 'package:flutter/material.dart';
import 'palette.dart';

/// Reusable visual language ported from the web app's `.glass-card`,
/// `.glass-nav` and hero gradient CSS classes.
class AppDecor {
  AppDecor._();

  static BoxDecoration glassCard(bool isDark, {double radius = 20, Color? borderColor}) {
    return BoxDecoration(
      color: isDark
          ? AppColors.navy800.withOpacity(0.7)
          : Colors.white.withOpacity(0.85),
      borderRadius: BorderRadius.circular(radius),
      border: Border.all(
        color: borderColor ??
            (isDark ? Colors.white.withOpacity(0.08) : AppColors.slate200.withOpacity(0.8)),
      ),
      boxShadow: [
        BoxShadow(
          color: Colors.black.withOpacity(isDark ? 0.35 : 0.06),
          blurRadius: 18,
          offset: const Offset(0, 8),
        ),
      ],
    );
  }

  /// Frosted blur wrapper — use around a Container with [glassCard] decoration
  /// for a true glassmorphism effect (mirrors `backdrop-filter: blur(...)`).
  static Widget blurWrap({required Widget child, double sigma = 12, BorderRadius? radius}) {
    return ClipRRect(
      borderRadius: radius ?? BorderRadius.circular(20),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: sigma, sigmaY: sigma),
        child: child,
      ),
    );
  }

  static const LinearGradient heroGradient = LinearGradient(
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
    colors: [AppColors.slate900, AppColors.navy900, AppColors.slate950],
  );

  static const LinearGradient welcomeBannerGradient = LinearGradient(
    begin: Alignment.centerLeft,
    end: Alignment.centerRight,
    colors: [AppColors.moes900, AppColors.navy900, AppColors.slate900],
  );

  static const LinearGradient brandTextGradient = LinearGradient(
    colors: [AppColors.moes700, AppColors.moes500, AppColors.sky400],
  );

  static const LinearGradient headerBarGradient = LinearGradient(
    begin: Alignment.centerLeft,
    end: Alignment.centerRight,
    colors: [AppColors.moes700, AppColors.navy900],
  );

  static const LinearGradient goldRibbonGradient = LinearGradient(
    colors: [AppColors.saffron500, AppColors.saffron600],
  );
}
