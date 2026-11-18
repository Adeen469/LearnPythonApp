// German strings — UI chrome only (see en.ts for scope).
import type { Strings } from "./index";

export const de: Strings = {
  common: {
    appName: "Learn Python",
    signIn: "Anmelden",
    signOut: "Abmelden",
    email: "E-Mail",
    emailPlaceholder: "you@example.com",
    password: "Passwort",
    showPassword: "Passwort anzeigen",
    hidePassword: "Passwort ausblenden",
    genericError: "Etwas ist schiefgelaufen. Bitte versuche es erneut.",
    enterEmailAddress: "Gib deine E-Mail-Adresse ein.",
    checkYourEmail: "Prüfe deine E-Mails",
    sixDigitCodeLabel: "6-stelliger Code",
    codePlaceholder: "123456",
    enterSixDigitCode: "Gib den 6-stelligen Code ein.",
    backToSignIn: "Zurück zur Anmeldung",
    retry: "Erneut versuchen",
    goBack: "Zurück",
    completed: "Abgeschlossen",
    watchedPct: (pct: number) => `${pct} % angesehen`,
    notStarted: "Nicht begonnen",
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
    requestFailed: (status: number) => `Anfrage fehlgeschlagen (${status})`,
    send: "Senden",
    roadmap: "Lernplan",
    settings: "Einstellungen",
    aiTutor: "KI-Tutor",
  },
  tabs: {
    learn: "Lernen",
    courses: "Kurse",
    editor: "Editor",
    profile: "Profil",
  },
  nav: {
    verifyEmail: "E-Mail bestätigen",
    lesson: "Lektion",
    course: "Kurs",
  },
  learn: {
    loadError: "Lektionen konnten nicht geladen werden.",
    greeting: (firstName: string) => `Hallo, ${firstName}`,
    progressSummary: (totalDone: number) =>
      `100 Tage Code · ${totalDone}/100 Lektionen abgeschlossen`,
    streakChip: (n: number) =>
      n === 1 ? `Serie: ${n} Tag` : `Serie: ${n} Tage`,
    continueLabel: "Mach da weiter, wo du aufgehört hast",
    continueTitle: (day: number, lessonTitle: string) =>
      `Tag ${day} · ${lessonTitle}`,
    continueWatched: (pct: number, duration: string) =>
      `${pct} % angesehen · ${duration}`,
    allCompleteTitle: "Alle 100 Lektionen abgeschlossen",
    allCompleteSubtitle: "Gute Arbeit – sieh dir unten jede Lektion erneut an.",
    sectionSubtitle: (from: number, to: number, done: number, total: number) =>
      `Tage ${from}–${to} · ${done}/${total} abgeschlossen`,
    lessonDay: (n: number) => `Tag ${n}`,
    statusPlaying: (pct: number) => `Läuft · ${pct} %`,
  },
  courses: {
    intro:
      "Vollständige Python-Videokurse – wähle einen Creator, um mit dem Ansehen zu beginnen.",
    countPlaylists: (n: number) =>
      n === 1 ? `${n} Playlist` : `${n} Playlists`,
    countVideos: (n: number) => (n === 1 ? `${n} Video` : `${n} Videos`),
    countOneShots: (n: number) =>
      n === 1 ? `${n} Einzelvideo` : `${n} Einzelvideos`,
  },
  editor: {
    title: "Code-Editor",
    subtitle: "Führe Python direkt hier aus – der Editor der Website, in der App.",
    signInNotice:
      "Melde dich im Editor erneut an, um deinen Code auf GitHub zu speichern – der Editor hat eine eigene Anmeldung, getrennt von der App.",
    reload: "Editor neu laden",
    loading: "Editor wird geladen…",
  },
  profile: {
    signedOutSubtitle:
      "Learn Python, online oder offline. Melde dich an, um deinen Fortschritt, deine Serie und deinen KI-Tutor auf diesem Gerät zu behalten.",
    createAccountLink: "Neu hier? Konto erstellen",
    signedOutInfo:
      "Lektionen können kostenlos ohne Anmeldung durchstöbert werden. Dein Fortschritt bleibt auf diesem Gerät.",
    authBadge: (auth: "google" | "email") =>
      `Angemeldet mit ${auth === "google" ? "Google" : "E-Mail"}`,
    authBadgeMfa: " · 2FA aktiv",
    statStreakLabel: "Tage Serie",
    statGoalLabel: "Min. / Tag Ziel",
    statLessonsLabel: "Lektionen geschafft",
    streakHint: "Schließe heute eine Lektion ab, um deine Serie zu starten.",
  },
  lesson: {
    notesEmpty: "Noch keine Notizen zu dieser Lektion.",
    notesHeading: "Notizen",
    tutorialSummary: "Zusammenfassung",
    tutorialPractice: "Üben",
    quizHeading: "Quiz",
    quizQuestionOf: (current: number, total: number) =>
      `Frage ${current} von ${total}`,
    quizScore: (correct: number, total: number) =>
      `Dein Ergebnis: ${correct}/${total} (${Math.round(
        (correct / total) * 100
      )} %)`,
    quizPassed: "✓ Test bestanden",
    quizFailed: "Nicht ganz – 70 % oder mehr bestehen. Versuch es erneut.",
    quizRetake: "Quiz wiederholen",
    quizNext: "Nächste Frage",
    quizSeeResult: "Ergebnis ansehen",
    notFound: "Lektion nicht gefunden.",
    markComplete: "Als abgeschlossen markieren",
    completedButton: "✓ Abgeschlossen",
    askTutor: "KI-Tutor fragen",
    saveOffline: "Offline speichern",
    downloading: "Wird heruntergeladen…",
    downloadingPct: (pct: number) => `Herunterladen: ${pct} %`,
    removeDownload: "Download entfernen",
    downloadPaused: "Download pausiert – tippe erneut, um es erneut zu versuchen.",
    downloadFailed: "Download fehlgeschlagen.",
    savedOffline: "Offline gespeichert",
    prevLesson: "← Zurück",
    nextLesson: "Weiter →",
  },
  course: {
    notFound: "Kurs nicht gefunden.",
    closePlayer: "Player schließen",
    tapPlayToStart: "Tippe auf „Abspielen“, um mit dem Ansehen zu beginnen",
    markAsComplete: "Als abgeschlossen markieren",
    oneShotsHeading: "Einzelvideos",
    playlistMeta: (count: number, totalDuration: string, done: number) =>
      `${count} Videos · ${totalDuration} · ${done} abgeschlossen`,
    oneShotsMeta: (count: number, totalDuration: string) =>
      `${count} Videos · ${totalDuration}`,
    videoRowNumber: (n: number) => `${n}. `,
  },
  roadmap: {
    topicsComplete: (done: number, total: number) =>
      `${done} von ${total} Themen abgeschlossen`,
    stageTopicCount: (n: number) => (n === 1 ? `${n} Thema` : `${n} Themen`),
    topicDone: "✓ Fertig",
    topicLesson: "Lektion",
    topicMeta: (difficulty: string, minutes: number) =>
      `${difficulty} · ${minutes} Min.`,
  },
  tutor: {
    modeTutor: "Tutor",
    modeExplain: "Erklären",
    modeDebug: "Fehlersuche",
    modeQuiz: "Quiz",
    hintTutor: "Frag zur Lektion",
    hintExplain: "Füge Code ein und frag, was er macht",
    hintDebug: "Füge fehlerhaften Code ein und frag, was falsch ist",
    hintQuiz: "Teste dich zur Lektion",
    hintLessonSuffix: (hint: string, lessonId: string) =>
      `${hint} · Lektion ${lessonId}`,
    greetingLesson:
      "Frag mich alles zu dieser Lektion – ich antworte anhand des Videos selbst.",
    greetingGeneral:
      "Frag mich alles über Python. Wähle oben einen Modus, um Code zu erklären, Fehler zu suchen oder dich zu testen.",
    signInGateTitle: "Melde dich an, um den KI-Tutor zu nutzen",
    signInGateText:
      "Der Tutor antwortet anhand der Lektionsvideos, und dafür brauchst du dein Konto.",
    signInAgain: "Erneut anmelden",
    errorSessionExpired:
      "Deine Sitzung ist abgelaufen. Melde dich erneut an, um weiter zu chatten.",
    errorGeneric:
      "Der Tutor kann gerade nicht antworten. Prüfe deine Verbindung und versuch es erneut.",
    groundedBadge: "Basiert auf dem Video",
    citation: (citation: string) => `[${citation}]`,
    codePlaceholder: "Füge deinen Code hier ein (optional)",
    askPlaceholder: "Stell eine Frage…",
  },
  auth: {
    welcomeBack: "Willkommen zurück",
    signInSubtitle: "Melde dich an, um Python weiterzulernen.",
    continueWithGoogle: "Mit Google fortfahren",
    orContinueWithEmail: "oder mit E-Mail fortfahren",
    passwordPlaceholder: "Dein Passwort",
    forgotPassword: "Passwort vergessen?",
    createAccount: "Konto erstellen",
    enterEmailAndPassword: "Gib deine E-Mail-Adresse und dein Passwort ein.",
    googleNoCode:
      "Die Google-Anmeldung hat keinen Code zurückgegeben. Bitte versuch es erneut.",
    signUpSubtitle: "Fang an, Python zu lernen – kostenlos, keine Karte nötig.",
    nameLabel: "Name",
    namePlaceholder: "Dein Name",
    passwordMinPlaceholder: "Mindestens 8 Zeichen",
    verifyCodeNote:
      "Wir senden dir einen 6-stelligen Code per E-Mail, um dein Konto zu bestätigen.",
    alreadyHaveAccount: "Du hast schon ein Konto?",
    enterName: "Gib deinen Namen ein.",
    passwordMin8: "Das Passwort muss mindestens 8 Zeichen lang sein.",
    otpSubtitle: (email: string, purpose: "signup" | "signin") =>
      `Wir haben einen 6-stelligen Code an ${email || "deine E-Mail-Adresse"} gesendet. Gib ihn unten ein, um ${
        purpose === "signup" ? "dein Konto zu bestätigen" : "dich anzumelden"
      }.`,
    verify: "Bestätigen",
    resendCodePrompt: "Keinen Code erhalten? Erneut senden",
    noEmailToVerify:
      "Keine E-Mail zu bestätigen. Geh zurück und versuch, dich erneut anzumelden.",
    noEmailToSendCodeTo: "Keine E-Mail-Adresse, an die ein Code gesendet werden kann.",
    newCodeSentTo: (email: string) => `Ein neuer Code wurde an ${email} gesendet.`,
    forgotPasswordTitle: "Passwort vergessen",
    forgotSubtitle:
      "Gib die E-Mail ein, mit der du dich registriert hast, und wir senden dir einen Link zum Zurücksetzen.",
    sendResetLink: "Link zum Zurücksetzen senden",
    resetLinkSentFor: (email: string) =>
      `Falls ein Konto für ${email} existiert, haben wir dorthin einen Link zum Zurücksetzen des Passworts gesendet.`,
    resetLinkNote:
      "Der Link öffnet die Website, wo du ein neues Passwort wählst. Komm dann hierher zurück und melde dich damit an.",
    twoFactorTitle: "Zwei-Faktor-Authentifizierung",
    twoFactorSubtitle:
      "Für dein Konto ist die Zwei-Faktor-Authentifizierung aktiviert. Gib den 6-stelligen Code aus deiner Authenticator-App ein – oder tippe auf „Erneut senden“, um stattdessen einen Code per E-Mail zu erhalten.",
    verifyAndSignIn: "Bestätigen und anmelden",
    resendCodeByEmail: "Code per E-Mail erneut senden",
    codeSentToEmail: "Ein Code wurde an deine E-Mail gesendet.",
  },
  settings: {
    signedInAs: (email: string) => `Angemeldet als ${email}`,
    appearance: "Darstellung",
    theme: "Design",
    themeDark: "Dunkel",
    themeLight: "Hell",
    darkIsDefault: "Dunkel ist die Standardeinstellung.",
    dailyGoal: "Tagesziel",
    minutesPerDay: "Lernminuten pro Tag",
    goalMinutes: (minutes: number) => `${minutes} Min.`,
    streak: "Serie",
    streakCount: (count: number) => `${count}-Tage-Serie`,
    streakExplainer:
      "Ein Tag zählt, wenn du eine Lektion abschließt oder ansiehst. Wenn deine Serie abbricht, kannst du sie innerhalb von 24 Stunden wiederherstellen – bis zu 3 Mal pro Monat.",
    restoresLeft: (n: number) =>
      `Wiederherstellungen in diesem Monat übrig: ${n} von 3.`,
    updates: "Updates",
    appUpdates: "App-Updates",
    updatesExplainer:
      "Neue Versionen erscheinen als GitHub-Releases. Die App prüft beim Start; du kannst auch hier prüfen.",
    checkForUpdates: "Nach Updates suchen",
    upToDate: "Du bist auf dem neuesten Stand.",
    couldntCheckUpdates:
      "Updates konnten nicht geprüft werden – versuch es später erneut.",
    account: "Konto",
    appVersion: (version: string) => `Learn Python · Version ${version}`,
    language: "Sprache",
    languageHint: "Gilt sofort für die gesamte App.",
  },
  update: {
    available: "Update verfügbar",
    versionLine: (version: string, size: string, mandatory: boolean) =>
      `Version ${version}${size ? ` · ${size}` : ""}${
        mandatory ? " · Erforderlich" : ""
      }`,
    sizeMB: (bytes: number) => `${(bytes / (1024 * 1024)).toFixed(1)} MB`,
    newVersionAvailable: "Eine neue Version von Learn Python ist verfügbar.",
    downloading: (percent: number) => `Wird heruntergeladen… ${percent} %`,
    openingInstaller: "Installationsprogramm wird geöffnet…",
    downloadFailed: "Das Update konnte nicht heruntergeladen werden.",
    downloadInterrupted: "Der Download wurde unterbrochen.",
    allowInstallsInSettings: "Installationen in den Einstellungen erlauben",
    update: "Aktualisieren",
    tryAgain: "Erneut versuchen",
    later: "Später",
    mandatoryHint:
      "Dieses Update ist erforderlich, um die App weiter zu nutzen.",
  },
};
