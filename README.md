# Learn Python — React Native App

The Learn Python app as a proper native app, built with Expo (SDK 58) and Expo Router. It talks to the same backend as the website — https://learnpythonprogram.vercel.app — so lessons, sign-in and the AI tutor stay in sync with the web app.

## Tabs

- **Learn** — all 100 lessons, grouped by stage, with video, written lesson (tutorial), quiz and offline save
- **Courses** — CodeWithHarry, Code With Mosh and Apna College playlists and one-shots
- **Editor** — the website's Pyodide code editor in a WebView
- **Profile** — sign-in, streak, daily goal and settings

## Features

- Email sign-in (OTP / password / forgot password) and Google sign-in (via the system browser, returns into the app with a deep link)
- 2FA (email code)
- AI tutor grounded in the lesson video's transcript, with `[mm:ss]` citations
- Streak tracking and daily goals (device-only — the website's per-user progress sync is intentionally not used)
- Save lessons offline for watching without a connection
- Dark-first theme, muted neutrals — no saturated gradients, no 3D cards
- 12 languages (English, Hinglish, Roman Urdu, French, Japanese, Korean, Spanish, German, Portuguese, Russian, Arabic, Chinese) — switch in Settings; lesson titles, video titles, roadmap names and the written lessons are translated too, the videos themselves are not

## Languages

The app UI is fully translated — see the "Languages (i18n)" section in `API.md`. To add a string: add the key to `src/lib/i18n/en.ts` and the same key, translated, to the other 11 language files (`npx tsc --noEmit` fails if any file misses a key). To add a language: create `src/lib/i18n/<code>.ts` plus `src/lib/i18n/titles/<code>.ts`, and add it to `LANGUAGES` in `src/lib/i18n/index.tsx`.

## Run it

```sh
npm install
npx expo start
```

Scan the QR code with Expo Go, or press `a` for an Android emulator. For a standalone APK, build with EAS Build (`npx eas-cli@latest build -p android`) — the Android package is `com.learnpython.app` and the deep-link scheme is `learnpython`.

## Updates

When a new version is released on GitHub, the app shows an "Update available" dialog with the release notes, and downloads the new APK inside the app. To ship an update: bump `version` in `app.json`, build the APK (`npx eas-cli@latest build -p android`), create a GitHub Release tagged like `v1.1.0`, attach the APK, and write the changes in the release notes. Put `[mandatory]` in the release title to force the update — the app blocks until it is installed.

## Backend notes

The app reuses the website's API. Two small web-side additions support it (in the Learn-Python repo):

- `GET /api/auth/google?app=1` — app mode for the Google flow (the system browser has no app user-agent marker)
- `GET /api/auth/app-exchange?format=json` — returns `{ user }` with the session cookie instead of a redirect, so the native client can capture the cookie

See `API.md` in this repo for the full API contract.
