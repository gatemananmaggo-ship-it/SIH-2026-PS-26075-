import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'palette.dart';

/// Builds the light & dark themes for CAPACITY CONNECT, mirroring the
/// web app's Inter (body) / Outfit (headings) type system and the
/// moes / navy / saffron / slate colour system defined in index.css
/// and tailwind.config.js.
class AppTheme {
  AppTheme._();

  static TextTheme _textTheme(Brightness brightness) {
    final base = brightness == Brightness.dark
        ? Typography.whiteMountainView
        : Typography.blackMountainView;
    final body = GoogleFonts.interTextTheme(base);
    final headingColor =
        brightness == Brightness.dark ? Colors.white : AppColors.slate900;
    return body.copyWith(
      displayLarge: GoogleFonts.outfit(
          textStyle: body.displayLarge, fontWeight: FontWeight.w800, color: headingColor),
      displayMedium: GoogleFonts.outfit(
          textStyle: body.displayMedium, fontWeight: FontWeight.w800, color: headingColor),
      displaySmall: GoogleFonts.outfit(
          textStyle: body.displaySmall, fontWeight: FontWeight.w800, color: headingColor),
      headlineLarge: GoogleFonts.outfit(
          textStyle: body.headlineLarge, fontWeight: FontWeight.w800, color: headingColor),
      headlineMedium: GoogleFonts.outfit(
          textStyle: body.headlineMedium, fontWeight: FontWeight.w700, color: headingColor),
      headlineSmall: GoogleFonts.outfit(
          textStyle: body.headlineSmall, fontWeight: FontWeight.w700, color: headingColor),
      titleLarge: GoogleFonts.outfit(
          textStyle: body.titleLarge, fontWeight: FontWeight.w700, color: headingColor),
      titleMedium: GoogleFonts.outfit(
          textStyle: body.titleMedium, fontWeight: FontWeight.w700, color: headingColor),
      titleSmall: GoogleFonts.outfit(
          textStyle: body.titleSmall, fontWeight: FontWeight.w700, color: headingColor),
    );
  }

  static ThemeData light() {
    final scheme = ColorScheme.light(
      primary: AppColors.moes600,
      onPrimary: Colors.white,
      secondary: AppColors.saffron500,
      onSecondary: Colors.white,
      surface: Colors.white,
      onSurface: AppColors.slate900,
      error: AppColors.red600,
      onError: Colors.white,
    );
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      colorScheme: scheme,
      scaffoldBackgroundColor: AppColors.slate50,
      textTheme: _textTheme(Brightness.light),
      appBarTheme: const AppBarTheme(
        backgroundColor: Colors.transparent,
        foregroundColor: AppColors.slate900,
        elevation: 0,
        surfaceTintColor: Colors.transparent,
      ),
      dividerColor: AppColors.slate200,
      cardColor: Colors.white,
      splashFactory: InkRipple.splashFactory,
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: Colors.white,
        contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppColors.slate300),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppColors.slate300),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppColors.moes500, width: 2),
        ),
        hintStyle: const TextStyle(color: AppColors.slate400, fontSize: 13),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.moes600,
          foregroundColor: Colors.white,
          elevation: 0,
          padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 14),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
          textStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
        ),
      ),
      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: Colors.white,
        selectedItemColor: AppColors.moes600,
        unselectedItemColor: AppColors.slate400,
        showUnselectedLabels: true,
        type: BottomNavigationBarType.fixed,
        elevation: 8,
      ),
      snackBarTheme: SnackBarThemeData(
        backgroundColor: AppColors.slate900,
        contentTextStyle: const TextStyle(color: Colors.white, fontSize: 13),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      ),
    );
  }

  static ThemeData dark() {
    final scheme = ColorScheme.dark(
      primary: AppColors.moes400,
      onPrimary: AppColors.navy950,
      secondary: AppColors.saffron400,
      onSecondary: AppColors.navy950,
      surface: AppColors.navy800,
      onSurface: AppColors.slate100,
      error: AppColors.red400,
      onError: AppColors.navy950,
    );
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      colorScheme: scheme,
      scaffoldBackgroundColor: AppColors.navy900,
      textTheme: _textTheme(Brightness.dark),
      appBarTheme: const AppBarTheme(
        backgroundColor: Colors.transparent,
        foregroundColor: Colors.white,
        elevation: 0,
        surfaceTintColor: Colors.transparent,
      ),
      dividerColor: Colors.white12,
      cardColor: AppColors.navy800,
      splashFactory: InkRipple.splashFactory,
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: AppColors.slate800,
        contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppColors.slate700),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppColors.slate700),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppColors.moes400, width: 2),
        ),
        hintStyle: const TextStyle(color: AppColors.slate500, fontSize: 13),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.moes600,
          foregroundColor: Colors.white,
          elevation: 0,
          padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 14),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
          textStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
        ),
      ),
      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: AppColors.navy900,
        selectedItemColor: AppColors.sky400,
        unselectedItemColor: AppColors.slate500,
        showUnselectedLabels: true,
        type: BottomNavigationBarType.fixed,
        elevation: 8,
      ),
      snackBarTheme: SnackBarThemeData(
        backgroundColor: AppColors.slate800,
        contentTextStyle: const TextStyle(color: Colors.white, fontSize: 13),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      ),
    );
  }
}
