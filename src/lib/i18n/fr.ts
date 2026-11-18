// French strings — UI chrome only (see en.ts for scope).
import type { Strings } from "./index";

export const fr: Strings = {
  common: {
    appName: "Learn Python",
    signIn: "Se connecter",
    signOut: "Se déconnecter",
    email: "E-mail",
    emailPlaceholder: "you@example.com",
    password: "Mot de passe",
    showPassword: "Afficher le mot de passe",
    hidePassword: "Masquer le mot de passe",
    genericError: "Une erreur est survenue. Veuillez réessayer.",
    enterEmailAddress: "Saisissez votre adresse e-mail.",
    checkYourEmail: "Vérifiez votre e-mail",
    sixDigitCodeLabel: "Code à 6 chiffres",
    codePlaceholder: "123456",
    enterSixDigitCode: "Saisissez le code à 6 chiffres.",
    backToSignIn: "Retour à la connexion",
    retry: "Réessayer",
    goBack: "Retour",
    completed: "Terminé",
    watchedPct: (pct: number) => `Regardé ${pct} %`,
    notStarted: "Pas commencé",
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
    requestFailed: (status: number) => `Échec de la requête (${status})`,
    send: "Envoyer",
    roadmap: "Parcours",
    settings: "Réglages",
    aiTutor: "Tuteur IA",
  },
  tabs: {
    learn: "Apprendre",
    courses: "Cours",
    editor: "Éditeur",
    profile: "Profil",
  },
  nav: {
    verifyEmail: "Vérifier l'e-mail",
    lesson: "Leçon",
    course: "Cours",
  },
  learn: {
    loadError: "Impossible de charger les leçons.",
    greeting: (firstName: string) => `Bonjour, ${firstName}`,
    progressSummary: (totalDone: number) =>
      `100 jours de code · ${totalDone}/100 leçons terminées`,
    streakChip: (n: number) =>
      n === 1 ? `Série : ${n} jour` : `Série : ${n} jours`,
    continueLabel: "Reprendre là où vous vous étiez arrêté",
    continueTitle: (day: number, lessonTitle: string) =>
      `Jour ${day} · ${lessonTitle}`,
    continueWatched: (pct: number, duration: string) =>
      `Regardé ${pct} % · ${duration}`,
    allCompleteTitle: "Les 100 leçons sont terminées",
    allCompleteSubtitle: "Beau travail — revisitez n'importe quelle leçon ci-dessous.",
    sectionSubtitle: (from: number, to: number, done: number, total: number) =>
      `Jours ${from}–${to} · ${done}/${total} terminées`,
    lessonDay: (n: number) => `Jour ${n}`,
    statusPlaying: (pct: number) => `Lecture · ${pct} %`,
  },
  courses: {
    intro:
      "Des cours vidéo Python complets — choisissez un créateur pour commencer à regarder.",
    countPlaylists: (n: number) =>
      n === 1 ? `${n} playlist` : `${n} playlists`,
    countVideos: (n: number) => (n === 1 ? `${n} vidéo` : `${n} vidéos`),
    countOneShots: (n: number) =>
      n === 1 ? `${n} vidéo unique` : `${n} vidéos uniques`,
  },
  editor: {
    title: "Éditeur de code",
    subtitle: "Exécutez Python ici même — l'éditeur du site web, dans l'application.",
    signInNotice:
      "Reconnectez-vous dans l'éditeur pour enregistrer votre code sur GitHub — l'éditeur a sa propre connexion, distincte de celle de l'application.",
    reload: "Recharger l'éditeur",
    loading: "Chargement de l'éditeur…",
  },
  profile: {
    signedOutSubtitle:
      "Learn Python, en ligne ou hors ligne. Connectez-vous pour conserver votre progression, votre série et votre tuteur IA sur cet appareil.",
    createAccountLink: "Nouveau ici ? Créer un compte",
    signedOutInfo:
      "Les leçons sont gratuites à parcourir sans connexion. Votre progression reste sur cet appareil.",
    authBadge: (auth: "google" | "email") =>
      `Connecté avec ${auth === "google" ? "Google" : "l'e-mail"}`,
    authBadgeMfa: " · 2FA activée",
    statStreakLabel: "jours de série",
    statGoalLabel: "min / jour d'objectif",
    statLessonsLabel: "leçons terminées",
    streakHint: "Terminez une leçon aujourd'hui pour lancer votre série.",
  },
  lesson: {
    notesEmpty: "Aucune note pour cette leçon pour l'instant.",
    notesHeading: "Notes",
    tutorialSummary: "Summary",
    tutorialPractice: "Practice",
    quizHeading: "Quiz",
    quizQuestionOf: (current: number, total: number) =>
      `Question ${current} sur ${total}`,
    quizScore: (correct: number, total: number) =>
      `Votre score : ${correct}/${total} (${Math.round(
        (correct / total) * 100
      )} %)`,
    quizPassed: "✓ Test réussi",
    quizFailed: "Pas tout à fait — 70 % ou plus pour réussir. Réessayez.",
    quizRetake: "Refaire le quiz",
    quizNext: "Question suivante",
    quizSeeResult: "Voir le résultat",
    notFound: "Leçon introuvable.",
    markComplete: "Marquer comme terminée",
    completedButton: "✓ Terminée",
    askTutor: "Demander au tuteur IA",
    saveOffline: "Enregistrer hors ligne",
    downloading: "Téléchargement…",
    downloadingPct: (pct: number) => `Téléchargement ${pct} %`,
    removeDownload: "Supprimer le téléchargement",
    downloadPaused: "Téléchargement en pause — touchez à nouveau pour réessayer.",
    downloadFailed: "Échec du téléchargement.",
    savedOffline: "Enregistré hors ligne",
    prevLesson: "← Préc.",
    nextLesson: "Suiv. →",
  },
  course: {
    notFound: "Cours introuvable.",
    closePlayer: "Fermer le lecteur",
    tapPlayToStart: "Touchez Lecture pour commencer à regarder",
    markAsComplete: "Marquer comme terminé",
    oneShotsHeading: "Vidéos uniques",
    playlistMeta: (count: number, totalDuration: string, done: number) =>
      `${count} vidéos · ${totalDuration} · ${done} terminées`,
    oneShotsMeta: (count: number, totalDuration: string) =>
      `${count} vidéos · ${totalDuration}`,
    videoRowNumber: (n: number) => `${n}. `,
  },
  roadmap: {
    topicsComplete: (done: number, total: number) =>
      `${done} sujets sur ${total} terminés`,
    stageTopicCount: (n: number) => (n === 1 ? `${n} sujet` : `${n} sujets`),
    topicDone: "✓ Fait",
    topicLesson: "Leçon",
    topicMeta: (difficulty: string, minutes: number) =>
      `${difficulty} · ${minutes} min`,
  },
  tutor: {
    modeTutor: "Tuteur",
    modeExplain: "Expliquer",
    modeDebug: "Déboguer",
    modeQuiz: "Quiz",
    hintTutor: "Posez une question sur la leçon",
    hintExplain: "Collez du code et demandez ce qu'il fait",
    hintDebug: "Collez du code défectueux et demandez ce qui ne va pas",
    hintQuiz: "Testez-vous sur la leçon",
    hintLessonSuffix: (hint: string, lessonId: string) =>
      `${hint} · Leçon ${lessonId}`,
    greetingLesson:
      "Posez-moi n'importe quelle question sur cette leçon — je réponds à partir de la vidéo elle-même.",
    greetingGeneral:
      "Posez-moi n'importe quelle question sur Python. Choisissez un mode ci-dessus pour expliquer du code, le déboguer ou vous tester.",
    signInGateTitle: "Connectez-vous pour utiliser le tuteur IA",
    signInGateText:
      "Le tuteur répond à partir des vidéos des leçons, et cela nécessite votre compte.",
    signInAgain: "Se reconnecter",
    errorSessionExpired:
      "Votre session a expiré. Reconnectez-vous pour continuer à discuter.",
    errorGeneric:
      "Le tuteur ne peut pas répondre pour le moment. Vérifiez votre connexion et réessayez.",
    groundedBadge: "Basé sur la vidéo",
    citation: (citation: string) => `[${citation}]`,
    codePlaceholder: "Collez votre code ici (facultatif)",
    askPlaceholder: "Posez une question…",
  },
  auth: {
    welcomeBack: "Bon retour",
    signInSubtitle: "Connectez-vous pour continuer à apprendre Python.",
    continueWithGoogle: "Continuer avec Google",
    orContinueWithEmail: "ou continuer avec l'e-mail",
    passwordPlaceholder: "Votre mot de passe",
    forgotPassword: "Mot de passe oublié ?",
    createAccount: "Créer un compte",
    enterEmailAndPassword: "Saisissez votre e-mail et votre mot de passe.",
    googleNoCode:
      "La connexion Google n'a pas renvoyé de code. Veuillez réessayer.",
    signUpSubtitle:
      "Commencez à apprendre Python — gratuit, sans carte bancaire.",
    nameLabel: "Nom",
    namePlaceholder: "Votre nom",
    passwordMinPlaceholder: "Au moins 8 caractères",
    verifyCodeNote:
      "Nous vous enverrons un code à 6 chiffres par e-mail pour vérifier votre compte.",
    alreadyHaveAccount: "Vous avez déjà un compte ?",
    enterName: "Saisissez votre nom.",
    passwordMin8: "Le mot de passe doit contenir au moins 8 caractères.",
    otpSubtitle: (email: string, purpose: "signup" | "signin") =>
      `Nous avons envoyé un code à 6 chiffres à ${email || "votre adresse e-mail"}. Saisissez-le ci-dessous pour ${
        purpose === "signup" ? "vérifier votre compte" : "vous connecter"
      }.`,
    verify: "Vérifier",
    resendCodePrompt: "Pas de code reçu ? Renvoyer",
    noEmailToVerify:
      "Aucun e-mail à vérifier. Revenez en arrière et réessayez de vous connecter.",
    noEmailToSendCodeTo: "Aucun e-mail auquel envoyer un code.",
    newCodeSentTo: (email: string) => `Un nouveau code a été envoyé à ${email}.`,
    forgotPasswordTitle: "Mot de passe oublié",
    forgotSubtitle:
      "Saisissez l'e-mail utilisé lors de l'inscription et nous vous enverrons un lien de réinitialisation.",
    sendResetLink: "Envoyer le lien de réinitialisation",
    resetLinkSentFor: (email: string) =>
      `Si un compte existe pour ${email}, nous y avons envoyé un lien de réinitialisation du mot de passe.`,
    resetLinkNote:
      "Le lien ouvre le site web, où vous choisissez un nouveau mot de passe. Revenez ensuite ici et connectez-vous avec.",
    twoFactorTitle: "Authentification à deux facteurs",
    twoFactorSubtitle:
      "Votre compte a l'authentification à deux facteurs activée. Saisissez le code à 6 chiffres de votre application d'authentification — ou touchez Renvoyer pour recevoir un code par e-mail.",
    verifyAndSignIn: "Vérifier et se connecter",
    resendCodeByEmail: "Renvoyer le code par e-mail",
    codeSentToEmail: "Un code a été envoyé à votre e-mail.",
  },
  settings: {
    signedInAs: (email: string) => `Connecté en tant que ${email}`,
    appearance: "Apparence",
    theme: "Thème",
    themeDark: "Sombre",
    themeLight: "Clair",
    darkIsDefault: "Le thème sombre est celui par défaut.",
    dailyGoal: "Objectif quotidien",
    minutesPerDay: "Minutes d'apprentissage par jour",
    goalMinutes: (minutes: number) => `${minutes} min`,
    streak: "Série",
    streakCount: (count: number) => `${count} jours de série`,
    streakExplainer:
      "Un jour compte lorsque vous terminez ou regardez une leçon. Si votre série s'interrompt, vous pouvez la restaurer sous 24 heures — jusqu'à 3 fois par mois.",
    restoresLeft: (n: number) => `Restaurations restantes ce mois-ci : ${n} sur 3.`,
    updates: "Mises à jour",
    appUpdates: "Mises à jour de l'application",
    updatesExplainer:
      "Les nouvelles versions arrivent sous forme de versions GitHub. L'application vérifie au lancement ; vous pouvez aussi vérifier ici.",
    checkForUpdates: "Rechercher des mises à jour",
    upToDate: "Vous êtes à jour.",
    couldntCheckUpdates:
      "Impossible de vérifier les mises à jour — réessayez plus tard.",
    account: "Compte",
    appVersion: (version: string) => `Learn Python · version ${version}`,
    language: "Langue",
    languageHint: "S'applique à toute l'application immédiatement.",
  },
  update: {
    available: "Mise à jour disponible",
    versionLine: (version: string, size: string, mandatory: boolean) =>
      `Version ${version}${size ? ` · ${size}` : ""}${
        mandatory ? " · Obligatoire" : ""
      }`,
    sizeMB: (bytes: number) => `${(bytes / (1024 * 1024)).toFixed(1)} Mo`,
    newVersionAvailable: "Une nouvelle version de Learn Python est disponible.",
    downloading: (percent: number) => `Téléchargement… ${percent} %`,
    openingInstaller: "Ouverture du programme d'installation…",
    downloadFailed: "La mise à jour n'a pas pu être téléchargée.",
    downloadInterrupted: "Le téléchargement a été interrompu.",
    allowInstallsInSettings: "Autoriser les installations dans les réglages",
    update: "Mettre à jour",
    tryAgain: "Réessayer",
    later: "Plus tard",
    mandatoryHint:
      "Cette mise à jour est obligatoire pour continuer à utiliser l'application.",
  },
};
