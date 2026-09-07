# CAPACITY CONNECT Frontend Audit / Fixes

## Fixed (safe frontend-only)
1. AppContext: imported MOCK_TRAINER_CANDIDATES from data/competencyData.js.
2. AppContext: session restoration now sets currentView to the authenticated user's role.
3. TraineeAnalytics: replaced stale `courses` reference with `activeCourses`; course option keys/values support both id and _id.
4. TraineeProfile: imported missing useEffect.
5. Admin pagination: changed Pagination prop `currentPage` to `page` in HomepagePublisher, AnalyticsOverview, CompetencyMapping, and UserApprovalManagement.
6. TraineeProfile: stopped calling nonexistent POST `/trainee/profile`; profile mutation now uses the backend-supported PUT service.

## Important remaining functional issues found in the archive
1. TrainerAnalytics gradebook is still built from `users` in AppContext. Trainer login only populates courses; it does not populate a trainee roster. Therefore the gradebook can be empty/stale even when trainer analytics totals are real.
2. TraineeDashboard assessment cards use AppContext `assessments`. AppContext does not load trainee quizzes from the backend, so newly-created backend quizzes are not automatically listed after refresh.
3. AppContext trainer actions `addAssessment`, `uploadTrainerMaterial`, and `createLiveSession` only mutate local React state. These are not backend persistence operations. TrainerQuizCreator/SessionScheduler/Library must remain the source of truth for real mutations.
4. AppContext `toggleModuleProgress` only changes local `courses` state. CoursePlayer does call the real lesson-complete endpoint, so this context action should not be treated as persistent backend progress.
5. TraineeCertificates reads `currentUser.certificates`, but login/session user data only contains basic identity fields. A backend certificate load path is still required for real certificate listing.
6. TraineeProfile backend sync payload and local UI profile fields are separate: name/designation/department/organization/location are updated only in AppContext local state, not through the profile API payload currently constructed.
7. Competency Mapping's trainer ranking is still mock/demo scoring via trainerCandidates. The backend service layer currently contains competency CRUD and course mapping, but no frontend API call for a real trainer recommendation list in this component.
8. The trainer dashboard fallback metrics use unrelated local counts (e.g. assessments length for courses, trainerMaterials length for enrollments) when analytics fails; these should show an explicit unavailable state instead of misleading totals.

## Environment/build note
The archived node_modules is not portable for this Linux runtime: `vite` is not executable from `.bin`, and Rollup's Linux optional native package is missing. This is an installation/archive issue, not a source-code finding. Run a fresh `npm install` (or delete node_modules + lockfile only if the local npm setup requires it) before judging the final production build.
