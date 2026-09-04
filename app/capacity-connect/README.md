# CAPACITY CONNECT — Trainee (Flutter)

A Flutter port of the **Trainee** experience from the CAPACITY CONNECT web app
(MoES / IMD Digital Capacity Building & LMS Portal — SIH 2026, PS ID 26075).

Per the team's scope decision, **only the Trainee role is implemented**.
Trainer and Admin tooling remain web-only — there is no role switcher in
this app; a trainee simply signs in and lands in their own workspace.

---

## 1. Getting this running

This project was generated as pure Dart/Flutter source (no `flutter create`
scaffolding for `android/`, `ios/`, `web/`, etc., since no SDK was available
in the environment this was built in). To run it:

```bash
# 1. Scaffold the platform folders into this same directory
flutter create --project-name capacity_connect_trainee .

# 2. Install dependencies
flutter pub get

# 3. Run on a connected device / emulator
flutter run
```

`flutter create .` will not touch your existing `lib/`, `pubspec.yaml` or
this README — it only adds the missing `android/`, `ios/`, `web/`,
`macos/`, `linux/`, `windows/` platform folders. If it complains about the
folder already having a `pubspec.yaml`, that's expected — it will merge in
the platform folders and leave your code alone.

**Minimum Flutter/Dart:** targets a recent stable Flutter 3.x / Dart 3.x SDK.
If `flutter pub get` reports a version conflict on any single package, bump
that one line in `pubspec.yaml` — nothing in the app relies on bleeding-edge
APIs.

---

## 2. What's implemented

| Area | Screen(s) | Notes |
|---|---|---|
| Auth | `login_screen.dart` | Trainee-only sign-in. Pre-filled with the same demo trainee (Dr. Ananya Sharma) used in the web app's demo switcher. Registration is intentionally a dead-end that explains new accounts are approved on the web Admin portal. |
| Home | `home_tab.dart` | Welcome banner, MoES broadcast ticker, highlight stats, quick actions, featured courses, announcements preview, faculty showcase, footer/contact card. |
| My Learning | `my_learning_tab.dart` | Segmented "My Courses" / "Explore All" (search + domain filter chips), mirroring `TraineeDashboard.jsx` + `DomainCatalogue.jsx`. |
| Course Player | `course_player_screen.dart` | Real video playback (`video_player`) with custom controls, module syllabus switcher, resources list, mark-complete, personal notes per module, "Launch MCQ Assessment" CTA. |
| Assessments | `assessments_tab.dart`, `quiz_screen.dart` | Full MCQ engine: instructions screen, countdown timer, question navigator/flagging, submit confirmation, scored results with per-question review and explanations. |
| Certificates | `certificates_tab.dart`, `certificate_detail_screen.dart` | Certificate list + a faithful certificate visual (gold double-border, GOI/MoES header, score/grade, signatures, QR block). Passing a quiz shows it with a confetti celebration. Includes real **Share/Save** (captures the certificate as a PNG via `RepaintBoundary` and hands it to the OS share sheet with `share_plus`). |
| Profile | `profile_tab.dart` | View + edit mode for qualifications, experience, skill matrix, interests — mirrors `TraineeProfile.jsx`. |
| Materials | `materials_library_screen.dart` | Trainer-shared knowledge library (read-only download list). |
| Announcements | `announcements_screen.dart` | Full MoES circular feed behind the ticker/bell icon. |

State is centralized in `lib/state/app_state.dart` (a single `ChangeNotifier`
mirroring the web app's `AppContext.jsx`), seeded from
`lib/data/mock_data.dart` — the same course/assessment/announcement/user
data as `src/data/*.js` in the web app. Enrollment, module progress,
certificates and profile edits persist locally via `shared_preferences`
(the mobile equivalent of the web app's `localStorage`).

## 3. Design fidelity

Colours are ported 1:1 from `tailwind.config.js` (`moes`, `navy`, `saffron`)
plus the standard Tailwind slate/amber/emerald/sky/red scales the web app
leans on — see `lib/theme/palette.dart`. Typography uses **Inter** (body)
and **Outfit** (headings) via `google_fonts`, matching the web app's font
stack. The frosted `.glass-card` / `.glass-nav` look is reproduced with
`BoxDecoration` + translucent fills in `lib/theme/decorations.dart` and
`lib/widgets/glass_card.dart`. Both light and dark themes are implemented
and toggleable from the top app bar / Profile tab, matching the web app's
dark mode switch.

## 4. Known simplifications (by design, to keep scope honest)

- **Hindi toggle is a stub.** The language button is present (Profile tab
  and could be wired into the app bar) but currently just shows a "coming
  soon" toast rather than a full i18n pass — the web app's bilingual
  strings weren't ported. Wiring real localisation later is a matter of
  moving the hardcoded strings into ARB files and swapping in `intl`.
- **Personal notes in the Course Player are session-only** (not persisted
  to `shared_preferences` yet) — everything else (enrollment, module
  completion, certificates, profile) does persist.
- **No real backend.** Like the web app's demo build, this ships with seed
  data and local persistence only. Swapping `lib/data/mock_data.dart` +
  the methods in `lib/state/app_state.dart` for real HTTP calls (e.g. via
  `dio` or `http`) is the natural next step once an API exists — the UI
  layer doesn't need to change since it only talks to `AppState`.
- **Resource "downloads"** show a toast rather than fetching a real file,
  same as the web app's demo behaviour (the seed data doesn't reference
  real files).

## 5. Project layout

```
lib/
  main.dart                 # App entry, theme wiring
  theme/                    # palette.dart, app_theme.dart, decorations.dart
  models/                   # Course, Assessment, TraineeUser, Announcement, etc.
  data/mock_data.dart        # Seed data ported from the web app's src/data/*.js
  state/app_state.dart       # ChangeNotifier — mirrors AppContext.jsx
  widgets/                  # GlassCard, CourseCard, StatCard, ticker, toasts, feedback sheet
  screens/                  # splash, login, root shell (bottom nav) + all tabs/detail screens
```
