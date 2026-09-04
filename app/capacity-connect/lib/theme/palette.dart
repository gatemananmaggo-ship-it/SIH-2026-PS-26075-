import 'package:flutter/material.dart';

/// Colour palette ported 1:1 from the web app's `tailwind.config.js`
/// plus the standard Tailwind CSS v3 default scales it relies on
/// (slate / amber / emerald / sky / red) for a pixel-accurate theme.
class AppColors {
  AppColors._();

  // ---- Brand: "moes" (custom, from tailwind.config.js) ----
  static const moes50 = Color(0xFFF0F7FF);
  static const moes100 = Color(0xFFE0EFFE);
  static const moes200 = Color(0xFFBAE0FD);
  static const moes300 = Color(0xFF7CC7FB);
  static const moes400 = Color(0xFF38A9F6);
  static const moes500 = Color(0xFF0E8CE6);
  static const moes600 = Color(0xFF026FC4);
  static const moes700 = Color(0xFF03589F);
  static const moes800 = Color(0xFF074B83);
  static const moes900 = Color(0xFF0C3F6D);
  static const moes950 = Color(0xFF072849);

  // ---- Brand: "navy" (custom) ----
  static const navy800 = Color(0xFF0A1E3F);
  static const navy900 = Color(0xFF061329);
  static const navy950 = Color(0xFF030B18);

  // ---- Brand: "saffron" (custom — coincides with tailwind amber 400-600) ----
  static const saffron400 = Color(0xFFFBBF24);
  static const saffron500 = Color(0xFFF59E0B);
  static const saffron600 = Color(0xFFD97706);

  // ---- Tailwind default: slate ----
  static const slate50 = Color(0xFFF8FAFC);
  static const slate100 = Color(0xFFF1F5F9);
  static const slate200 = Color(0xFFE2E8F0);
  static const slate300 = Color(0xFFCBD5E1);
  static const slate400 = Color(0xFF94A3B8);
  static const slate500 = Color(0xFF64748B);
  static const slate600 = Color(0xFF475569);
  static const slate700 = Color(0xFF334155);
  static const slate800 = Color(0xFF1E293B);
  static const slate900 = Color(0xFF0F172A);
  static const slate950 = Color(0xFF020617);

  // ---- Tailwind default: amber ----
  static const amber50 = Color(0xFFFFFBEB);
  static const amber100 = Color(0xFFFEF3C7);
  static const amber200 = Color(0xFFFDE68A);
  static const amber300 = Color(0xFFFCD34D);
  static const amber400 = saffron400;
  static const amber500 = saffron500;
  static const amber600 = saffron600;
  static const amber700 = Color(0xFFB45309);
  static const amber800 = Color(0xFF92400E);
  static const amber900 = Color(0xFF78350F);
  static const amber950 = Color(0xFF451A03);

  // ---- Tailwind default: emerald ----
  static const emerald50 = Color(0xFFECFDF5);
  static const emerald100 = Color(0xFFD1FAE5);
  static const emerald200 = Color(0xFFA7F3D0);
  static const emerald300 = Color(0xFF6EE7B7);
  static const emerald400 = Color(0xFF34D399);
  static const emerald500 = Color(0xFF10B981);
  static const emerald600 = Color(0xFF059669);
  static const emerald700 = Color(0xFF047857);
  static const emerald800 = Color(0xFF065F46);
  static const emerald900 = Color(0xFF064E3B);
  static const emerald950 = Color(0xFF022C22);

  // ---- Tailwind default: sky ----
  static const sky50 = Color(0xFFF0F9FF);
  static const sky100 = Color(0xFFE0F2FE);
  static const sky200 = Color(0xFFBAE6FD);
  static const sky300 = Color(0xFF7DD3FC);
  static const sky400 = Color(0xFF38BDF8);
  static const sky500 = Color(0xFF0EA5E9);
  static const sky600 = Color(0xFF0284C7);
  static const sky700 = Color(0xFF0369A1);
  static const sky800 = Color(0xFF075985);
  static const sky900 = Color(0xFF0C4A6E);
  static const sky950 = Color(0xFF082F49);

  // ---- Tailwind default: red ----
  static const red50 = Color(0xFFFEF2F2);
  static const red100 = Color(0xFFFEE2E2);
  static const red200 = Color(0xFFFECACA);
  static const red300 = Color(0xFFFCA5A5);
  static const red400 = Color(0xFFF87171);
  static const red500 = Color(0xFFEF4444);
  static const red600 = Color(0xFFDC2626);
  static const red700 = Color(0xFFB91C1C);
  static const red800 = Color(0xFF991B1B);
  static const red900 = Color(0xFF7F1D1D);
  static const red950 = Color(0xFF450A0A);
}
