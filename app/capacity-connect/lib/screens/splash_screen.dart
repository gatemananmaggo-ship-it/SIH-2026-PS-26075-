import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../state/app_state.dart';
import '../theme/decorations.dart';
import '../theme/palette.dart';
import 'login_screen.dart';
import 'root_shell.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => _bootstrap());
  }

  Future<void> _bootstrap() async {
    final state = context.read<AppState>();
    await state.init();
    // Small brand pause so the splash doesn't just flash by.
    await Future.delayed(const Duration(milliseconds: 700));
    if (!mounted) return;
    Navigator.of(context).pushReplacement(
      MaterialPageRoute(
        builder: (_) => state.isLoggedIn ? const RootShell() : const LoginScreen(),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(gradient: AppDecor.heroGradient),
        child: Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 76,
                height: 76,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(20),
                  gradient: const LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [AppColors.moes700, AppColors.moes800, AppColors.navy900],
                  ),
                  border: Border.all(color: AppColors.moes400.withOpacity(0.3)),
                  boxShadow: [
                    BoxShadow(color: AppColors.moes500.withOpacity(0.3), blurRadius: 24),
                  ],
                ),
                child: const Icon(Icons.podcasts_rounded, color: AppColors.sky300, size: 38),
              ),
              const SizedBox(height: 22),
              ShaderMask(
                shaderCallback: (bounds) => AppDecor.brandTextGradient.createShader(bounds),
                child: const Text(
                  'CAPACITY CONNECT',
                  style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.w900,
                    letterSpacing: 0.5,
                    color: Colors.white,
                  ),
                ),
              ),
              const SizedBox(height: 6),
              const Text(
                'Digital Capacity Building & LMS Portal',
                style: TextStyle(color: AppColors.slate400, fontSize: 12.5),
              ),
              const SizedBox(height: 34),
              const SizedBox(
                width: 26,
                height: 26,
                child: CircularProgressIndicator(strokeWidth: 2.4, color: AppColors.sky400),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
