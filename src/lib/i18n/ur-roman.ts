// Roman Urdu strings — natural everyday Roman Urdu, polite "karein" forms.
// Typed as `Strings` so TypeScript errors if any key is missing.
import type { Strings } from "./index";

export const urRoman: Strings = {
  common: {
    appName: "Learn Python",
    signIn: "Sign in karein",
    signOut: "Sign out karein",
    email: "Email",
    emailPlaceholder: "you@example.com",
    password: "Password",
    showPassword: "Password dikhayein",
    hidePassword: "Password chhupayein",
    genericError: "Kuch ghalat ho gaya. Dobara koshish karein.",
    enterEmailAddress: "Apna email address likhein.",
    checkYourEmail: "Apna email check karein",
    sixDigitCodeLabel: "6-digit code",
    codePlaceholder: "123456",
    enterSixDigitCode: "6-digit code likhein.",
    backToSignIn: "Sign in par wapas jayein",
    retry: "Dobara koshish karein",
    goBack: "Wapas jayein",
    completed: "Mukammal ho gaya",
    watchedPct: (pct: number) => `${pct}% dekha`,
    notStarted: "Abhi shuru nahi hua",
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
    requestFailed: (status: number) => `Request nakam ho gayi (${status})`,
    send: "Bhejein",
    roadmap: "Roadmap",
    settings: "Settings",
    aiTutor: "AI Tutor",
  },
  tabs: {
    learn: "Seekhein",
    courses: "Courses",
    editor: "Editor",
    profile: "Profile",
  },
  nav: {
    verifyEmail: "Email verify karein",
    lesson: "Lesson",
    course: "Course",
  },
  learn: {
    loadError: "Lessons load nahi ho sake.",
    greeting: (firstName: string) => `Hi, ${firstName}`,
    progressSummary: (totalDone: number) =>
      `100 Days of Code · ${totalDone}/100 lessons mukammal hue`,
    streakChip: (n: number) =>
      n === 1 ? `Streak: ${n} din` : `Streak: ${n} din`,
    continueLabel: "Jahan chhora tha, wahan se aage barhein",
    continueTitle: (day: number, lessonTitle: string) =>
      `Din ${day} · ${lessonTitle}`,
    continueWatched: (pct: number, duration: string) =>
      `${pct}% dekha · ${duration}`,
    allCompleteTitle: "100 lessons mukammal ho gaye",
    allCompleteSubtitle: "Shabash — neeche se koi bhi lesson dobara dekhein.",
    sectionSubtitle: (from: number, to: number, done: number, total: number) =>
      `Din ${from}–${to} · ${done}/${total} mukammal`,
    lessonDay: (n: number) => `Din ${n}`,
    statusPlaying: (pct: number) => `Chal raha hai · ${pct}%`,
  },
  courses: {
    intro: "Python ke mukammal video courses — kisi creator ko chunein aur dekhna shuru karein.",
    countPlaylists: (n: number) => `${n} playlist`,
    countVideos: (n: number) => `${n} video`,
    countOneShots: (n: number) => `${n} one-shot`,
  },
  editor: {
    title: "Code Editor",
    subtitle: "Python yahin chalaye — website wala editor, app ke andar.",
    signInNotice:
      "Apna code GitHub par save karne ke liye editor ke andar dobara sign in karein — editor ka apna sign-in hai, app se alag.",
    reload: "Editor reload karein",
    loading: "Editor load ho raha hai…",
  },
  profile: {
    signedOutSubtitle:
      "Learn Python, online ya offline. Apni progress, streak aur AI tutor is device par rakhne ke liye sign in karein.",
    createAccountLink: "Naye hain? Account banayein",
    signedOutInfo:
      "Lessons baghair sign in ke muft mein dekh sakte hain. Aapki progress isi device par rehti hai.",
    authBadge: (auth: "google" | "email") =>
      `${auth === "google" ? "Google" : "email"} se signed in hain`,
    authBadgeMfa: " · 2FA on hai",
    statStreakLabel: "din ki streak",
    statGoalLabel: "min / din ka goal",
    statLessonsLabel: "lessons mukammal",
    streakHint: "Aaj ek lesson mukammal karein aur apni streak shuru karein.",
  },
  lesson: {
    notesEmpty: "Is lesson ke liye abhi koi notes nahi hain.",
    notesHeading: "Notes",
    tutorialSummary: "Khulasa",
    tutorialPractice: "Practice",
    quizHeading: "Quiz",
    quizQuestionOf: (current: number, total: number) =>
      `Sawal ${current} / ${total}`,
    quizScore: (correct: number, total: number) =>
      `Aapka score: ${correct}/${total} (${Math.round(
        (correct / total) * 100
      )} %)`,
    quizPassed: "✓ Test pass ho gaya",
    quizFailed: "Abhi nahi — 70% ya zyada par pass hota hai. Dobara koshish karein.",
    quizRetake: "Quiz dobara dein",
    quizNext: "Agla sawal",
    quizSeeResult: "Result dekhein",
    notFound: "Lesson nahi mila.",
    markComplete: "Mukammal karein",
    completedButton: "✓ Mukammal ho gaya",
    askTutor: "AI Tutor se poochhein",
    saveOffline: "Offline save karein",
    downloading: "Download ho raha hai…",
    downloadingPct: (pct: number) => `Download ho raha hai ${pct}%`,
    removeDownload: "Download hatayein",
    downloadPaused: "Download ruk gaya — dobara koshish ke liye phir se tap karein.",
    downloadFailed: "Download nakam ho gaya.",
    savedOffline: "Offline save ho gaya",
    prevLesson: "← Pichhla",
    nextLesson: "Agla →",
  },
  course: {
    notFound: "Course nahi mila.",
    closePlayer: "Player band karein",
    tapPlayToStart: "Dekhna shuru karne ke liye play dabayein",
    markAsComplete: "Mukammal mark karein",
    oneShotsHeading: "One-shot videos",
    playlistMeta: (count: number, totalDuration: string, done: number) =>
      `${count} videos · ${totalDuration} · ${done} mukammal hue`,
    oneShotsMeta: (count: number, totalDuration: string) =>
      `${count} videos · ${totalDuration}`,
    videoRowNumber: (n: number) => `${n}. `,
  },
  roadmap: {
    topicsComplete: (done: number, total: number) =>
      `${total} mein se ${done} topics mukammal`,
    stageTopicCount: (n: number) => `${n} topic`,
    topicDone: "✓ Ho gaya",
    topicLesson: "Lesson",
    topicMeta: (difficulty: string, minutes: number) =>
      `${difficulty} · ${minutes} min`,
  },
  tutor: {
    modeTutor: "Tutor",
    modeExplain: "Samjhayein",
    modeDebug: "Debug karein",
    modeQuiz: "Quiz",
    hintTutor: "Lesson ke baare mein poochhein",
    hintExplain: "Code paste karein aur poochhein ye kya karta hai",
    hintDebug: "Kharab code paste karein aur poochhein kya ghalat hai",
    hintQuiz: "Is lesson par apna test lein",
    hintLessonSuffix: (hint: string, lessonId: string) =>
      `${hint} · Lesson ${lessonId}`,
    greetingLesson:
      "Is lesson ke baare mein kuch bhi poochhein — main video se hi jawab deta hoon.",
    greetingGeneral:
      "Python ke baare mein kuch bhi poochhein. Upar se mode chunein — code samjhana, debug karna, ya quiz.",
    signInGateTitle: "AI Tutor istemal karne ke liye sign in karein",
    signInGateText:
      "Tutor lesson videos se jawab deta hai, aur us ke liye aapka account chahiye.",
    signInAgain: "Dobara sign in karein",
    errorSessionExpired: "Aapka session khatam ho gaya. Baat jaari rakhne ke liye dobara sign in karein.",
    errorGeneric:
      "Tutor abhi jawab nahi de saka. Apna connection check karein aur dobara koshish karein.",
    groundedBadge: "Video par mabni",
    citation: (citation: string) => `[${citation}]`,
    codePlaceholder: "Apna code yahan paste karein (optional)",
    askPlaceholder: "Sawal poochhein…",
  },
  auth: {
    welcomeBack: "Khush aamdeed",
    signInSubtitle: "Seekhna jaari rakhne ke liye sign in karein.",
    continueWithGoogle: "Google se continue karein",
    orContinueWithEmail: "ya email se continue karein",
    passwordPlaceholder: "Aapka password",
    forgotPassword: "Password bhool gaye?",
    createAccount: "Account banayein",
    enterEmailAndPassword: "Apna email aur password likhein.",
    googleNoCode: "Google sign-in se code nahi mila. Dobara koshish karein.",
    signUpSubtitle: "Python seekhna shuru karein — muft, card ki zaroorat nahi.",
    nameLabel: "Naam",
    namePlaceholder: "Aapka naam",
    passwordMinPlaceholder: "Kam se kam 8 characters",
    verifyCodeNote: "Aapka account verify karne ke liye hum aapko 6-digit code email karein ge.",
    alreadyHaveAccount: "Pehle se account hai?",
    enterName: "Apna naam likhein.",
    passwordMin8: "Password kam se kam 8 characters ka hona chahiye.",
    otpSubtitle: (email: string, purpose: "signup" | "signin") =>
      `Hum ne ${email || "aap ke email"} par 6-digit code bheja hai. Neeche likhein ${
        purpose === "signup" ? "account verify karne" : "sign in karne"
      } ke liye.`,
    verify: "Verify karein",
    resendCodePrompt: "Code nahi mila? Dobara bhejein",
    noEmailToVerify: "Verify karne ke liye koi email nahi hai. Wapas jayein aur dobara sign in kar ke koshish karein.",
    noEmailToSendCodeTo: "Code bhejne ke liye koi email nahi hai.",
    newCodeSentTo: (email: string) => `Naya code ${email} par bhej diya gaya.`,
    forgotPasswordTitle: "Password bhool gaye",
    forgotSubtitle:
      "Woh email likhein jis se aap ne sign up kiya tha, hum aapko reset link bhejein ge.",
    sendResetLink: "Reset link bhejein",
    resetLinkSentFor: (email: string) =>
      `Agar ${email} ka account hai, to hum ne wahan password reset link bhej diya hai.`,
    resetLinkNote:
      "Link website khole ga, jahan aap naya password chunein ge. Phir yahan wapas aayein aur us se sign in karein.",
    twoFactorTitle: "Two-factor auth",
    twoFactorSubtitle:
      "Aapke account par two-factor authentication on hai. Apne authenticator app se 6-digit code likhein — ya email se code paane ke liye resend dabayein.",
    verifyAndSignIn: "Verify karein aur sign in karein",
    resendCodeByEmail: "Email se code dobara bhejein",
    codeSentToEmail: "Aapke email par code bhej diya gaya.",
  },
  settings: {
    signedInAs: (email: string) => `${email} se signed in hain`,
    appearance: "Appearance",
    theme: "Theme",
    themeDark: "Dark",
    themeLight: "Light",
    darkIsDefault: "Dark default hai.",
    dailyGoal: "Daily goal",
    minutesPerDay: "Roz kitne minute seekhna hai",
    goalMinutes: (minutes: number) => `${minutes} min`,
    streak: "Streak",
    streakCount: (count: number) => `${count} din ki streak`,
    streakExplainer:
      "Din tab count hota hai jab aap lesson mukammal karte hain ya dekhte hain. Agar streak toot jaye, to 24 ghante ke andar use wapas la sakte hain — mahine mein 3 baar tak.",
    restoresLeft: (n: number) => `Is mahine restores bache: 3 mein se ${n}.`,
    updates: "Updates",
    appUpdates: "App updates",
    updatesExplainer:
      "Naye versions GitHub releases se aate hain. App launch par check karta hai; aap yahan se bhi check kar sakte hain.",
    checkForUpdates: "Updates check karein",
    upToDate: "Aap up to date hain.",
    couldntCheckUpdates: "Updates check nahi ho sake — baad mein dobara koshish karein.",
    account: "Account",
    appVersion: (version: string) => `Learn Python · version ${version}`,
    language: "Language",
    languageHint: "Poori app par foran lagoo ho jaye ga.",
  },
  update: {
    available: "Update available hai",
    versionLine: (version: string, size: string, mandatory: boolean) =>
      `Version ${version}${size ? ` · ${size}` : ""}${
        mandatory ? " · Zaroori" : ""
      }`,
    sizeMB: (bytes: number) => `${(bytes / (1024 * 1024)).toFixed(1)} MB`,
    newVersionAvailable: "Learn Python ka naya version available hai.",
    downloading: (percent: number) => `Download ho raha hai… ${percent}%`,
    openingInstaller: "Installer khul raha hai…",
    downloadFailed: "Update download nahi ho saka.",
    downloadInterrupted: "Download beech mein ruk gaya.",
    allowInstallsInSettings: "Settings mein installs allow karein",
    update: "Update karein",
    tryAgain: "Dobara koshish karein",
    later: "Baad mein",
    mandatoryHint: "App istemal karte rehne ke liye ye update zaroori hai.",
  },
};
