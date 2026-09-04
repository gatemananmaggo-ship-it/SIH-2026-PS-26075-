import 'dart:async';
import 'package:flutter/material.dart';
import '../models/misc.dart';
import '../theme/palette.dart';

/// Auto-scrolling MoES broadcast bar — mirrors `NotificationTicker.jsx`.
class NotificationTicker extends StatefulWidget {
  final List<Announcement> announcements;
  final VoidCallback onTap;

  const NotificationTicker({super.key, required this.announcements, required this.onTap});

  @override
  State<NotificationTicker> createState() => _NotificationTickerState();
}

class _NotificationTickerState extends State<NotificationTicker> {
  final ScrollController _controller = ScrollController();
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => _startTicking());
  }

  void _startTicking() {
    _timer = Timer.periodic(const Duration(milliseconds: 40), (_) {
      if (!_controller.hasClients) return;
      final next = _controller.offset + 1.1;
      _controller.jumpTo(next);
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final items = widget.announcements;
    if (items.isEmpty) return const SizedBox.shrink();

    // This is a dense, decorative marquee bar (like the web app's ticker,
    // which also doesn't reflow) — text scale is intentionally clamped so
    // large system font settings can't push it past its fixed bar height.
    return MediaQuery(
      data: MediaQuery.of(context).copyWith(textScaler: TextScaler.noScaling),
      child: Container(
        color: AppColors.moes900,
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            const Icon(Icons.warning_amber_rounded, size: 14, color: AppColors.amber400),
            const SizedBox(width: 5),
            const Text(
              'MoES Broadcast',
              style: TextStyle(
                color: AppColors.amber400,
                fontSize: 10.5,
                fontWeight: FontWeight.w800,
                letterSpacing: 0.4,
              ),
            ),
            Container(
              margin: const EdgeInsets.symmetric(horizontal: 10),
              width: 1,
              height: 14,
              color: AppColors.moes700,
            ),
            Expanded(
              child: SizedBox(
                height: 22,
                child: ListView.builder(
                  controller: _controller,
                  scrollDirection: Axis.horizontal,
                  physics: const NeverScrollableScrollPhysics(),
                  itemBuilder: (context, index) {
                    final item = items[index % items.length];
                    return GestureDetector(
                      onTap: widget.onTap,
                      child: Padding(
                        padding: const EdgeInsets.only(right: 26),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          crossAxisAlignment: CrossAxisAlignment.center,
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                              decoration: BoxDecoration(
                                color: item.urgent ? AppColors.red500.withOpacity(0.85) : AppColors.moes700,
                                borderRadius: BorderRadius.circular(4),
                              ),
                              child: Text(
                                item.category,
                                style: const TextStyle(
                                    color: Colors.white, fontSize: 9, fontWeight: FontWeight.w800),
                              ),
                            ),
                            const SizedBox(width: 8),
                            Text(item.title,
                                style: const TextStyle(color: Colors.white70, fontSize: 11.5)),
                          ],
                        ),
                      ),
                    );
                  },
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
