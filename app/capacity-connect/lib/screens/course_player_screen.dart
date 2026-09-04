import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:video_player/video_player.dart';

import '../models/course.dart';
import '../state/app_state.dart';
import '../theme/palette.dart';
import '../widgets/app_toast.dart';
import '../widgets/glass_card.dart';
import '../widgets/feedback_sheet.dart';
import 'quiz_screen.dart';

class CoursePlayerScreen extends StatefulWidget {
  final String courseId;
  const CoursePlayerScreen({super.key, required this.courseId});

  @override
  State<CoursePlayerScreen> createState() => _CoursePlayerScreenState();
}

class _CoursePlayerScreenState extends State<CoursePlayerScreen> {
  int _moduleIndex = 0;
  VideoPlayerController? _controller;
  bool _controlsVisible = true;
  double _speed = 1.0;
  final Map<int, List<String>> _notes = {};
  final TextEditingController _noteInput = TextEditingController();

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => _loadModule(0));
  }

  Course _course(AppState state) => state.courseById(widget.courseId)!;

  Future<void> _loadModule(int index) async {
    final state = context.read<AppState>();
    final course = _course(state);
    if (index < 0 || index >= course.modules.length) return;

    _controller?.dispose();
    setState(() {
      _moduleIndex = index;
      _controller = null;
    });

    final url = course.modules[index].videoUrl;
    final controller = VideoPlayerController.networkUrl(Uri.parse(url));
    try {
      await controller.initialize();
      controller.setPlaybackSpeed(_speed);
      if (!mounted) return;
      setState(() => _controller = controller);
      controller.addListener(() {
        if (mounted) setState(() {});
      });
    } catch (_) {
      // Video failed to load (e.g. offline) — module content below still works.
    }
  }

  @override
  void dispose() {
    _controller?.dispose();
    _noteInput.dispose();
    super.dispose();
  }

  void _togglePlay() {
    final c = _controller;
    if (c == null) return;
    if (c.value.isPlaying) {
      c.pause();
    } else {
      c.play();
    }
    setState(() {});
  }

  void _cycleSpeed() {
    const speeds = [1.0, 1.25, 1.5, 0.75];
    final next = speeds[(speeds.indexOf(_speed) + 1) % speeds.length];
    setState(() => _speed = next);
    _controller?.setPlaybackSpeed(next);
  }

  String _fmt(Duration d) {
    final m = d.inMinutes.remainder(60).toString().padLeft(2, '0');
    final s = d.inSeconds.remainder(60).toString().padLeft(2, '0');
    return '$m:$s';
  }

  @override
  Widget build(BuildContext context) {
    final state = context.watch<AppState>();
    final course = _course(state);
    final module = course.modules[_moduleIndex];
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      backgroundColor: AppColors.slate950,
      appBar: AppBar(
        backgroundColor: AppColors.slate900,
        foregroundColor: Colors.white,
        titleSpacing: 0,
        title: Text(course.title,
            maxLines: 1, overflow: TextOverflow.ellipsis, style: const TextStyle(fontSize: 14)),
        actions: [
          IconButton(
            tooltip: 'Rate this course',
            icon: const Icon(Icons.rate_review_outlined),
            onPressed: () => showModalBottomSheet(
              context: context,
              isScrollControlled: true,
              backgroundColor: Colors.transparent,
              builder: (_) => FeedbackSheet(courseId: course.id),
            ),
          ),
        ],
      ),
      body: Column(
        children: [
          _buildVideoArea(module),
          Expanded(
            child: DefaultTabController(
              length: 3,
              child: Column(
                children: [
                  Container(
                    color: isDark ? AppColors.navy900 : Colors.white,
                    child: const TabBar(
                      labelStyle: TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
                      unselectedLabelStyle: TextStyle(fontSize: 12),
                      tabs: [
                        Tab(text: 'Overview'),
                        Tab(text: 'Syllabus'),
                        Tab(text: 'My Notes'),
                      ],
                    ),
                  ),
                  Expanded(
                    child: TabBarView(
                      children: [
                        _buildOverviewTab(context, state, course, module, isDark),
                        _buildSyllabusTab(context, state, course, isDark),
                        _buildNotesTab(isDark),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildVideoArea(CourseModule module) {
    return AspectRatio(
      aspectRatio: 16 / 9,
      child: GestureDetector(
        onTap: () => setState(() => _controlsVisible = !_controlsVisible),
        child: Container(
          color: Colors.black,
          child: Stack(
            fit: StackFit.expand,
            children: [
              if (_controller != null && _controller!.value.isInitialized)
                FittedBox(
                  fit: BoxFit.contain,
                  child: SizedBox(
                    width: _controller!.value.size.width,
                    height: _controller!.value.size.height,
                    child: VideoPlayer(_controller!),
                  ),
                )
              else
                const Center(
                  child: SizedBox(
                    width: 26,
                    height: 26,
                    child: CircularProgressIndicator(strokeWidth: 2.4, color: AppColors.sky400),
                  ),
                ),
              if (_controlsVisible) ...[
                DecoratedBox(
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.bottomCenter,
                      end: Alignment.center,
                      colors: [Colors.black.withOpacity(0.7), Colors.transparent],
                    ),
                  ),
                ),
                Center(
                  child: IconButton(
                    iconSize: 54,
                    icon: Icon(
                      _controller != null && _controller!.value.isPlaying
                          ? Icons.pause_circle_filled_rounded
                          : Icons.play_circle_fill_rounded,
                      color: Colors.white.withOpacity(0.92),
                    ),
                    onPressed: _controller == null ? null : _togglePlay,
                  ),
                ),
                Positioned(
                  left: 10,
                  right: 10,
                  bottom: 8,
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      if (_controller != null && _controller!.value.isInitialized)
                        SliderTheme(
                          data: SliderThemeData(
                            trackHeight: 2.4,
                            thumbShape: const RoundSliderThumbShape(enabledThumbRadius: 6),
                            overlayShape: const RoundSliderOverlayShape(overlayRadius: 12),
                            activeTrackColor: AppColors.sky400,
                            inactiveTrackColor: Colors.white24,
                            thumbColor: AppColors.sky400,
                          ),
                          child: Slider(
                            value: _controller!.value.position.inMilliseconds
                                .clamp(0, _controller!.value.duration.inMilliseconds)
                                .toDouble(),
                            max: _controller!.value.duration.inMilliseconds.toDouble().clamp(1, double.infinity),
                            onChanged: (v) => _controller!.seekTo(Duration(milliseconds: v.round())),
                          ),
                        ),
                      Row(
                        children: [
                          if (_controller != null && _controller!.value.isInitialized)
                            Text(
                              '${_fmt(_controller!.value.position)} / ${_fmt(_controller!.value.duration)}',
                              style: const TextStyle(color: Colors.white, fontSize: 10.5),
                            ),
                          const Spacer(),
                          GestureDetector(
                            onTap: _cycleSpeed,
                            child: Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                              decoration: BoxDecoration(
                                  color: Colors.black45, borderRadius: BorderRadius.circular(6)),
                              child: Text('${_speed}x',
                                  style: const TextStyle(color: Colors.white, fontSize: 10.5, fontWeight: FontWeight.bold)),
                            ),
                          ),
                          const SizedBox(width: 8),
                          const Icon(Icons.volume_up_rounded, color: Colors.white, size: 17),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
              Positioned(
                top: 8,
                left: 10,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(color: Colors.black45, borderRadius: BorderRadius.circular(6)),
                  child: Text('Module ${_moduleIndex + 1}',
                      style: const TextStyle(color: Colors.white, fontSize: 10.5, fontWeight: FontWeight.bold)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildOverviewTab(
      BuildContext context, AppState state, Course course, CourseModule module, bool isDark) {
    return ListView(
      padding: const EdgeInsets.fromLTRB(16, 14, 16, 24),
      children: [
        Text(module.title, style: const TextStyle(fontSize: 15.5, fontWeight: FontWeight.bold)),
        const SizedBox(height: 4),
        Row(
          children: [
            Icon(Icons.access_time_rounded, size: 13, color: isDark ? AppColors.slate400 : AppColors.slate500),
            const SizedBox(width: 4),
            Text(module.duration,
                style: TextStyle(fontSize: 11.5, color: isDark ? AppColors.slate400 : AppColors.slate500)),
          ],
        ),
        const SizedBox(height: 12),
        Text(module.summary,
            style: TextStyle(
                fontSize: 13, height: 1.6, color: isDark ? AppColors.slate300 : AppColors.slate600)),
        const SizedBox(height: 16),
        SizedBox(
          width: double.infinity,
          child: ElevatedButton.icon(
            onPressed: () {
              state.toggleModuleProgress(course.id, module.id);
              showAppToast(
                context,
                module.completed ? 'Module marked as incomplete.' : 'Module marked complete!',
                type: ToastType.success,
              );
            },
            icon: Icon(module.completed ? Icons.check_circle_rounded : Icons.radio_button_unchecked_rounded, size: 17),
            label: Text(module.completed ? 'Completed' : 'Mark as Complete'),
            style: ElevatedButton.styleFrom(
              backgroundColor: module.completed ? AppColors.emerald600 : AppColors.moes600,
              padding: const EdgeInsets.symmetric(vertical: 12),
            ),
          ),
        ),
        if (module.resources.isNotEmpty) ...[
          const SizedBox(height: 20),
          const Text('Attached Resources', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
          const SizedBox(height: 10),
          ...module.resources.map((r) => Padding(
                padding: const EdgeInsets.only(bottom: 8),
                child: GlassCard(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                  onTap: () => showAppToast(context, 'Downloading ${r.name}...'),
                  child: Row(
                    children: [
                      Icon(_fileIcon(r.type), size: 18, color: AppColors.moes600),
                      const SizedBox(width: 10),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(r.name,
                                maxLines: 1, overflow: TextOverflow.ellipsis, style: const TextStyle(fontSize: 12.5, fontWeight: FontWeight.w600)),
                            Text(r.size, style: TextStyle(fontSize: 10.5, color: isDark ? AppColors.slate400 : AppColors.slate500)),
                          ],
                        ),
                      ),
                      Icon(Icons.download_rounded, size: 17, color: isDark ? AppColors.slate400 : AppColors.slate400),
                    ],
                  ),
                ),
              )),
        ],
        const SizedBox(height: 20),
        GlassCard(
          child: Row(
            children: [
              CircleAvatar(
                radius: 18,
                backgroundColor: isDark ? AppColors.moes900 : AppColors.moes100,
                child: Text(course.trainerName.split(' ').length > 1 ? course.trainerName.split(' ')[1][0] : 'T',
                    style: TextStyle(fontWeight: FontWeight.bold, color: isDark ? AppColors.sky300 : AppColors.moes700)),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(course.trainerName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12.5)),
                    Text(course.trainerRole,
                        style: TextStyle(fontSize: 10.5, color: isDark ? AppColors.slate400 : AppColors.slate500)),
                  ],
                ),
              ),
            ],
          ),
        ),
        if (course.assessmentId != null) ...[
          const SizedBox(height: 20),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppColors.amber500.withOpacity(0.1),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppColors.amber500.withOpacity(0.35)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(children: const [
                  Icon(Icons.workspace_premium_rounded, color: AppColors.amber600, size: 18),
                  SizedBox(width: 8),
                  Text('Ready to get certified?', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                ]),
                const SizedBox(height: 6),
                Text(
                  'Complete the modules, then take the course MCQ assessment to earn your e-Certificate.',
                  style: TextStyle(fontSize: 11.5, color: isDark ? AppColors.slate300 : AppColors.slate600),
                ),
                const SizedBox(height: 12),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton.icon(
                    onPressed: () => Navigator.of(context).push(
                        MaterialPageRoute(builder: (_) => QuizScreen(assessmentId: course.assessmentId!))),
                    icon: const Icon(Icons.arrow_forward_rounded, size: 16),
                    label: const Text('Launch Subject MCQ Quiz'),
                    style: ElevatedButton.styleFrom(backgroundColor: AppColors.amber600),
                  ),
                ),
              ],
            ),
          ),
        ],
      ],
    );
  }

  Widget _buildSyllabusTab(BuildContext context, AppState state, Course course, bool isDark) {
    return ListView.separated(
      padding: const EdgeInsets.fromLTRB(16, 14, 16, 24),
      itemCount: course.modules.length,
      separatorBuilder: (_, __) => const SizedBox(height: 10),
      itemBuilder: (context, i) {
        final m = course.modules[i];
        final active = i == _moduleIndex;
        return GlassCard(
          borderColor: active ? AppColors.moes500 : null,
          padding: const EdgeInsets.all(12),
          onTap: () => _loadModule(i),
          child: Row(
            children: [
              Container(
                width: 32,
                height: 32,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: m.completed
                      ? AppColors.emerald500
                      : (active ? AppColors.moes500 : (isDark ? AppColors.slate800 : AppColors.slate100)),
                ),
                child: Icon(
                  m.completed ? Icons.check_rounded : (active ? Icons.play_arrow_rounded : Icons.lock_open_rounded),
                  size: 16,
                  color: m.completed || active ? Colors.white : (isDark ? AppColors.slate400 : AppColors.slate500),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(m.title,
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(fontSize: 12.5, fontWeight: active ? FontWeight.bold : FontWeight.w600)),
                    Text(m.duration, style: TextStyle(fontSize: 10.5, color: isDark ? AppColors.slate400 : AppColors.slate500)),
                  ],
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildNotesTab(bool isDark) {
    final notes = _notes[_moduleIndex] ?? [];
    return Column(
      children: [
        Expanded(
          child: notes.isEmpty
              ? Center(
                  child: Text('No notes yet for this module.\nJot down key points as you learn.',
                      textAlign: TextAlign.center,
                      style: TextStyle(fontSize: 12.5, color: isDark ? AppColors.slate400 : AppColors.slate500)),
                )
              : ListView.separated(
                  padding: const EdgeInsets.fromLTRB(16, 14, 16, 10),
                  itemCount: notes.length,
                  separatorBuilder: (_, __) => const SizedBox(height: 8),
                  itemBuilder: (context, i) => GlassCard(
                    padding: const EdgeInsets.all(12),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Icon(Icons.sticky_note_2_outlined, size: 16, color: AppColors.amber600),
                        const SizedBox(width: 10),
                        Expanded(child: Text(notes[i], style: const TextStyle(fontSize: 12.5, height: 1.4))),
                        IconButton(
                          icon: const Icon(Icons.close_rounded, size: 16, color: AppColors.slate400),
                          visualDensity: VisualDensity.compact,
                          onPressed: () => setState(() => notes.removeAt(i)),
                        ),
                      ],
                    ),
                  ),
                ),
        ),
        SafeArea(
          top: false,
          child: Padding(
            padding: const EdgeInsets.fromLTRB(12, 8, 12, 12),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _noteInput,
                    style: const TextStyle(fontSize: 12.5),
                    decoration: const InputDecoration(hintText: 'Add a note for this module...', isDense: true),
                    onSubmitted: (_) => _addNote(),
                  ),
                ),
                const SizedBox(width: 8),
                IconButton.filled(
                  icon: const Icon(Icons.send_rounded, size: 17),
                  onPressed: _addNote,
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  void _addNote() {
    final text = _noteInput.text.trim();
    if (text.isEmpty) return;
    setState(() {
      _notes.putIfAbsent(_moduleIndex, () => []).add(text);
      _noteInput.clear();
    });
  }

  IconData _fileIcon(String type) {
    switch (type) {
      case 'pdf':
        return Icons.picture_as_pdf_rounded;
      case 'pptx':
        return Icons.slideshow_rounded;
      case 'dataset':
        return Icons.dataset_rounded;
      default:
        return Icons.description_rounded;
    }
  }
}
