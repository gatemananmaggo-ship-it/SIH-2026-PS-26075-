import 'dart:ui' as ui;
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:provider/provider.dart';
import 'package:share_plus/share_plus.dart';
import 'package:confetti/confetti.dart';

import '../models/trainee_user.dart';
import '../state/app_state.dart';
import '../theme/palette.dart';
import '../widgets/app_toast.dart';

class CertificateDetailScreen extends StatefulWidget {
  final String certificateId;
  final bool celebrate;
  const CertificateDetailScreen({super.key, required this.certificateId, this.celebrate = false});

  @override
  State<CertificateDetailScreen> createState() => _CertificateDetailScreenState();
}

class _CertificateDetailScreenState extends State<CertificateDetailScreen> {
  final GlobalKey _captureKey = GlobalKey();
  ConfettiController? _confetti;
  bool _sharing = false;

  @override
  void initState() {
    super.initState();
    if (widget.celebrate) {
      _confetti = ConfettiController(duration: const Duration(seconds: 3));
      WidgetsBinding.instance.addPostFrameCallback((_) => _confetti?.play());
    }
  }

  @override
  void dispose() {
    _confetti?.dispose();
    super.dispose();
  }

  Future<void> _shareCertificate() async {
    setState(() => _sharing = true);
    try {
      final boundary = _captureKey.currentContext!.findRenderObject() as RenderRepaintBoundary;
      final image = await boundary.toImage(pixelRatio: 3.0);
      final byteData = await image.toByteData(format: ui.ImageByteFormat.png);
      final bytes = byteData!.buffer.asUint8List();
      final file = XFile.fromData(bytes, name: '${widget.certificateId}.png', mimeType: 'image/png');
      if (!mounted) return;
      await Share.shareXFiles([file], text: 'My CAPACITY CONNECT e-Certificate — ${widget.certificateId}');
    } catch (e) {
      if (mounted) showAppToast(context, 'Could not generate share image.', type: ToastType.warning);
    } finally {
      if (mounted) setState(() => _sharing = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final state = context.watch<AppState>();
    final cert = state.currentUser.certificates.firstWhere(
      (c) => c.id == widget.certificateId,
      orElse: () => state.currentUser.certificates.first,
    );

    return Scaffold(
      backgroundColor: AppColors.slate200,
      appBar: AppBar(
        backgroundColor: AppColors.slate900,
        foregroundColor: Colors.white,
        title: const Text('e-Certificate', style: TextStyle(fontSize: 15)),
        actions: [
          IconButton(
            icon: _sharing
                ? const SizedBox(
                    width: 18, height: 18, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                : const Icon(Icons.ios_share_rounded),
            onPressed: _sharing ? null : _shareCertificate,
            tooltip: 'Share / Download',
          ),
        ],
      ),
      body: Stack(
        children: [
          SingleChildScrollView(
            padding: const EdgeInsets.all(18),
            child: Column(
              children: [
                RepaintBoundary(
                  key: _captureKey,
                  child: _CertificateVisual(certificate: cert, trainee: state.currentUser),
                ),
                const SizedBox(height: 20),
                Row(
                  children: [
                    Expanded(
                      child: OutlinedButton.icon(
                        onPressed: () => showAppToast(
                          context,
                          'Verification hash ${cert.verificationHash} can be checked on the MoES web portal.',
                        ),
                        icon: const Icon(Icons.qr_code_2_rounded, size: 18),
                        label: const Text('Verify'),
                        style: OutlinedButton.styleFrom(padding: const EdgeInsets.symmetric(vertical: 13)),
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: ElevatedButton.icon(
                        onPressed: _sharing ? null : _shareCertificate,
                        icon: const Icon(Icons.download_rounded, size: 18),
                        label: const Text('Share / Save'),
                        style: ElevatedButton.styleFrom(padding: const EdgeInsets.symmetric(vertical: 13)),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
              ],
            ),
          ),
          if (_confetti != null)
            Align(
              alignment: Alignment.topCenter,
              child: ConfettiWidget(
                confettiController: _confetti!,
                blastDirection: 3.14 / 2,
                numberOfParticles: 24,
                maxBlastForce: 22,
                minBlastForce: 8,
                emissionFrequency: 0.06,
                gravity: 0.25,
                shouldLoop: false,
                colors: const [
                  AppColors.saffron500,
                  AppColors.moes500,
                  AppColors.emerald500,
                  Colors.white,
                ],
              ),
            ),
        ],
      ),
    );
  }
}

class _CertificateVisual extends StatelessWidget {
  final TraineeCertificate certificate;
  final TraineeUser trainee;
  const _CertificateVisual({required this.certificate, required this.trainee});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(6),
      decoration: BoxDecoration(
        color: AppColors.saffron500,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Container(
        padding: const EdgeInsets.all(3),
        decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(12)),
        child: Container(
          decoration: BoxDecoration(
            border: Border.all(color: AppColors.moes800, width: 1.4),
            borderRadius: BorderRadius.circular(10),
          ),
          padding: const EdgeInsets.fromLTRB(22, 26, 22, 22),
          child: Column(
            children: [
              Container(
                width: 54,
                height: 54,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  gradient: const LinearGradient(colors: [AppColors.moes700, AppColors.navy900]),
                  border: Border.all(color: AppColors.saffron500, width: 2),
                ),
                child: const Icon(Icons.shield_rounded, color: Colors.white, size: 26),
              ),
              const SizedBox(height: 10),
              const Text('GOVERNMENT OF INDIA',
                  style: TextStyle(
                      fontSize: 10, fontWeight: FontWeight.w800, letterSpacing: 1.4, color: AppColors.slate600)),
              const SizedBox(height: 2),
              const Text('MINISTRY OF EARTH SCIENCES',
                  style: TextStyle(
                      fontSize: 12.5, fontWeight: FontWeight.w900, letterSpacing: 0.6, color: AppColors.moes900)),
              const SizedBox(height: 14),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: const [
                  Expanded(child: Divider(color: AppColors.saffron500, thickness: 1.2)),
                  Padding(
                    padding: EdgeInsets.symmetric(horizontal: 10),
                    child: Icon(Icons.star_rounded, color: AppColors.saffron500, size: 16),
                  ),
                  Expanded(child: Divider(color: AppColors.saffron500, thickness: 1.2)),
                ],
              ),
              const SizedBox(height: 14),
              const Text('CERTIFICATE OF COMPETENCY',
                  textAlign: TextAlign.center,
                  style: TextStyle(fontSize: 19, fontWeight: FontWeight.w900, color: AppColors.slate900)),
              const SizedBox(height: 18),
              const Text('This is to certify that',
                  style: TextStyle(fontSize: 12, color: AppColors.slate500, fontStyle: FontStyle.italic)),
              const SizedBox(height: 8),
              Text(trainee.name,
                  textAlign: TextAlign.center,
                  style: const TextStyle(fontSize: 23, fontWeight: FontWeight.w800, color: AppColors.moes800)),
              Text('${trainee.designation}, ${trainee.organization}',
                  textAlign: TextAlign.center,
                  style: const TextStyle(fontSize: 10.5, color: AppColors.slate500)),
              const SizedBox(height: 16),
              const Text('has successfully completed the specialized capacity building course',
                  textAlign: TextAlign.center,
                  style: TextStyle(fontSize: 12, color: AppColors.slate600)),
              const SizedBox(height: 8),
              Text(certificate.courseTitle,
                  textAlign: TextAlign.center,
                  style: const TextStyle(fontSize: 15.5, fontWeight: FontWeight.bold, color: AppColors.slate900)),
              const SizedBox(height: 14),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  _scoreChip('SCORE', '${certificate.score}%'),
                  const SizedBox(width: 10),
                  _scoreChip('GRADE', certificate.grade),
                ],
              ),
              const SizedBox(height: 20),
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(height: 1, color: AppColors.slate300, margin: const EdgeInsets.only(bottom: 4)),
                        Text(certificate.trainerName,
                            style: const TextStyle(fontSize: 10.5, fontWeight: FontWeight.bold)),
                        const Text('Course Faculty & Assessor',
                            style: TextStyle(fontSize: 9, color: AppColors.slate500)),
                      ],
                    ),
                  ),
                  const SizedBox(width: 14),
                  Container(
                    width: 48,
                    height: 48,
                    decoration: BoxDecoration(
                      color: AppColors.slate900,
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: const Icon(Icons.qr_code_2_rounded, color: Colors.white, size: 30),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Container(height: 1, color: AppColors.slate300, margin: const EdgeInsets.only(bottom: 4)),
                        const Text('Capacity Building Commission',
                            textAlign: TextAlign.right,
                            style: TextStyle(fontSize: 10.5, fontWeight: FontWeight.bold)),
                        const Text('Head, Training Cell (MoES)',
                            textAlign: TextAlign.right, style: TextStyle(fontSize: 9, color: AppColors.slate500)),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              Container(height: 1, color: AppColors.slate200),
              const SizedBox(height: 10),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('Certificate ID: ${certificate.id}',
                      style: const TextStyle(fontSize: 9, color: AppColors.slate500)),
                  Text('Issued: ${certificate.issueDate}',
                      style: const TextStyle(fontSize: 9, color: AppColors.slate500)),
                ],
              ),
              const SizedBox(height: 3),
              Text('Verification Hash: ${certificate.verificationHash}',
                  style: const TextStyle(fontSize: 9, color: AppColors.slate400)),
            ],
          ),
        ),
      ),
    );
  }

  Widget _scoreChip(String label, String value) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
      decoration: BoxDecoration(
        color: AppColors.moes50,
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: AppColors.moes200),
      ),
      child: Column(
        children: [
          Text(label,
              style: const TextStyle(fontSize: 8.5, fontWeight: FontWeight.w800, color: AppColors.moes700)),
          Text(value, style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w900, color: AppColors.moes900)),
        ],
      ),
    );
  }
}
