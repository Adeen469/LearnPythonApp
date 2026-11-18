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
- Notes: the API's `notes` field is just a YouTube link — it is ignored.
  The written lesson shown below the video is the bundled tutorial (see
  "Written lessons (tutorials)" under Languages): title, intro, blocks
  (heading / para / code / list / note / tip), Summary + Practice, in the
  user's language when a translation overlay exists, English otherwise.
  A lesson with no mapped tutorial shows "No notes for this lesson yet."

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

## Languages (i18n)

The whole UI is translated into 12 languages. The videos themselves are
not translated — everything visible around them is (screen titles, buttons,
menus, labels, placeholders, errors, toasts, lesson titles, course video
titles, roadmap stage/topic names).

- Languages: English (`en`, default), Hinglish / Roman Hindi (`hi-roman`),
  Roman Urdu (`ur-roman`), French (`fr`), Japanese (`ja`), Korean (`ko`),
  Spanish (`es`), German (`de`), Portuguese — pt-BR (`pt`), Russian (`ru`),
  Arabic (`ar`), Chinese Simplified (`zh`). The picker in Settings shows
  each language's native name (e.g. "Français", "日本語", "한국어";
  Roman Hindi is "Hinglish (Roman)", Roman Urdu is "Urdu (Roman)").
- One file per language under `src/lib/i18n/` (`en.ts`, `hi-roman.ts`, …),
  each exporting a complete `Strings` object. `src/lib/i18n/index.tsx`
  defines the `Strings` type (English is the source of truth — every
  language file is typed as `Strings`, so TypeScript errors if a key is
  missing), the `LANGUAGES` list, a `LanguageProvider`, and a
  `useLanguage()` hook returning `{ lang, setLang, t }`.
- The choice persists in AsyncStorage (`lp_language`). Default: the
  device locale (via `expo-localization`) if it matches a supported
  language, else English. The provider is mounted in `src/app/_layout.tsx`
  (inside `ThemeProvider`); Settings has a Language section — tapping a
  language switches the whole app immediately.
- Titles live apart from UI strings, in `src/lib/i18n/titles/<lang>.ts`:
  `lessonTitle(id, fallback)` (keyed by lesson id, e.g.
  `python-day-001`), `videoTitle(videoId, fallback)` (keyed by videoId),
  `roadmapName(englishName)` (keyed by the English stage/topic name).
  Titles maps may be partial — a missing entry falls back to the original
  title. The main `Strings` object must stay complete in every language.
- NOT translated: the videos themselves; creator names
  (CodeWithHarry, Mosh, Apna College — proper names); AI tutor answers
  (generated from English transcripts — tutor UI only); release notes in
  the update dialog; server error messages passed through verbatim.
- The Summary/Practice headings in the tutorial card
  (`t.lesson.tutorialSummary` / `t.lesson.tutorialPractice`) are copied
  verbatim from the website's `web/src/lib/i18n/<lang>.ts` — including
  languages where the website still has them in English (fr/ja/ru) —
  so web and app match exactly.

### Written lessons (tutorials)

The lesson detail screen shows the written lesson below the video —
video first, then notes, same structure as the website's lesson page.
The tutorials are bundled as static data (no runtime fetch — no API
for them exists); the English text is a verbatim copy of the website's
`web/src/lib/learn/*.ts`.

- `src/lib/tutorials-data.ts` — English tutorials for the mapped slugs
  only (46 of the website's 268). Generated, do not hand-edit.
- `src/lib/lesson-tutorials.ts` — `LESSON_TO_TUTORIAL`: lesson id →
  tutorial slug. 59/100 lessons mapped. Exercise / solution / shoutout
  lessons have no tutorial (they practise, they don't teach); lessons
  whose topic has no tutorial yet also have none. A lesson with no
  entry shows the empty-notes text, never a wrong tutorial.
- `src/lib/tutorials.ts` — `LearnTutorial` / `TutorialBlock` types,
  `getTutorial(slug)`, `localizeTutorial(t, overlay)` (port of the
  website's function: prose replaced from the overlay, code blocks
  kept verbatim in English, missing fields fall back to English), and
  `getLocalizedTutorial(slug, lang)`.
- `src/lib/tutorials-i18n/<lang>.ts` — translation overlays, verbatim
  copies of the website's `web/src/lib/learn/i18n/<lang>/*.ts`
  (mapped slugs only). Coverage grows as the website finishes its
  translation chunks — as of the last copy: fr 41/46, ko 39/46,
  ja/de 38/46, zh 37/46, hi-roman/ur-roman/es/pt/ru/ar 35/46. The
  still-missing overlays are all in the classes + file-handling
  tutorials (e.g. `python-oop`, `python-classes`, `python-inheritance`,
  `python-file-handling`, `python-file-open`) — the website hasn't
  finished translating those chunks yet, so they render in English
  until the overlays are re-copied (see "How to update" below).

### How to update the tutorials

1. Website adds/fixes a tutorial or a translation: re-run the
   generators (`/tmp/lp-gen-data.mjs` for English,
   `/tmp/lp-gen-i18n.mjs` for overlays) after updating
   `src/lib/lesson-tutorials.ts` if the mapping changed. The
   generators copy verbatim — never hand-edit the generated files and
   never re-translate anything.
2. New tutorial topic on the website that matches an unmapped lesson:
   add the lesson → slug entry to `LESSON_TO_TUTORIAL`, re-run the
   English generator, re-run the overlay generator.
3. The Summary/Practice heading words come from the website's UI
   strings (`web/src/lib/i18n/<lang>.ts`) — if the website changes
   them, update `t.lesson.tutorialSummary` / `t.lesson.tutorialPractice`
   in the app's `src/lib/i18n/<lang>.ts` files to match verbatim.
- Arabic is translated as strings only — no RTL layout flipping in this
  version (follow-up).

### How to add a string

1. Add the key to the `Strings` type in `src/lib/i18n/index.tsx` and to
   `src/lib/i18n/en.ts` (English is the source of truth — the type and
   the English object must stay in sync).
2. Add the same key, translated, to all 11 other language files.
3. Use it as `t.<section>.<key>` in the screen. `npx tsc --noEmit` fails
   if any language file misses the key.

### How to add a language

1. Create `src/lib/i18n/<code>.ts` exporting a complete `Strings` object
   (copy `en.ts` and translate every key).
2. Create `src/lib/i18n/titles/<code>.ts` with the three title maps
   (partial is fine — missing titles fall back to the original).
3. Add `{ code, label, englishName }` to `LANGUAGES` in
   `src/lib/i18n/index.tsx` and register the file in the language map
   there. No screen changes needed — the Settings picker lists
   `LANGUAGES` automatically.
