// Roman Hindi (Hinglish) strings — natural everyday Roman Hindi/Urdu mix.
// Typed as `Strings` so TypeScript errors if any key is missing.
import type { Strings } from "./index";

export const hiRoman: Strings = {
  common: {
    appName: "Learn Python",
    signIn: "Sign in karo",
    signOut: "Sign out karo",
    email: "Email",
    emailPlaceholder: "you@example.com",
    password: "Password",
    showPassword: "Password dikhao",
    hidePassword: "Password chhupao",
    genericError: "Kuch galat ho gaya. Dobara try karo.",
    enterEmailAddress: "Apna email address daalo.",
    checkYourEmail: "Apna email check karo",
    sixDigitCodeLabel: "6-digit code",
    codePlaceholder: "123456",
    enterSixDigitCode: "6-digit code daalo.",
    backToSignIn: "Sign in par wapas jao",
    retry: "Dobara try karo",
    goBack: "Wapas jao",
    completed: "Complete ho gaya",
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
    requestFailed: (status: number) => `Request fail ho gayi (${status})`,
    send: "Bhejo",
    roadmap: "Roadmap",
    settings: "Settings",
    aiTutor: "AI Tutor",
  },
  tabs: {
    learn: "Seekho",
    courses: "Courses",
    editor: "Editor",
    profile: "Profile",
  },
  nav: {
    verifyEmail: "Email verify karo",
    lesson: "Lesson",
    course: "Course",
  },
  learn: {
    loadError: "Lessons load nahi ho paye.",
    greeting: (firstName: string) => `Hi, ${firstName}`,
    progressSummary: (totalDone: number) =>
      `100 Days of Code · ${totalDone}/100 lessons poore hue`,
    streakChip: (n: number) =>
      n === 1 ? `Streak: ${n} din` : `Streak: ${n} din`,
    continueLabel: "Jahan chhoda tha, wahan se aage badho",
    continueTitle: (day: number, lessonTitle: string) =>
      `Din ${day} · ${lessonTitle}`,
    continueWatched: (pct: number, duration: string) =>
      `${pct}% dekha · ${duration}`,
    allCompleteTitle: "100 lessons poore ho gaye",
    allCompleteSubtitle: "Shabash — neeche se koi bhi lesson dobara dekho.",
    sectionSubtitle: (from: number, to: number, done: number, total: number) =>
      `Din ${from}–${to} · ${done}/${total} complete`,
    lessonDay: (n: number) => `Din ${n}`,
    statusPlaying: (pct: number) => `Chal raha hai · ${pct}%`,
  },
  courses: {
    intro: "Python ke poore video courses — kisi creator ko chuno aur dekhna shuru karo.",
    countPlaylists: (n: number) => `${n} playlist`,
    countVideos: (n: number) => `${n} video`,
    countOneShots: (n: number) => `${n} one-shot`,
  },
  editor: {
    title: "Code Editor",
    subtitle: "Python yahin chalao — website wala editor, app ke andar.",
    signInNotice:
      "Apna code GitHub par save karne ke liye editor ke andar dobara sign in karo — editor ka apna sign-in hai, app se alag.",
    reload: "Editor reload karo",
    loading: "Editor load ho raha hai…",
  },
  profile: {
    signedOutSubtitle:
      "Learn Python, online ya offline. Apni progress, streak aur AI tutor is device par rakhne ke liye sign in karo.",
    createAccountLink: "Naye ho? Account banao",
    signedOutInfo:
      "Lessons bina sign in ke free mein dekh sakte ho. Tumhari progress isi device par rehti hai.",
    authBadge: (auth: "google" | "email") =>
      `${auth === "google" ? "Google" : "email"} se signed in ho`,
    authBadgeMfa: " · 2FA on hai",
    statStreakLabel: "din ki streak",
    statGoalLabel: "min / din ka goal",
    statLessonsLabel: "lessons poore hue",
    streakHint: "Aaj ek lesson complete karo aur apni streak shuru karo.",
  },
  lesson: {
    notesEmpty: "Is lesson ke liye abhi koi notes nahi hain.",
    notesHeading: "Notes",
    tutorialSummary: "Summary",
    tutorialPractice: "Practice",
    quizHeading: "Quiz",
    quizQuestionOf: (current: number, total: number) =>
      `Sawaal ${current} / ${total}`,
    quizScore: (correct: number, total: number) =>
      `Tumhara score: ${correct}/${total} (${Math.round(
        (correct / total) * 100
      )} %)`,
    quizPassed: "✓ Test pass ho gaya",
    quizFailed: "Abhi nahi — 70% ya zyada par pass hota hai. Dobara try karo.",
    quizRetake: "Quiz dobara do",
    quizNext: "Agla sawaal",
    quizSeeResult: "Result dekho",
    notFound: "Lesson nahi mila.",
    markComplete: "Complete karo",
    completedButton: "✓ Complete ho gaya",
    askTutor: "AI Tutor se poochho",
    saveOffline: "Offline save karo",
    downloading: "Download ho raha hai…",
    downloadingPct: (pct: number) => `Download ho raha hai ${pct}%`,
    removeDownload: "Download hatao",
    downloadPaused: "Download ruk gaya — dobara try karne ke liye phir se tap karo.",
    downloadFailed: "Download fail ho gaya.",
    savedOffline: "Offline save ho gaya",
    prevLesson: "← Pichhla",
    nextLesson: "Agla →",
  },
  course: {
    notFound: "Course nahi mila.",
    closePlayer: "Player band karo",
    tapPlayToStart: "Dekhna shuru karne ke liye play dabao",
    markAsComplete: "Complete mark karo",
    oneShotsHeading: "One-shot videos",
    playlistMeta: (count: number, totalDuration: string, done: number) =>
      `${count} videos · ${totalDuration} · ${done} complete hue`,
    oneShotsMeta: (count: number, totalDuration: string) =>
      `${count} videos · ${totalDuration}`,
    videoRowNumber: (n: number) => `${n}. `,
  },
  roadmap: {
    topicsComplete: (done: number, total: number) =>
      `${total} mein se ${done} topics complete`,
    stageTopicCount: (n: number) => `${n} topic`,
    topicDone: "✓ Ho gaya",
    topicLesson: "Lesson",
    topicMeta: (difficulty: string, minutes: number) =>
      `${difficulty} · ${minutes} min`,
  },
  tutor: {
    modeTutor: "Tutor",
    modeExplain: "Samjhao",
    modeDebug: "Debug karo",
    modeQuiz: "Quiz",
    hintTutor: "Lesson ke baare mein poochho",
    hintExplain: "Code paste karo aur poochho ye kya karta hai",
    hintDebug: "Toota hua code paste karo aur poochho kya galat hai",
    hintQuiz: "Is lesson par apna test lo",
    hintLessonSuffix: (hint: string, lessonId: string) =>
      `${hint} · Lesson ${lessonId}`,
    greetingLesson:
      "Is lesson ke baare mein kuch bhi poochho — main video se hi jawab deta hoon.",
    greetingGeneral:
      "Python ke baare mein kuch bhi poochho. Upar se mode chuno — code samjhana, debug karna, ya quiz.",
    signInGateTitle: "AI Tutor use karne ke liye sign in karo",
    signInGateText:
      "Tutor lesson videos se jawab deta hai, aur uske liye tumhara account chahiye.",
    signInAgain: "Dobara sign in karo",
    errorSessionExpired: "Tumhara session khatam ho gaya. Baat jaari rakhne ke liye dobara sign in karo.",
    errorGeneric:
      "Tutor abhi jawab nahi de paya. Apna connection check karo aur dobara try karo.",
    groundedBadge: "Video par based",
    citation: (citation: string) => `[${citation}]`,
    codePlaceholder: "Apna code yahan paste karo (optional)",
    askPlaceholder: "Sawaal poochho…",
  },
  auth: {
    welcomeBack: "Wapas swagat hai",
    signInSubtitle: "Seekhna jaari rakhne ke liye sign in karo.",
    continueWithGoogle: "Google se continue karo",
    orContinueWithEmail: "ya email se continue karo",
    passwordPlaceholder: "Tumhara password",
    forgotPassword: "Password bhool gaye?",
    createAccount: "Account banao",
    enterEmailAndPassword: "Apna email aur password daalo.",
    googleNoCode: "Google sign-in se code nahi mila. Dobara try karo.",
    signUpSubtitle: "Python seekhna shuru karo — free, card ki zaroorat nahi.",
    nameLabel: "Naam",
    namePlaceholder: "Tumhara naam",
    passwordMinPlaceholder: "Kam se kam 8 characters",
    verifyCodeNote: "Tumhara account verify karne ke liye hum tumhe 6-digit code email karenge.",
    alreadyHaveAccount: "Pehle se account hai?",
    enterName: "Apna naam daalo.",
    passwordMin8: "Password kam se kam 8 characters ka hona chahiye.",
    otpSubtitle: (email: string, purpose: "signup" | "signin") =>
      `Humne ${email || "aapke email"} par 6-digit code bheja hai. Neeche daalo ${
        purpose === "signup" ? "account verify karne" : "sign in karne"
      } ke liye.`,
    verify: "Verify karo",
    resendCodePrompt: "Code nahi mila? Dobara bhejo",
    noEmailToVerify: "Verify karne ke liye koi email nahi hai. Wapas jao aur dobara sign in karke try karo.",
    noEmailToSendCodeTo: "Code bhejne ke liye koi email nahi hai.",
    newCodeSentTo: (email: string) => `Naya code ${email} par bhej diya gaya.`,
    forgotPasswordTitle: "Password bhool gaye",
    forgotSubtitle:
      "Woh email daalo jisse tumne sign up kiya tha, hum tumhe reset link bhejenge.",
    sendResetLink: "Reset link bhejo",
    resetLinkSentFor: (email: string) =>
      `Agar ${email} ka account hai, to humne wahan password reset link bhej diya hai.`,
    resetLinkNote:
      "Link website kholega, jahan tum naya password chunoge. Phir yahan wapas aao aur usse sign in karo.",
    twoFactorTitle: "Two-factor auth",
    twoFactorSubtitle:
      "Tumhare account par two-factor authentication on hai. Apne authenticator app se 6-digit code daalo — ya email se code pane ke liye resend dabao.",
    verifyAndSignIn: "Verify karo aur sign in karo",
    resendCodeByEmail: "Email se code dobara bhejo",
    codeSentToEmail: "Tumhare email par code bhej diya gaya.",
  },
  settings: {
    signedInAs: (email: string) => `${email} se signed in ho`,
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
      "Din tab count hota hai jab tum lesson complete karte ho ya dekhte ho. Agar streak toot jaye, to 24 ghante ke andar use wapas la sakte ho — mahine mein 3 baar tak.",
    restoresLeft: (n: number) => `Is mahine restores bache: 3 mein se ${n}.`,
    updates: "Updates",
    appUpdates: "App updates",
    updatesExplainer:
      "Naye versions GitHub releases se aate hain. App launch par check karta hai; tum yahan se bhi check kar sakte ho.",
    checkForUpdates: "Updates check karo",
    upToDate: "Tum up to date ho.",
    couldntCheckUpdates: "Updates check nahi ho paye — baad mein dobara try karo.",
    account: "Account",
    appVersion: (version: string) => `Learn Python · version ${version}`,
    language: "Language",
    languageHint: "Poori app par turant lagoo ho jayega.",
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
    downloadFailed: "Update download nahi ho paya.",
    downloadInterrupted: "Download beech mein ruk gaya.",
    allowInstallsInSettings: "Settings mein installs allow karo",
    update: "Update karo",
    tryAgain: "Dobara try karo",
    later: "Baad mein",
    mandatoryHint: "App use karte rehne ke liye ye update zaroori hai.",
  },
};
