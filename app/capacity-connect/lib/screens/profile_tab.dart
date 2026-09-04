import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../models/trainee_user.dart';
import '../state/app_state.dart';
import '../theme/decorations.dart';
import '../theme/palette.dart';
import '../widgets/glass_card.dart';
import '../widgets/app_toast.dart';
import 'materials_library_screen.dart';
import 'login_screen.dart';

class ProfileTab extends StatefulWidget {
  const ProfileTab({super.key});

  @override
  State<ProfileTab> createState() => _ProfileTabState();
}

class _ProfileTabState extends State<ProfileTab> {
  bool _editing = false;

  late TextEditingController _nameCtrl;
  late TextEditingController _designationCtrl;
  late TextEditingController _departmentCtrl;
  late TextEditingController _organizationCtrl;
  late TextEditingController _locationCtrl;
  late List<Qualification> _qualifications;
  late List<WorkExperience> _experience;
  late List<String> _interests;
  late List<SkillItem> _skills;

  void _loadFrom(TraineeUser u) {
    _nameCtrl = TextEditingController(text: u.name);
    _designationCtrl = TextEditingController(text: u.designation);
    _departmentCtrl = TextEditingController(text: u.department);
    _organizationCtrl = TextEditingController(text: u.organization);
    _locationCtrl = TextEditingController(text: u.location);
    _qualifications = u.qualifications.map((q) => Qualification(degree: q.degree, institute: q.institute, year: q.year)).toList();
    _experience = u.experience
        .map((e) => WorkExperience(role: e.role, org: e.org, duration: e.duration, description: e.description))
        .toList();
    _interests = List.of(u.interests);
    _skills = u.skills.map((s) => SkillItem(name: s.name, level: s.level, category: s.category)).toList();
  }

  @override
  void initState() {
    super.initState();
    final u = context.read<AppState>().currentUser;
    _loadFrom(u);
  }

  void _startEdit() {
    final u = context.read<AppState>().currentUser;
    _loadFrom(u);
    setState(() => _editing = true);
  }

  void _cancelEdit() => setState(() => _editing = false);

  void _save() {
    context.read<AppState>().updateProfile(
          name: _nameCtrl.text.trim(),
          designation: _designationCtrl.text.trim(),
          department: _departmentCtrl.text.trim(),
          organization: _organizationCtrl.text.trim(),
          location: _locationCtrl.text.trim(),
          qualifications: _qualifications,
          experience: _experience,
          interests: _interests,
          skills: _skills,
        );
    setState(() => _editing = false);
    showAppToast(context, 'Profile updated successfully.', type: ToastType.success);
  }

  @override
  Widget build(BuildContext context) {
    final state = context.watch<AppState>();
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final user = state.currentUser;

    return ListView(
      padding: const EdgeInsets.fromLTRB(16, 14, 16, 28),
      children: [
        // Header card
        Container(
          padding: const EdgeInsets.all(18),
          decoration: BoxDecoration(
            gradient: AppDecor.welcomeBannerGradient,
            borderRadius: BorderRadius.circular(20),
          ),
          child: Column(
            children: [
              CircleAvatar(radius: 36, backgroundImage: NetworkImage(user.avatar)),
              const SizedBox(height: 12),
              Text(user.name,
                  style: const TextStyle(color: Colors.white, fontSize: 17, fontWeight: FontWeight.w800)),
              const SizedBox(height: 2),
              Text(user.designation, style: const TextStyle(color: AppColors.sky300, fontSize: 12.5)),
              Text(user.organization,
                  textAlign: TextAlign.center,
                  style: const TextStyle(color: AppColors.slate300, fontSize: 11.5)),
              const SizedBox(height: 4),
              Text('Joined ${user.joinedDate}', style: const TextStyle(color: AppColors.slate400, fontSize: 10.5)),
            ],
          ),
        ),
        const SizedBox(height: 16),

        if (!_editing)
          SizedBox(
            width: double.infinity,
            child: OutlinedButton.icon(
              onPressed: _startEdit,
              icon: const Icon(Icons.edit_outlined, size: 16),
              label: const Text('Edit Professional Profile'),
              style: OutlinedButton.styleFrom(padding: const EdgeInsets.symmetric(vertical: 12)),
            ),
          )
        else
          Row(
            children: [
              Expanded(
                child: OutlinedButton(onPressed: _cancelEdit, child: const Text('Cancel')),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: ElevatedButton.icon(
                  onPressed: _save,
                  icon: const Icon(Icons.save_outlined, size: 16),
                  label: const Text('Save Changes'),
                ),
              ),
            ],
          ),
        const SizedBox(height: 18),

        if (_editing) ..._buildEditFields(isDark) else ..._buildViewFields(user, isDark),

        const SizedBox(height: 8),
        _menuTile(
          context,
          icon: Icons.folder_shared_outlined,
          label: 'Trainer Shared Knowledge Library',
          onTap: () =>
              Navigator.of(context).push(MaterialPageRoute(builder: (_) => const MaterialsLibraryScreen())),
        ),
        const SizedBox(height: 10),
        _menuTile(
          context,
          icon: Icons.language_rounded,
          label: 'Language: English',
          trailingText: 'हिंदी',
          onTap: () => showAppToast(context, 'Hindi language pack is coming soon.'),
        ),
        const SizedBox(height: 10),
        _menuTile(
          context,
          icon: isDark ? Icons.light_mode_outlined : Icons.dark_mode_outlined,
          label: isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode',
          onTap: () => state.setDarkMode(!isDark),
        ),
        const SizedBox(height: 10),
        _menuTile(
          context,
          icon: Icons.logout_rounded,
          label: 'Log Out',
          iconColor: AppColors.red600,
          textColor: AppColors.red600,
          onTap: () async {
            await state.logout();
            if (!context.mounted) return;
            Navigator.of(context).pushAndRemoveUntil(
              MaterialPageRoute(builder: (_) => const LoginScreen()),
              (route) => false,
            );
          },
        ),
      ],
    );
  }

  // -------------------- VIEW MODE --------------------
  List<Widget> _buildViewFields(TraineeUser user, bool isDark) {
    return [
      _sectionCard(
        title: 'Qualifications',
        icon: Icons.school_outlined,
        child: Column(
          children: user.qualifications
              .map((q) => Padding(
                    padding: const EdgeInsets.only(bottom: 10),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          margin: const EdgeInsets.only(top: 5),
                          width: 6,
                          height: 6,
                          decoration: const BoxDecoration(color: AppColors.moes500, shape: BoxShape.circle),
                        ),
                        const SizedBox(width: 10),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(q.degree, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12.5)),
                              Text('${q.institute} • ${q.year}',
                                  style: TextStyle(
                                      fontSize: 11, color: isDark ? AppColors.slate400 : AppColors.slate500)),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ))
              .toList(),
        ),
      ),
      const SizedBox(height: 14),
      _sectionCard(
        title: 'Work Experience',
        icon: Icons.work_outline_rounded,
        child: Column(
          children: user.experience
              .map((e) => Padding(
                    padding: const EdgeInsets.only(bottom: 12),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Expanded(
                              child: Text(e.role, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12.5)),
                            ),
                            Text(e.duration,
                                style: TextStyle(
                                    fontSize: 10.5, color: isDark ? AppColors.slate400 : AppColors.slate500)),
                          ],
                        ),
                        Text(e.org,
                            style: TextStyle(
                                fontSize: 11.5,
                                color: isDark ? AppColors.sky300 : AppColors.moes700,
                                fontWeight: FontWeight.w600)),
                        const SizedBox(height: 3),
                        Text(e.description,
                            style: TextStyle(
                                fontSize: 11.5, height: 1.4, color: isDark ? AppColors.slate300 : AppColors.slate600)),
                      ],
                    ),
                  ))
              .toList(),
        ),
      ),
      const SizedBox(height: 14),
      _sectionCard(
        title: 'Technical Skill Matrix',
        icon: Icons.insights_rounded,
        child: Column(
          children: user.skills
              .map((s) => Padding(
                    padding: const EdgeInsets.only(bottom: 12),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(s.name, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600)),
                            Text('${s.level}%',
                                style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: AppColors.moes600)),
                          ],
                        ),
                        const SizedBox(height: 5),
                        ClipRRect(
                          borderRadius: BorderRadius.circular(6),
                          child: LinearProgressIndicator(
                            value: s.level / 100,
                            minHeight: 6,
                            backgroundColor: isDark ? AppColors.slate800 : AppColors.slate100,
                            valueColor: const AlwaysStoppedAnimation(AppColors.moes500),
                          ),
                        ),
                      ],
                    ),
                  ))
              .toList(),
        ),
      ),
      const SizedBox(height: 14),
      _sectionCard(
        title: 'Areas of Interest',
        icon: Icons.favorite_border_rounded,
        child: Wrap(
          spacing: 8,
          runSpacing: 8,
          children: user.interests
              .map((i) => Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                    decoration: BoxDecoration(
                      color: isDark ? AppColors.sky950.withOpacity(0.5) : AppColors.sky50,
                      borderRadius: BorderRadius.circular(9),
                      border: Border.all(color: isDark ? AppColors.sky800 : AppColors.sky200),
                    ),
                    child: Text(i,
                        style: TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.w600,
                            color: isDark ? AppColors.sky300 : AppColors.sky700)),
                  ))
              .toList(),
        ),
      ),
    ];
  }

  // -------------------- EDIT MODE --------------------
  List<Widget> _buildEditFields(bool isDark) {
    return [
      _sectionCard(
        title: 'Basic Details',
        icon: Icons.badge_outlined,
        child: Column(
          children: [
            _textField('Full Name', _nameCtrl),
            const SizedBox(height: 10),
            _textField('Designation', _designationCtrl),
            const SizedBox(height: 10),
            _textField('Department / Division', _departmentCtrl),
            const SizedBox(height: 10),
            _textField('Organization', _organizationCtrl),
            const SizedBox(height: 10),
            _textField('Location', _locationCtrl),
          ],
        ),
      ),
      const SizedBox(height: 14),
      _sectionCard(
        title: 'Qualifications',
        icon: Icons.school_outlined,
        trailing: _addButton(() => _addQualificationDialog()),
        child: Column(
          children: _qualifications
              .asMap()
              .entries
              .map((entry) => _editableRow(
                    title: entry.value.degree,
                    subtitle: '${entry.value.institute} • ${entry.value.year}',
                    onDelete: () => setState(() => _qualifications.removeAt(entry.key)),
                  ))
              .toList(),
        ),
      ),
      const SizedBox(height: 14),
      _sectionCard(
        title: 'Work Experience',
        icon: Icons.work_outline_rounded,
        trailing: _addButton(() => _addExperienceDialog()),
        child: Column(
          children: _experience
              .asMap()
              .entries
              .map((entry) => _editableRow(
                    title: '${entry.value.role} — ${entry.value.org}',
                    subtitle: entry.value.duration,
                    onDelete: () => setState(() => _experience.removeAt(entry.key)),
                  ))
              .toList(),
        ),
      ),
      const SizedBox(height: 14),
      _sectionCard(
        title: 'Skills',
        icon: Icons.insights_rounded,
        trailing: _addButton(() => _addSkillDialog()),
        child: Column(
          children: _skills
              .asMap()
              .entries
              .map((entry) => _editableRow(
                    title: entry.value.name,
                    subtitle: '${entry.value.category} • ${entry.value.level}%',
                    onDelete: () => setState(() => _skills.removeAt(entry.key)),
                  ))
              .toList(),
        ),
      ),
      const SizedBox(height: 14),
      _sectionCard(
        title: 'Areas of Interest',
        icon: Icons.favorite_border_rounded,
        trailing: _addButton(() => _addInterestDialog()),
        child: Wrap(
          spacing: 8,
          runSpacing: 8,
          children: _interests
              .asMap()
              .entries
              .map((entry) => Chip(
                    label: Text(entry.value, style: const TextStyle(fontSize: 11)),
                    onDeleted: () => setState(() => _interests.removeAt(entry.key)),
                    deleteIconColor: AppColors.red500,
                  ))
              .toList(),
        ),
      ),
    ];
  }

  Widget _textField(String label, TextEditingController controller) {
    return TextField(
      controller: controller,
      style: const TextStyle(fontSize: 13),
      decoration: InputDecoration(labelText: label, labelStyle: const TextStyle(fontSize: 12)),
    );
  }

  Widget _addButton(VoidCallback onTap) {
    return IconButton(
      icon: const Icon(Icons.add_circle_outline_rounded, color: AppColors.moes600, size: 21),
      onPressed: onTap,
      visualDensity: VisualDensity.compact,
    );
  }

  Widget _editableRow({required String title, required String subtitle, required VoidCallback onDelete}) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(fontSize: 12.5, fontWeight: FontWeight.w600)),
                Text(subtitle, style: const TextStyle(fontSize: 11, color: AppColors.slate500)),
              ],
            ),
          ),
          IconButton(
            icon: const Icon(Icons.delete_outline_rounded, size: 18, color: AppColors.red500),
            onPressed: onDelete,
            visualDensity: VisualDensity.compact,
          ),
        ],
      ),
    );
  }

  Widget _sectionCard({required String title, required IconData icon, required Widget child, Widget? trailing}) {
    return GlassCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, size: 16, color: AppColors.moes600),
              const SizedBox(width: 8),
              Expanded(child: Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13.5))),
              if (trailing != null) trailing,
            ],
          ),
          const SizedBox(height: 12),
          child,
        ],
      ),
    );
  }

  Widget _menuTile(
    BuildContext context, {
    required IconData icon,
    required String label,
    required VoidCallback onTap,
    String? trailingText,
    Color? iconColor,
    Color? textColor,
  }) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return GlassCard(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
      onTap: onTap,
      child: Row(
        children: [
          Icon(icon, size: 18, color: iconColor ?? (isDark ? AppColors.slate300 : AppColors.slate600)),
          const SizedBox(width: 12),
          Expanded(
            child: Text(label,
                style: TextStyle(
                    fontSize: 13, fontWeight: FontWeight.w600, color: textColor ?? (isDark ? Colors.white : AppColors.slate800))),
          ),
          if (trailingText != null)
            Text(trailingText, style: const TextStyle(fontSize: 11, color: AppColors.slate400)),
          const SizedBox(width: 4),
          Icon(Icons.chevron_right_rounded, size: 18, color: isDark ? AppColors.slate500 : AppColors.slate400),
        ],
      ),
    );
  }

  // -------------------- ADD DIALOGS --------------------
  Future<void> _addQualificationDialog() async {
    final degree = TextEditingController();
    final institute = TextEditingController();
    final year = TextEditingController();
    final ok = await _formDialog('Add Qualification', [
      _textField('Degree / Program', degree),
      const SizedBox(height: 10),
      _textField('Institute', institute),
      const SizedBox(height: 10),
      _textField('Year', year),
    ]);
    if (ok == true && degree.text.trim().isNotEmpty) {
      setState(() => _qualifications
          .add(Qualification(degree: degree.text.trim(), institute: institute.text.trim(), year: year.text.trim())));
    }
  }

  Future<void> _addExperienceDialog() async {
    final role = TextEditingController();
    final org = TextEditingController();
    final duration = TextEditingController();
    final description = TextEditingController();
    final ok = await _formDialog('Add Experience', [
      _textField('Role', role),
      const SizedBox(height: 10),
      _textField('Organization', org),
      const SizedBox(height: 10),
      _textField('Duration (e.g. 2022 - Present)', duration),
      const SizedBox(height: 10),
      _textField('Description', description),
    ]);
    if (ok == true && role.text.trim().isNotEmpty) {
      setState(() => _experience.add(WorkExperience(
          role: role.text.trim(),
          org: org.text.trim(),
          duration: duration.text.trim(),
          description: description.text.trim())));
    }
  }

  Future<void> _addSkillDialog() async {
    final name = TextEditingController();
    final category = TextEditingController();
    double level = 60;
    final ok = await showDialog<bool>(
      context: context,
      builder: (context) => StatefulBuilder(builder: (context, setLocal) {
        return AlertDialog(
          title: const Text('Add Skill'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              _textField('Skill Name', name),
              const SizedBox(height: 10),
              _textField('Category', category),
              const SizedBox(height: 10),
              Text('Proficiency: ${level.round()}%', style: const TextStyle(fontSize: 12)),
              Slider(
                value: level,
                min: 10,
                max: 100,
                divisions: 18,
                onChanged: (v) => setLocal(() => level = v),
              ),
            ],
          ),
          actions: [
            TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('Cancel')),
            ElevatedButton(onPressed: () => Navigator.pop(context, true), child: const Text('Add')),
          ],
        );
      }),
    );
    if (ok == true && name.text.trim().isNotEmpty) {
      setState(() => _skills.add(
          SkillItem(name: name.text.trim(), level: level.round(), category: category.text.trim().isEmpty ? 'General' : category.text.trim())));
    }
  }

  Future<void> _addInterestDialog() async {
    final interest = TextEditingController();
    final ok = await _formDialog('Add Interest', [_textField('Interest / Focus Area', interest)]);
    if (ok == true && interest.text.trim().isNotEmpty) {
      setState(() => _interests.add(interest.text.trim()));
    }
  }

  Future<bool?> _formDialog(String title, List<Widget> children) {
    return showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(title),
        content: SingleChildScrollView(child: Column(mainAxisSize: MainAxisSize.min, children: children)),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('Cancel')),
          ElevatedButton(onPressed: () => Navigator.pop(context, true), child: const Text('Add')),
        ],
      ),
    );
  }
}
