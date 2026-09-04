import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';

import '../models/misc.dart';
import '../state/app_state.dart';
import '../theme/decorations.dart';
import '../theme/palette.dart';
import '../widgets/glass_card.dart';
import '../widgets/pill_badge.dart';
import '../widgets/stat_card.dart';
import '../widgets/notification_ticker.dart';
import '../widgets/course_card.dart';
import 'course_player_screen.dart';
import 'announcements_screen.dart';
import 'materials_library_screen.dart';

class HomeTab extends StatelessWidget {
  final void Function(int tabIndex) onNavigateToTab;
  const HomeTab({super.key, required this.onNavigateToTab});

  @override
  Widget build(BuildContext context) {
    final state = context.watch<AppState>();
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final user = state.currentUser;
    final featuredCourses = state.courses.where((c) => c.featured).take(4).toList();

    return Column(
      children: [
        NotificationTicker(
          announcements: state.announcements,
          onTap: () => Navigator.of(context)
              .push(MaterialPageRoute(builder: (_) => const AnnouncementsScreen())),
        ),
        Expanded(
          child: ListView(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 28),
            children: [
              // Welcome banner
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  gradient: AppDecor.welcomeBannerGradient,
                  borderRadius: BorderRadius.circular(22),
                  border: Border.all(color: Colors.white.withOpacity(0.08)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        CircleAvatar(
                          radius: 30,
                          backgroundColor: AppColors.moes400.withOpacity(0.4),
                          child: CircleAvatar(
                            radius: 27,
                            backgroundImage: NetworkImage(user.avatar),
                          ),
                        ),
                        const SizedBox(width: 14),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Wrap(
                                spacing: 6,
                                runSpacing: 4,
                                children: [
                                  PillBadge(
                                    text: 'TRAINEE WORKSPACE',
                                    background: AppColors.moes500.withOpacity(0.35),
                                    foreground: AppColors.sky200,
                                  ),
                                  PillBadge(
                                    text: 'APPROVED OFFICER',
                                    background: AppColors.emerald500.withOpacity(0.3),
                                    foreground: AppColors.emerald300,
                                  ),
                                ],
                              ),
                              const SizedBox(height: 8),
                              Text('Welcome, ${user.name}',
                                  style: const TextStyle(
                                      color: Colors.white, fontSize: 17, fontWeight: FontWeight.w800)),
                              const SizedBox(height: 3),
                              Text(
                                '${user.designation} • ${user.organization}',
                                style: const TextStyle(color: AppColors.slate300, fontSize: 11),
                                maxLines: 2,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 18),
                    Container(
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.08),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: Colors.white.withOpacity(0.08)),
                      ),
                      child: Row(
                        children: [
                          _metric('Enrolled', '${user.enrolledCourses.length}', AppColors.sky300),
                          _vDivider(),
                          _metric('Completed', '${user.completedCourses.length}', AppColors.emerald400),
                          _vDivider(),
                          _metric('Certificates', '${user.certificates.length}', AppColors.amber300),
                        ],
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 18),

              // Stats — two IntrinsicHeight rows so each card sizes to its own
              // content (title/label wrapping, larger system font scale, etc.)
              // instead of a fixed aspect ratio that can overflow.
              IntrinsicHeight(
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: const [
                    Expanded(
                      child: StatCard(
                        data: StatCardData(
                          label: 'Scientists Trained',
                          value: '9,840+',
                          subtext: 'Across IMD & MoES Wings',
                          icon: Icons.groups_rounded,
                          color: AppColors.sky500,
                          bg: Color(0x1A0EA5E9),
                        ),
                      ),
                    ),
                    SizedBox(width: 12),
                    Expanded(
                      child: StatCard(
                        data: StatCardData(
                          label: 'Courses & Modules',
                          value: '142+',
                          subtext: 'Radar, NWP, Satellite, Ocean',
                          icon: Icons.menu_book_rounded,
                          color: Color(0xFF6366F1),
                          bg: Color(0x1A6366F1),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 12),
              IntrinsicHeight(
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: const [
                    Expanded(
                      child: StatCard(
                        data: StatCardData(
                          label: 'Regional Centers',
                          value: '28',
                          subtext: 'RMCs, DWR Stations & Labs',
                          icon: Icons.location_on_rounded,
                          color: AppColors.emerald500,
                          bg: Color(0x1A10B981),
                        ),
                      ),
                    ),
                    SizedBox(width: 12),
                    Expanded(
                      child: StatCard(
                        data: StatCardData(
                          label: 'Passing Rate',
                          value: '94.6%',
                          subtext: 'WMO Standard Benchmark',
                          icon: Icons.emoji_events_rounded,
                          color: AppColors.amber500,
                          bg: Color(0x1AF59E0B),
                        ),
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 22),

              // Quick actions
              Row(
                children: [
                  Expanded(
                    child: _quickAction(
                      context,
                      icon: Icons.explore_rounded,
                      color: AppColors.sky400,
                      label: 'Explore Courses',
                      onTap: () => onNavigateToTab(1),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: _quickAction(
                      context,
                      icon: Icons.workspace_premium_rounded,
                      color: AppColors.amber500,
                      label: 'Assessments',
                      onTap: () => onNavigateToTab(2),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: _quickAction(
                      context,
                      icon: Icons.folder_shared_rounded,
                      color: AppColors.emerald500,
                      label: 'Faculty Library',
                      onTap: () => Navigator.of(context)
                          .push(MaterialPageRoute(builder: (_) => const MaterialsLibraryScreen())),
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 26),

              const SectionHeader(
                eyebrow: 'SPECIALIZED MOES / IMD CURRICULUM',
                eyebrowIcon: Icons.menu_book_rounded,
                eyebrowColor: AppColors.moes700,
                eyebrowBg: AppColors.moes100,
                title: 'Featured Courses',
                subtitle: 'Interactive, self-paced technical training for atmospheric scientists.',
              ),
              const SizedBox(height: 14),
              // SingleChildScrollView + IntrinsicHeight so the row sizes to
              // its tallest card's actual content height — this can never
              // overflow, unlike a fixed-height container paired with text
              // that grows (long titles, larger system font scale, etc).
              SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: IntrinsicHeight(
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      for (final course in featuredCourses) ...[
                        SizedBox(
                          width: 260,
                          child: Builder(builder: (context) {
                            final isEnrolled = state.currentUser.enrolledCourses.contains(course.id);
                            final isCompleted = state.currentUser.completedCourses.contains(course.id);
                            return CourseCard(
                              course: course,
                              action: isCompleted
                                  ? CourseCardAction.review
                                  : (isEnrolled ? CourseCardAction.continueLearning : CourseCardAction.enroll),
                              onPrimaryAction: () {
                                if (!isEnrolled) state.enrollCourse(course.id);
                                Navigator.of(context).push(
                                  MaterialPageRoute(builder: (_) => CoursePlayerScreen(courseId: course.id)),
                                );
                              },
                            );
                          }),
                        ),
                        const SizedBox(width: 14),
                      ],
                    ],
                  ),
                ),
              ),
              Align(
                alignment: Alignment.centerRight,
                child: TextButton.icon(
                  onPressed: () => onNavigateToTab(1),
                  icon: const Text('View full catalogue', style: TextStyle(fontSize: 12.5, fontWeight: FontWeight.bold)),
                  label: const Icon(Icons.chevron_right_rounded, size: 16),
                ),
              ),

              const SizedBox(height: 10),

              const SectionHeader(
                eyebrow: 'REAL-TIME BROADCAST CENTER',
                eyebrowIcon: Icons.campaign_rounded,
                eyebrowColor: AppColors.amber800,
                eyebrowBg: AppColors.amber100,
                title: 'Announcements & MoES Achievements',
                subtitle: 'Live updates from the Ministry of Earth Sciences Training Cell.',
              ),
              const SizedBox(height: 14),
              ...state.announcements.take(2).map((a) => Padding(
                    padding: const EdgeInsets.only(bottom: 12),
                    child: _announcementPreviewCard(context, a, isDark),
                  )),
              Align(
                alignment: Alignment.centerRight,
                child: TextButton.icon(
                  onPressed: () => Navigator.of(context)
                      .push(MaterialPageRoute(builder: (_) => const AnnouncementsScreen())),
                  icon: const Text('All circulars', style: TextStyle(fontSize: 12.5, fontWeight: FontWeight.bold)),
                  label: const Icon(Icons.chevron_right_rounded, size: 16),
                ),
              ),

              const SizedBox(height: 10),

              const SectionHeader(
                eyebrow: 'FACULTY & MENTORSHIP NETWORK',
                eyebrowIcon: Icons.school_rounded,
                eyebrowColor: Color(0xFF4338CA),
                eyebrowBg: Color(0xFFE0E7FF),
                title: 'Leading MoES Scientists',
                subtitle: 'Certified senior meteorologists and oceanographers.',
              ),
              const SizedBox(height: 14),
              ...state.faculty.map((f) => Padding(
                    padding: const EdgeInsets.only(bottom: 12),
                    child: GlassCard(
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          CircleAvatar(radius: 26, backgroundImage: NetworkImage(f.avatar)),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  children: [
                                    Expanded(
                                      child: Text(f.name,
                                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13.5)),
                                    ),
                                    const Icon(Icons.star_rounded, size: 14, color: AppColors.amber500),
                                    const SizedBox(width: 2),
                                    Text('${f.rating}',
                                        style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                                  ],
                                ),
                                Text(f.designation,
                                    style: const TextStyle(
                                        fontSize: 11.5, color: AppColors.moes600, fontWeight: FontWeight.w600)),
                                Text(f.organization,
                                    style: TextStyle(
                                        fontSize: 11, color: isDark ? AppColors.slate400 : AppColors.slate500)),
                                const SizedBox(height: 6),
                                Text(f.bio,
                                    maxLines: 3,
                                    overflow: TextOverflow.ellipsis,
                                    style: TextStyle(
                                        fontSize: 11.5,
                                        height: 1.4,
                                        color: isDark ? AppColors.slate300 : AppColors.slate600)),
                                const SizedBox(height: 8),
                                Wrap(
                                  spacing: 6,
                                  runSpacing: 6,
                                  children: f.specializations
                                      .map((s) => Container(
                                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                            decoration: BoxDecoration(
                                              color: isDark ? AppColors.slate800 : AppColors.slate100,
                                              borderRadius: BorderRadius.circular(8),
                                            ),
                                            child: Text(s,
                                                style: TextStyle(
                                                    fontSize: 10,
                                                    fontWeight: FontWeight.w600,
                                                    color: isDark ? AppColors.slate300 : AppColors.slate600)),
                                          ))
                                      .toList(),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  )),

              const SizedBox(height: 8),
              _footerCard(context, isDark),
            ],
          ),
        ),
      ],
    );
  }

  Widget _metric(String label, String value, Color color) {
    return Expanded(
      child: Column(
        children: [
          Text(label.toUpperCase(),
              style: const TextStyle(color: AppColors.slate300, fontSize: 9, fontWeight: FontWeight.w700)),
          const SizedBox(height: 3),
          Text(value, style: TextStyle(color: color, fontSize: 18, fontWeight: FontWeight.w900)),
        ],
      ),
    );
  }

  Widget _vDivider() => Container(width: 1, height: 28, color: Colors.white.withOpacity(0.15));

  Widget _quickAction(BuildContext context,
      {required IconData icon, required Color color, required String label, required VoidCallback onTap}) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return GlassCard(
      padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 8),
      onTap: onTap,
      child: Column(
        children: [
          Container(
            width: 38,
            height: 38,
            decoration: BoxDecoration(color: color.withOpacity(0.16), borderRadius: BorderRadius.circular(11)),
            child: Icon(icon, color: color, size: 19),
          ),
          const SizedBox(height: 8),
          Text(
            label,
            textAlign: TextAlign.center,
            style: TextStyle(
                fontSize: 10.5,
                fontWeight: FontWeight.w700,
                color: isDark ? Colors.white : AppColors.slate800),
          ),
        ],
      ),
    );
  }

  Widget _announcementPreviewCard(BuildContext context, Announcement a, bool isDark) {
    return GlassCard(
      borderColor: a.urgent ? AppColors.red300 : null,
      onTap: () => Navigator.of(context).push(MaterialPageRoute(builder: (_) => const AnnouncementsScreen())),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              PillBadge(
                text: a.category,
                background: a.urgent
                    ? AppColors.red100
                    : (isDark ? AppColors.moes900 : AppColors.moes100),
                foreground: a.urgent ? AppColors.red700 : AppColors.moes700,
              ),
              const Spacer(),
              Text(a.date, style: TextStyle(fontSize: 10.5, color: isDark ? AppColors.slate400 : AppColors.slate500)),
            ],
          ),
          const SizedBox(height: 8),
          Text(a.title,
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
          const SizedBox(height: 4),
          Text(a.summary,
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
              style: TextStyle(fontSize: 11.5, color: isDark ? AppColors.slate400 : AppColors.slate500, height: 1.4)),
        ],
      ),
    );
  }

  Widget _footerCard(BuildContext context, bool isDark) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: AppColors.slate900,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 30,
                height: 30,
                decoration: BoxDecoration(color: AppColors.moes600, borderRadius: BorderRadius.circular(9)),
                child: const Icon(Icons.podcasts_rounded, size: 15, color: Colors.white),
              ),
              const SizedBox(width: 8),
              const Text('CAPACITY CONNECT',
                  style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13)),
            ],
          ),
          const SizedBox(height: 10),
          const Text(
            'Centralized Digital Capacity Building & Learning Management Portal for MoES, IMD, INCOIS, NCMRWF, IITM and NIOT.',
            style: TextStyle(color: AppColors.slate400, fontSize: 11.5, height: 1.5),
          ),
          const SizedBox(height: 10),
          Row(
            children: const [
              Icon(Icons.shield_rounded, size: 13, color: AppColors.amber400),
              SizedBox(width: 6),
              Expanded(
                child: Text('Compliant with WMO-No. 1083 & CBC Standards',
                    style: TextStyle(color: AppColors.amber400, fontSize: 11)),
              ),
            ],
          ),
          const Divider(color: Colors.white12, height: 26),
          _contactRow(Icons.location_on_outlined, 'Capacity Building Cell, Prithvi Bhavan, Lodhi Road, New Delhi - 110003'),
          const SizedBox(height: 8),
          _contactRow(Icons.email_outlined, 'capacity.connect@moes.gov.in', onTap: () {
            launchUrl(Uri.parse('mailto:capacity.connect@moes.gov.in'));
          }),
          const SizedBox(height: 8),
          _contactRow(Icons.phone_outlined, '+91-11-24669500 / Toll Free: 1800-180-1717', onTap: () {
            launchUrl(Uri.parse('tel:+911124669500'));
          }),
          const SizedBox(height: 16),
          const Text('© 2026 Ministry of Earth Sciences (MoES), Government of India.',
              style: TextStyle(color: AppColors.slate500, fontSize: 10)),
          const SizedBox(height: 3),
          const Text('Smart India Hackathon 2026 • Problem Statement ID: 26075',
              style: TextStyle(color: AppColors.amber400, fontSize: 10, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }

  Widget _contactRow(IconData icon, String text, {VoidCallback? onTap}) {
    return GestureDetector(
      onTap: onTap,
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, size: 14, color: AppColors.moes400),
          const SizedBox(width: 8),
          Expanded(
            child: Text(text, style: const TextStyle(color: AppColors.slate400, fontSize: 11.5)),
          ),
        ],
      ),
    );
  }
}
