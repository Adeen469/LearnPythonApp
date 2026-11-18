// English strings — the source of truth for every UI string in the app.
// Every other language file is typed as `Strings`, so TypeScript errors
// if any key is missing. Dynamic strings are functions so each language
// can apply its own grammar (plurals, word order, units).
//
// Scope: UI chrome ONLY. Content stays in English and is never passed
// through here: lesson/video titles (use the titles maps in ./titles),
// course/creator names, notes text, AI tutor answers, release notes.
// "Learn Python" is the product name and stays identical in most
// languages (translators may transliterate it only if natural).

import type { Strings } from "./index";

export const en: Strings = {
  common: {
    appName: "Learn Python",
    signIn: "Sign in",
    signOut: "Sign out",
    email: "Email",
    emailPlaceholder: "you@example.com",
    password: "Password",
    showPassword: "Show password",
    hidePassword: "Hide password",
    genericError: "Something went wrong. Please try again.",
    enterEmailAddress: "Enter your email address.",
    checkYourEmail: "Check your email",
    sixDigitCodeLabel: "6-digit code",
    codePlaceholder: "123456",
    enterSixDigitCode: "Enter the 6-digit code.",
    backToSignIn: "Back to sign in",
    retry: "Retry",
    goBack: "Go back",
    completed: "Completed",
    watchedPct: (pct: number) => `Watched ${pct}%`,
    notStarted: "Not started",
    duration: (totalSeconds: number) => {
      const s = Math.max(0, Math.round(totalSeconds));
      const h = Math.floor(s / 3600);
      const m = Math.floor((s % 3600) / 60);
      const sec = s % 60;
      const mm = String(m).padStart(2, "0");
      const ss = String(sec).padStart(2, "0");
      return h > 0 ? `${h}:${mm}:${ss}` : `${m}:${ss}`;
    },
    durationTotal: (totalSeconds: number) => {
      const totalMinutes = Math.floor(totalSeconds / 60);
      const h = Math.floor(totalMinutes / 60);
      const m = totalMinutes % 60;
      return h > 0 ? `${h}h ${m}m` : `${m}m`;
    },
    requestFailed: (status: number) => `Request failed (${status})`,
    send: "Send",
    roadmap: "Roadmap",
    settings: "Settings",
    aiTutor: "AI Tutor",
  },
  tabs: {
    learn: "Learn",
    courses: "Courses",
    editor: "Editor",
    profile: "Profile",
  },
  nav: {
    verifyEmail: "Verify email",
    lesson: "Lesson",
    course: "Course",
  },
  learn: {
    loadError: "Couldn't load lessons.",
    greeting: (firstName: string) => `Hi, ${firstName}`,
    progressSummary: (totalDone: number) =>
      `100 Days of Code · ${totalDone}/100 lessons complete`,
    streakChip: (n: number) =>
      n === 1 ? `Streak: ${n} day` : `Streak: ${n} days`,
    continueLabel: "Continue where you left off",
    continueTitle: (day: number, lessonTitle: string) =>
      `Day ${day} · ${lessonTitle}`,
    continueWatched: (pct: number, duration: string) =>
      `Watched ${pct}% · ${duration}`,
    allCompleteTitle: "All 100 lessons complete",
    allCompleteSubtitle: "Nice work — revisit any lesson below.",
    sectionSubtitle: (from: number, to: number, done: number, total: number) =>
      `Days ${from}–${to} · ${done}/${total} complete`,
    lessonDay: (n: number) => `Day ${n}`,
    statusPlaying: (pct: number) => `Playing · ${pct}%`,
  },
  courses: {
    intro: "Full Python video courses — pick a creator to start watching.",
    countPlaylists: (n: number) =>
      n === 1 ? `${n} playlist` : `${n} playlists`,
    countVideos: (n: number) => (n === 1 ? `${n} video` : `${n} videos`),
    countOneShots: (n: number) =>
      n === 1 ? `${n} one-shot` : `${n} one-shots`,
  },
  editor: {
    title: "Code Editor",
    subtitle: "Run Python right here — the website's editor, in the app.",
    signInNotice:
      "Sign in again inside the editor to save your code to GitHub — the editor keeps its own sign-in, separate from the app.",
    reload: "Reload editor",
    loading: "Loading editor…",
  },
  profile: {
    signedOutSubtitle:
      "Learn Python, online or off. Sign in to keep your progress, streak and AI tutor on this device.",
    createAccountLink: "New here? Create an account",
    signedOutInfo:
      "Lessons are free to browse without signing in. Your progress stays on this device.",
    authBadge: (auth: "google" | "email") =>
      `Signed in with ${auth === "google" ? "Google" : "email"}`,
    authBadgeMfa: " · 2FA on",
    statStreakLabel: "day streak",
    statGoalLabel: "min / day goal",
    statLessonsLabel: "lessons done",
    streakHint: "Complete a lesson today to start your streak.",
  },
  lesson: {
    notesEmpty: "No notes for this lesson yet.",
    notesHeading: "Notes",
    tutorialSummary: "Summary",
    tutorialPractice: "Practice",
    quizHeading: "Quiz",
    quizQuestionOf: (current: number, total: number) =>
      `Question ${current} of ${total}`,
    quizScore: (correct: number, total: number) =>
      `Your score: ${correct}/${total} (${Math.round(
        (correct / total) * 100
      )} %)`,
    quizPassed: "✓ Test passed",
    quizFailed: "Not quite — 70% or more passes. Try again.",
    quizRetake: "Retake quiz",
    quizNext: "Next question",
    quizSeeResult: "See result",
    notFound: "Lesson not found.",
    markComplete: "Mark complete",
    completedButton: "✓ Completed",
    askTutor: "Ask AI Tutor",
    saveOffline: "Save Offline",
    downloading: "Downloading…",
    downloadingPct: (pct: number) => `Downloading ${pct}%`,
    removeDownload: "Remove download",
    downloadPaused: "Download paused — tap again to retry.",
    downloadFailed: "Download failed.",
    savedOffline: "Saved offline",
    prevLesson: "← Prev",
    nextLesson: "Next →",
  },
  course: {
    notFound: "Course not found.",
    closePlayer: "Close player",
    tapPlayToStart: "Tap play to start watching",
    markAsComplete: "Mark as complete",
    oneShotsHeading: "One-shot videos",
    playlistMeta: (count: number, totalDuration: string, done: number) =>
      `${count} videos · ${totalDuration} · ${done} completed`,
    oneShotsMeta: (count: number, totalDuration: string) =>
      `${count} videos · ${totalDuration}`,
    videoRowNumber: (n: number) => `${n}. `,
  },
  roadmap: {
    topicsComplete: (done: number, total: number) =>
      `${done} of ${total} topics complete`,
    stageTopicCount: (n: number) => (n === 1 ? `${n} topic` : `${n} topics`),
    topicDone: "✓ Done",
    topicLesson: "Lesson",
    topicMeta: (difficulty: string, minutes: number) =>
      `${difficulty} · ${minutes} min`,
  },
  tutor: {
    modeTutor: "Tutor",
    modeExplain: "Explain",
    modeDebug: "Debug",
    modeQuiz: "Quiz",
    hintTutor: "Ask about the lesson",
    hintExplain: "Paste code and ask what it does",
    hintDebug: "Paste broken code and ask what is wrong",
    hintQuiz: "Test yourself on the lesson",
    hintLessonSuffix: (hint: string, lessonId: string) =>
      `${hint} · Lesson ${lessonId}`,
    greetingLesson:
      "Ask me anything about this lesson — I answer from the video itself.",
    greetingGeneral:
      "Ask me anything about Python. Pick a mode above to explain code, debug it, or quiz yourself.",
    signInGateTitle: "Sign in to use the AI Tutor",
    signInGateText:
      "The tutor answers from the lesson videos, and that needs your account.",
    signInAgain: "Sign in again",
    errorSessionExpired: "Your session expired. Sign in again to keep chatting.",
    errorGeneric:
      "The tutor couldn't answer right now. Check your connection and try again.",
    groundedBadge: "Grounded in the video",
    citation: (citation: string) => `[${citation}]`,
    codePlaceholder: "Paste your code here (optional)",
    askPlaceholder: "Ask a question…",
  },
  auth: {
    welcomeBack: "Welcome back",
    signInSubtitle: "Sign in to continue learning Python.",
    continueWithGoogle: "Continue with Google",
    orContinueWithEmail: "or continue with email",
    passwordPlaceholder: "Your password",
    forgotPassword: "Forgot password?",
    createAccount: "Create account",
    enterEmailAndPassword: "Enter your email and password.",
    googleNoCode: "Google sign-in didn't return a code. Please try again.",
    signUpSubtitle: "Start learning Python — free, no card needed.",
    nameLabel: "Name",
    namePlaceholder: "Your name",
    passwordMinPlaceholder: "At least 8 characters",
    verifyCodeNote: "We'll email you a 6-digit code to verify your account.",
    alreadyHaveAccount: "Already have an account?",
    enterName: "Enter your name.",
    passwordMin8: "Password must be at least 8 characters.",
    otpSubtitle: (email: string, purpose: "signup" | "signin") =>
      `We sent a 6-digit code to ${email || "your email"}. Enter it below to ${
        purpose === "signup" ? "verify your account" : "sign in"
      }.`,
    verify: "Verify",
    resendCodePrompt: "Didn't get a code? Resend",
    noEmailToVerify: "No email to verify. Go back and try signing in again.",
    noEmailToSendCodeTo: "No email to send a code to.",
    newCodeSentTo: (email: string) => `A new code was sent to ${email}.`,
    forgotPasswordTitle: "Forgot password",
    forgotSubtitle:
      "Enter the email you signed up with and we'll send you a reset link.",
    sendResetLink: "Send reset link",
    resetLinkSentFor: (email: string) =>
      `If an account exists for ${email}, we sent a password reset link there.`,
    resetLinkNote:
      "The link opens the website, where you choose a new password. Then come back here and sign in with it.",
    twoFactorTitle: "Two-factor auth",
    twoFactorSubtitle:
      "Your account has two-factor authentication on. Enter the 6-digit code from your authenticator app — or tap resend to get a code by email instead.",
    verifyAndSignIn: "Verify and sign in",
    resendCodeByEmail: "Resend code by email",
    codeSentToEmail: "A code was sent to your email.",
  },
  settings: {
    signedInAs: (email: string) => `Signed in as ${email}`,
    appearance: "Appearance",
    theme: "Theme",
    themeDark: "Dark",
    themeLight: "Light",
    darkIsDefault: "Dark is the default.",
    dailyGoal: "Daily goal",
    minutesPerDay: "Minutes of learning per day",
    goalMinutes: (minutes: number) => `${minutes} min`,
    streak: "Streak",
    streakCount: (count: number) => `${count} day streak`,
    streakExplainer:
      "A day counts when you complete or watch a lesson. If your streak breaks, you can restore it within 24 hours — up to 3 times a month.",
    restoresLeft: (n: number) => `Restores left this month: ${n} of 3.`,
    updates: "Updates",
    appUpdates: "App updates",
    updatesExplainer:
      "New versions arrive as GitHub releases. The app checks on launch; you can check here too.",
    checkForUpdates: "Check for updates",
    upToDate: "You're up to date.",
    couldntCheckUpdates: "Couldn't check for updates — try again later.",
    account: "Account",
    appVersion: (version: string) => `Learn Python · version ${version}`,
    language: "Language",
    languageHint: "Applies to the whole app right away.",
  },
  update: {
    available: "Update available",
    versionLine: (version: string, size: string, mandatory: boolean) =>
      `Version ${version}${size ? ` · ${size}` : ""}${
        mandatory ? " · Required" : ""
      }`,
    sizeMB: (bytes: number) => `${(bytes / (1024 * 1024)).toFixed(1)} MB`,
    newVersionAvailable: "A new version of Learn Python is available.",
    downloading: (percent: number) => `Downloading… ${percent}%`,
    openingInstaller: "Opening installer…",
    downloadFailed: "The update could not be downloaded.",
    downloadInterrupted: "Download was interrupted.",
    allowInstallsInSettings: "Allow installs in settings",
    update: "Update",
    tryAgain: "Try again",
    later: "Later",
    mandatoryHint: "This update is required to keep using the app.",
  },
};
