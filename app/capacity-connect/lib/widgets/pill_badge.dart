import 'package:flutter/material.dart';

/// Small rounded uppercase label used for domain tags, status chips, etc.
/// Mirrors the `bg-*-100 text-*-700 rounded px-2.5 py-0.5` badge pattern
/// used throughout the web app.
class PillBadge extends StatelessWidget {
  final String text;
  final Color background;
  final Color foreground;
  final IconData? icon;
  final double fontSize;
  final FontWeight fontWeight;
  final EdgeInsetsGeometry padding;

  const PillBadge({
    super.key,
    required this.text,
    required this.background,
    required this.foreground,
    this.icon,
    this.fontSize = 10,
    this.fontWeight = FontWeight.w800,
    this.padding = const EdgeInsets.symmetric(horizontal: 9, vertical: 3),
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: padding,
      decoration: BoxDecoration(
        color: background,
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (icon != null) ...[
            Icon(icon, size: fontSize + 2, color: foreground),
            const SizedBox(width: 4),
          ],
          Text(
            text,
            style: TextStyle(
              color: foreground,
              fontSize: fontSize,
              fontWeight: fontWeight,
              letterSpacing: 0.4,
            ),
          ),
        ],
      ),
    );
  }
}

/// Section eyebrow + title + subtitle header used above most
/// content sections (course catalogue, announcements, etc).
class SectionHeader extends StatelessWidget {
  final String eyebrow;
  final IconData eyebrowIcon;
  final Color eyebrowColor;
  final Color eyebrowBg;
  final String title;
  final String? subtitle;

  const SectionHeader({
    super.key,
    required this.eyebrow,
    required this.eyebrowIcon,
    required this.eyebrowColor,
    required this.eyebrowBg,
    required this.title,
    this.subtitle,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        PillBadge(text: eyebrow, background: eyebrowBg, foreground: eyebrowColor, icon: eyebrowIcon),
        const SizedBox(height: 8),
        Text(title, style: theme.textTheme.headlineSmall),
        if (subtitle != null) ...[
          const SizedBox(height: 4),
          Text(subtitle!,
              style: theme.textTheme.bodySmall?.copyWith(
                color: theme.brightness == Brightness.dark ? Colors.white70 : Colors.black54,
              )),
        ],
      ],
    );
  }
}
