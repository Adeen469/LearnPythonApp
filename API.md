# Learn Python — React Native app: API contract

The app talks to the same backend the website uses:
`https://learnpythonprogram.vercel.app` (see `src/lib/api.ts` — use it,
don't hand-roll fetch calls).

## Auth — cookie sessions, captured by the client

- The backend sets an HttpOnly `lp_session` cookie on sign-in. React
  Native has no cookie jar, so `api.ts` captures `Set-Cookie` after
  sign-in and replays it as a `Cookie` header; the value lives in
  SecureStore. Never log it, never put it in AsyncStorage.
- `GET /api/auth/me` → `{ user: { email, name, picture, auth, mfa } }`
  or 401. `AuthProvider` (`src/lib/auth.tsx`) loads this on start.
- Email auth (`POST /api/auth/email/*`, all JSON):
  - `send-otp { email, purpose: "signup" | "signin" }` → `{ sent: true }`
  - `verify-otp { email, code, purpose }` → signs in (`{ user }` + cookie)
  - `signup { email, name, password }` → `{ sent: true, email }` —
    the account is created UNVERIFIED and an OTP is emailed; the
    caller routes to the OTP screen (purpose "signup"). It does NOT
    return a session.
  - `signin { email, password }` → `{ user }` + cookie, or
    `{ needs2fa: true }`, or 403 `{ error, needsVerification: true }`
  - `forgot { email }` → `{ sent: true }` — the reset link goes to the
    user's email and opens the WEBSITE to reset; the app does not
    handle reset links in v1
  - `reset { token, password }` → `{ user }` + cookie (website flow)
- 2FA: the sign-in route sets a step-up cookie `lp_2fa_pending`
  (10 min) alongside `{ needs2fa: true }`. `api.ts` captures and
  replays it like the session — without it, the 2FA endpoints 401.
  `POST /api/auth/2fa/send-code {}` → `{ sent: true }`;
  `POST /api/auth/2fa/verify { code, method: "email" }` → `{ user }`
  + cookie (method is required; this app's screen is email-code
  based, and the backend accepts an emailed code even for
  TOTP-enabled users). A successful verify clears the pending cookie.
- Google (native): open `GOOGLE_START_URL`
  (`/api/auth/google?app=1`) with `WebBrowser.openAuthSessionAsync`
  and redirect `learnpython://auth`. The backend returns to
  `learnpython://auth?code=<code>`; call
  `exchangeAppCode(code)` — it hits `/api/auth/app-exchange?format=json`
  and captures the session cookie. `?app=1` is the RN trigger (the
  system browser has no app user-agent marker). `WebBrowser.maybeCompleteAuthSession()` must be called at module scope.
- `POST /api/auth/logout` → clears the cookie; `logout()` in api.ts
  also clears SecureStore.

## Lessons — public, no sign-in

- `GET /api/lessons` → `{ lessons: Lesson[] }` (100 lessons).
  `Lesson = { id, title, moduleTitle, courseTitle, durationSeconds,
  videoUrl, videoSource: "mega" | "drive", notes, quiz?: QuizQuestion[] }`.
  `QuizQuestion = { question, options, answer }` (answer = index).
- Video plays from `videoUrl(lessonId)` =
  `/api/video/[lessonId]` (Range/206 stream, MEGA or Drive).
  Use `expo-video` (`useVideoPlayer` + `VideoView`, SDK 58 docs
  already checked). Track watch percent; 95%+ watched = completed.
- Notes are Markdown (`notes` field) — render simply (headings,
  code blocks, lists); no heavy Markdown library is installed, keep
  the renderer small and local to the lesson screen.

## Courses — static data, bundled in the app

- `src/lib/courses-data.ts` is a copy of the website's
  `lib/courses/data.ts`: `COURSE_CREATORS` (CodeWithHarry, Mosh,
  Apna College) with `playlists` and `oneShots`.
  `CourseVideo = { title, videoId, durationSeconds?, megaLessonId? }`.
- A video WITH `megaLessonId` plays from `/api/video/[megaLessonId]`
  (expo-video). A video WITHOUT it is a temporary YouTube stand-in:
  play it in a WebView YouTube embed (`https://www.youtube.com/embed/<videoId>`).
  Never show channel links anywhere (website rule).
- Progress (completed videos) is local, in `progress.ts` shape.

## Roadmap — static data, bundled in the app

- `src/lib/roadmap-data.ts` is a copy of the website's
  `lib/roadmap.ts`: `ROADMAP_STAGES` (6 stages, 29 topics).
  `RoadmapTopic = { id, title, learnSlug, difficulty, estimatedMinutes, blurb }`.
  A topic links to its lesson (by `learnSlug` → lesson id) or to
  Courses when `learnSlug` is null. Muted timeline-rail design, like
  the website — no 3D, no saturated gradients.

## AI tutor — signed in only

- `POST /api/ai { mode, lessonId?, question?, code? }` →
  `{ answer, grounded?, citations? }` (read the route for the exact
  response fields). Modes: `tutor` | `explain` | `debug` | `quiz`.
  tutor + quiz are grounded in the lesson video's transcript and may
  return `[mm:ss]` citations — show a "grounded in the video" badge
  when `grounded` is true. 401 when signed out — send the user to
  sign-in, don't fake an answer.

## Progress — device-only

- `src/lib/progress.ts`: `loadProgress` / `saveProgress` (AsyncStorage).
  Server-side per-user sync was stopped by Maalik — do not build it.
  Streak: a day counts when any lesson is completed or watched;
  restore within 24h, max 3/month (mirror the website's rules).

## Editor — WebView of the website's editor

- The code editor is Pyodide in the browser; there is no native
  Python runtime. The Editor tab embeds the website's editor page
  (`https://learnpythonprogram.vercel.app/editor`) in a WebView
  (`react-native-webview`) with a native header. Sign-in inside the
  WebView is a known gap: the WebView has its own cookie jar, so a
  user signed in to the app is NOT signed in to the editor WebView
  in v1 — say so in the UI ("sign in again inside the editor") rather
  than faking it. Do not build a second editor.

## Design rules (from Maalik)

- Dark by default, muted neutrals, no saturated gradients, no
  3D cards, no shimmer — the app must not look AI-generated.
- Use `useTheme()` from `src/lib/theme-context.tsx` everywhere.
- No CodeWithHarry / "100 days" branding on the landing or home
  screens; no mention anywhere that videos come from YouTube.
- Keep the website's rules: lessons are Day 1–100 only; quiz pass
  mark 70%+; completion at 95% watched.

## Project rules (learn-python-app/AGENTS.md)

- Expo Router for navigation (routes in `src/app/`). SDK 58 —
  check the versioned Expo docs before using an Expo API you
  haven't used; `expo-video` (`useVideoPlayer`/`VideoView`),
  `expo-auth-session`/`expo-web-browser`, and the new
  `expo-file-system` `File`/`Directory`/`Paths` API are already
  verified against the v58 docs.
- `npx tsc --noEmit` and `npx expo export` must pass before the
  work is called done. Nothing is pushed until Maalik says so.

## App updates (in-app, GitHub Releases)

No backend involved — the app talks to GitHub's public API directly.
`src/lib/updates.ts` is the whole mechanism; `src/components/UpdateGate.tsx`
checks once on launch, `src/components/UpdateDialog.tsx` is the dialog,
and Settings has a manual "Check for updates" row.

- Source: `GET https://api.github.com/repos/Adeen469/LearnPythonApp/releases/latest`.
- A release counts as an update when its tag (without a leading "v") is a
  newer dotted version than `Constants.expoConfig.version` (from app.json).
  Version compare is numeric per segment ("1.10.0" > "1.9.0").
- Details shown in the dialog are the release notes (body). The dialog
  shows version + APK size (from the release asset).
- Mandatory: put `[mandatory]` in the release title or body. Mandatory
  updates cannot be dismissed and block the app until installed.
  Optional updates dismissed with "Later" are remembered per tag in
  AsyncStorage (`lp_update_dismissed`); a newer tag shows again.
- "Update" downloads the release's `.apk` (new expo-file-system
  `File.createDownloadTask`, progress bar in the dialog) to the cache,
  then opens the Android installer via `expo-intent-launcher`
  (`ACTION_VIEW`, type `application/vnd.android.package-archive`,
  `FLAG_GRANT_READ_URI_PERMISSION`). The installer needs a content://
  URI — only the legacy file-system API exposes `getContentUriAsync`,
  so that one call imports from `expo-file-system/legacy`.
- First install from the app: Android asks to allow "Install unknown
  apps" for Learn Python. That needs `REQUEST_INSTALL_PACKAGES` in
  app.json (already set). If the install intent fails, the dialog
  offers "Allow installs in settings" (MANAGE_UNKNOWN_APP_SOURCES).
- Android only — the check is skipped on iOS (no APK to install).
- Silent failures: offline, no releases yet (404), or a failed request
  all mean "no update" and never interrupt the app. Manual check in
  Settings reports "Couldn't check for updates" instead.
- Shipping an update: bump `version` in app.json, build the APK with
  EAS, create a GitHub Release tagged e.g. `v1.1.0`, attach the .apk,
  write the changes in the release notes. The tag must be higher than
  the version users already have installed.
