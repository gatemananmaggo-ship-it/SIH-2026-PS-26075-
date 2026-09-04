import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../state/app_state.dart';
import '../theme/decorations.dart';
import '../theme/palette.dart';
import '../widgets/app_toast.dart';
import 'root_shell.dart';

/// Trainee sign-in screen. Only the Trainee role is implemented in the
/// mobile app — Trainer & Admin tooling remain web-only, per the team's
/// scope decision — so there is no role switcher here.
class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController(text: 'ananya.sharma@imd.gov.in');
  final _passwordController = TextEditingController(text: 'moes@2026');
  bool _obscure = true;
  bool _submitting = false;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _submitting = true);
    await Future.delayed(const Duration(milliseconds: 500)); // simulated auth round-trip
    final state = context.read<AppState>();
    await state.login();
    if (!mounted) return;
    Navigator.of(context).pushReplacement(MaterialPageRoute(builder: (_) => const RootShell()));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.slate950,
      body: Stack(
        children: [
          Container(decoration: const BoxDecoration(gradient: AppDecor.heroGradient)),
          Positioned(
            top: -80,
            left: -60,
            child: _glow(AppColors.moes500, 240),
          ),
          Positioned(
            bottom: -60,
            right: -60,
            child: _glow(AppColors.sky500, 220),
          ),
          SafeArea(
            child: SingleChildScrollView(
              padding: const EdgeInsets.fromLTRB(22, 28, 22, 28),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  const SizedBox(height: 12),
                  _brandHeader(),
                  const SizedBox(height: 30),
                  Container(
                    decoration: BoxDecoration(
                      color: AppColors.navy900.withOpacity(0.6),
                      borderRadius: BorderRadius.circular(24),
                      border: Border.all(color: Colors.white.withOpacity(0.08)),
                    ),
                    padding: const EdgeInsets.fromLTRB(22, 24, 22, 24),
                    child: Form(
                      key: _formKey,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: AppColors.moes950.withOpacity(0.8),
                              borderRadius: BorderRadius.circular(20),
                              border: Border.all(color: AppColors.moes500.withOpacity(0.4)),
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: const [
                                Icon(Icons.verified_user_rounded, size: 13, color: AppColors.sky300),
                                SizedBox(width: 6),
                                Text('MoES Portal Authentication',
                                    style: TextStyle(
                                        color: AppColors.sky300,
                                        fontSize: 10.5,
                                        fontWeight: FontWeight.w700)),
                              ],
                            ),
                          ),
                          const SizedBox(height: 14),
                          const Text('Sign In to Trainee Portal',
                              style: TextStyle(
                                  color: Colors.white, fontSize: 21, fontWeight: FontWeight.w800)),
                          const SizedBox(height: 4),
                          const Text(
                            'Access your enrolled MoES / IMD capacity building courses.',
                            style: TextStyle(color: AppColors.slate400, fontSize: 12.5),
                          ),
                          const SizedBox(height: 22),
                          _label('Official Email Address (@gov.in / @res.in)'),
                          const SizedBox(height: 6),
                          TextFormField(
                            controller: _emailController,
                            style: const TextStyle(color: Colors.white, fontSize: 13),
                            keyboardType: TextInputType.emailAddress,
                            validator: (v) => (v == null || !v.contains('@')) ? 'Enter a valid email' : null,
                            decoration: _fieldDecoration(Icons.mail_outline_rounded, 'name@imd.gov.in'),
                          ),
                          const SizedBox(height: 16),
                          _label('Password'),
                          const SizedBox(height: 6),
                          TextFormField(
                            controller: _passwordController,
                            obscureText: _obscure,
                            style: const TextStyle(color: Colors.white, fontSize: 13),
                            validator: (v) =>
                                (v == null || v.length < 4) ? 'Enter your password' : null,
                            decoration: _fieldDecoration(Icons.lock_outline_rounded, '••••••••••••').copyWith(
                              suffixIcon: IconButton(
                                icon: Icon(
                                  _obscure ? Icons.visibility_outlined : Icons.visibility_off_outlined,
                                  color: AppColors.slate400,
                                  size: 18,
                                ),
                                onPressed: () => setState(() => _obscure = !_obscure),
                              ),
                            ),
                          ),
                          const SizedBox(height: 22),
                          SizedBox(
                            height: 48,
                            child: ElevatedButton(
                              onPressed: _submitting ? null : _submit,
                              style: ElevatedButton.styleFrom(
                                backgroundColor: AppColors.moes600,
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                              ),
                              child: _submitting
                                  ? const SizedBox(
                                      width: 20,
                                      height: 20,
                                      child: CircularProgressIndicator(
                                          strokeWidth: 2.2, color: Colors.white),
                                    )
                                  : const Row(
                                      mainAxisAlignment: MainAxisAlignment.center,
                                      children: [
                                        Text('Authenticate & Access Portal',
                                            style: TextStyle(
                                                fontWeight: FontWeight.bold, fontSize: 13.5)),
                                        SizedBox(width: 8),
                                        Icon(Icons.arrow_forward_rounded, size: 17),
                                      ],
                                    ),
                            ),
                          ),
                          const SizedBox(height: 18),
                          Container(height: 1, color: Colors.white10),
                          const SizedBox(height: 14),
                          Center(
                            child: GestureDetector(
                              onTap: () => showAppToast(
                                context,
                                'New trainee registrations are reviewed on the MoES web portal by an Administrator.',
                              ),
                              child: RichText(
                                textAlign: TextAlign.center,
                                text: const TextSpan(
                                  style: TextStyle(color: AppColors.slate400, fontSize: 12),
                                  children: [
                                    TextSpan(text: 'New trainee? '),
                                    TextSpan(
                                      text: 'Request an account (subject to approval)',
                                      style: TextStyle(
                                          color: AppColors.sky400, fontWeight: FontWeight.bold),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 22),
                  Text(
                    'Smart India Hackathon 2026 • Problem Statement ID: 26075',
                    textAlign: TextAlign.center,
                    style: TextStyle(color: AppColors.slate500, fontSize: 11),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _brandHeader() {
    return Column(
      children: [
        Container(
          width: 64,
          height: 64,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(18),
            gradient: const LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [AppColors.moes700, AppColors.moes800, AppColors.navy900],
            ),
            border: Border.all(color: AppColors.moes400.withOpacity(0.3)),
          ),
          child: Stack(
            children: [
              const Center(child: Icon(Icons.podcasts_rounded, color: AppColors.sky300, size: 30)),
              Positioned(
                bottom: 2,
                right: 2,
                child: Container(
                  width: 16,
                  height: 16,
                  decoration: const BoxDecoration(color: AppColors.saffron500, shape: BoxShape.circle),
                  child: const Center(
                    child: Text('IN',
                        style: TextStyle(fontSize: 7, fontWeight: FontWeight.w900, color: AppColors.slate950)),
                  ),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 14),
        ShaderMask(
          shaderCallback: (bounds) => AppDecor.brandTextGradient.createShader(bounds),
          child: const Text('CAPACITY CONNECT',
              style: TextStyle(fontSize: 22, fontWeight: FontWeight.w900, color: Colors.white)),
        ),
        const SizedBox(height: 4),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
          decoration: BoxDecoration(
            color: AppColors.amber900.withOpacity(0.4),
            borderRadius: BorderRadius.circular(6),
            border: Border.all(color: AppColors.amber700.withOpacity(0.5)),
          ),
          child: const Text('MoES • IMD',
              style: TextStyle(color: AppColors.amber300, fontSize: 10, fontWeight: FontWeight.w800)),
        ),
      ],
    );
  }

  Widget _label(String text) =>
      Text(text, style: const TextStyle(color: AppColors.slate300, fontSize: 11.5, fontWeight: FontWeight.w600));

  InputDecoration _fieldDecoration(IconData icon, String hint) {
    return InputDecoration(
      prefixIcon: Icon(icon, size: 18, color: AppColors.slate400),
      hintText: hint,
      hintStyle: const TextStyle(color: AppColors.slate500, fontSize: 12.5),
      filled: true,
      fillColor: Colors.white.withOpacity(0.06),
      contentPadding: const EdgeInsets.symmetric(vertical: 14),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide(color: Colors.white.withOpacity(0.12)),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide(color: Colors.white.withOpacity(0.12)),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: AppColors.moes400, width: 1.6),
      ),
      errorStyle: const TextStyle(color: AppColors.red300, fontSize: 11),
    );
  }

  Widget _glow(Color color, double size) {
    return IgnorePointer(
      child: Container(
        width: size,
        height: size,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          gradient: RadialGradient(
            colors: [color.withOpacity(0.35), color.withOpacity(0.0)],
          ),
        ),
      ),
    );
  }
}
