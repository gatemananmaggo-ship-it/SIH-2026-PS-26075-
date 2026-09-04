import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../state/app_state.dart';
import '../theme/palette.dart';
import '../widgets/app_toast.dart';
import 'home_tab.dart';
import 'my_learning_tab.dart';
import 'assessments_tab.dart';
import 'certificates_tab.dart';
import 'profile_tab.dart';
import 'announcements_screen.dart';
import 'login_screen.dart';

/// Hosts the five trainee destinations behind a bottom navigation bar,
/// mirroring the web app's top Navbar (Portal Home / My Dashboard /
/// Certificates) plus the dashboard's internal tab set, reshaped for
/// a mobile-first information architecture.
class RootShell extends StatefulWidget {
  final int initialIndex;
  const RootShell({super.key, this.initialIndex = 0});

  @override
  State<RootShell> createState() => _RootShellState();
}

class _RootShellState extends State<RootShell> {
  late int _index = widget.initialIndex;

  void goToTab(int i) => setState(() => _index = i);

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final state = context.watch<AppState>();

    final tabs = [
      HomeTab(onNavigateToTab: goToTab),
      const MyLearningTab(),
      const AssessmentsTab(),
      const CertificatesTab(),
      const ProfileTab(),
    ];

    final titles = ['Portal Home', 'My Learning', 'Assessments', 'Certificates', 'My Profile'];

    return Scaffold(
      appBar: _buildAppBar(context, isDark, state, titles[_index]),
      body: IndexedStack(index: _index, children: tabs),
      bottomNavigationBar: NavigationBarTheme(
        data: NavigationBarThemeData(
          backgroundColor: isDark ? AppColors.navy900 : Colors.white,
          indicatorColor: (isDark ? AppColors.moes500 : AppColors.moes100).withOpacity(isDark ? 0.35 : 1),
          labelTextStyle: WidgetStateProperty.resolveWith((states) {
            final selected = states.contains(WidgetState.selected);
            return TextStyle(
              fontSize: 10.5,
              fontWeight: selected ? FontWeight.w800 : FontWeight.w500,
              color: selected
                  ? (isDark ? AppColors.sky300 : AppColors.moes700)
                  : (isDark ? AppColors.slate500 : AppColors.slate500),
            );
          }),
        ),
        child: NavigationBar(
          selectedIndex: _index,
          onDestinationSelected: goToTab,
          height: 64,
          destinations: const [
            NavigationDestination(icon: Icon(Icons.explore_outlined), selectedIcon: Icon(Icons.explore), label: 'Home'),
            NavigationDestination(
                icon: Icon(Icons.menu_book_outlined), selectedIcon: Icon(Icons.menu_book), label: 'Learning'),
            NavigationDestination(
                icon: Icon(Icons.workspace_premium_outlined),
                selectedIcon: Icon(Icons.workspace_premium),
                label: 'Assessments'),
            NavigationDestination(
                icon: Icon(Icons.military_tech_outlined),
                selectedIcon: Icon(Icons.military_tech),
                label: 'Certificates'),
            NavigationDestination(icon: Icon(Icons.person_outline), selectedIcon: Icon(Icons.person), label: 'Profile'),
          ],
        ),
      ),
    );
  }

  PreferredSizeWidget _buildAppBar(BuildContext context, bool isDark, AppState state, String title) {
    return AppBar(
      titleSpacing: 16,
      backgroundColor: isDark ? AppColors.navy900.withOpacity(0.92) : Colors.white.withOpacity(0.92),
      title: Row(
        children: [
          Container(
            width: 34,
            height: 34,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(10),
              gradient: const LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [AppColors.moes700, AppColors.moes800, AppColors.navy900],
              ),
            ),
            child: const Icon(Icons.podcasts_rounded, size: 17, color: AppColors.sky300),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  title,
                  style: TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.w800,
                    color: isDark ? Colors.white : AppColors.slate900,
                  ),
                ),
                Text(
                  'CAPACITY CONNECT • MoES/IMD',
                  style: TextStyle(fontSize: 9.5, color: isDark ? AppColors.slate400 : AppColors.slate500),
                ),
              ],
            ),
          ),
        ],
      ),
      actions: [
        IconButton(
          tooltip: 'Announcements',
          icon: const Icon(Icons.notifications_none_rounded),
          onPressed: () => Navigator.of(context).push(
            MaterialPageRoute(builder: (_) => const AnnouncementsScreen()),
          ),
        ),
        IconButton(
          tooltip: state.darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode',
          icon: Icon(state.darkMode ? Icons.light_mode_rounded : Icons.dark_mode_rounded,
              color: state.darkMode ? AppColors.amber400 : AppColors.slate600),
          onPressed: () => state.setDarkMode(!state.darkMode),
        ),
        PopupMenuButton<String>(
          icon: CircleAvatar(
            radius: 15,
            backgroundImage: NetworkImage(state.currentUser.avatar),
          ),
          onSelected: (value) async {
            if (value == 'logout') {
              await state.logout();
              if (!context.mounted) return;
              showAppToast(context, 'Logged out. See you soon!', type: ToastType.info);
              Navigator.of(context).pushAndRemoveUntil(
                MaterialPageRoute(builder: (_) => const LoginScreen()),
                (route) => false,
              );
            } else if (value == 'profile') {
              goToTab(4);
            }
          },
          itemBuilder: (context) => [
            PopupMenuItem(
              enabled: false,
              child: SizedBox(
                width: 190,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(state.currentUser.name,
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                    Text(state.currentUser.email,
                        style: const TextStyle(fontSize: 11, color: AppColors.slate500)),
                  ],
                ),
              ),
            ),
            const PopupMenuDivider(),
            const PopupMenuItem(
              value: 'profile',
              child: Row(children: [
                Icon(Icons.person_outline, size: 17, color: AppColors.moes600),
                SizedBox(width: 10),
                Text('My Learning & Profile', style: TextStyle(fontSize: 12.5)),
              ]),
            ),
            const PopupMenuItem(
              value: 'logout',
              child: Row(children: [
                Icon(Icons.logout_rounded, size: 17, color: AppColors.red600),
                SizedBox(width: 10),
                Text('Log Out', style: TextStyle(fontSize: 12.5, color: AppColors.red600)),
              ]),
            ),
          ],
        ),
        const SizedBox(width: 6),
      ],
    );
  }
}
