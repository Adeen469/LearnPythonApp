// Spanish strings — UI chrome only (see en.ts for scope).
import type { Strings } from "./index";

export const es: Strings = {
  common: {
    appName: "Learn Python",
    signIn: "Iniciar sesión",
    signOut: "Cerrar sesión",
    email: "Correo electrónico",
    emailPlaceholder: "you@example.com",
    password: "Contraseña",
    showPassword: "Mostrar contraseña",
    hidePassword: "Ocultar contraseña",
    genericError: "Algo salió mal. Inténtalo de nuevo.",
    enterEmailAddress: "Introduce tu correo electrónico.",
    checkYourEmail: "Revisa tu correo",
    sixDigitCodeLabel: "Código de 6 dígitos",
    codePlaceholder: "123456",
    enterSixDigitCode: "Introduce el código de 6 dígitos.",
    backToSignIn: "Volver a iniciar sesión",
    retry: "Reintentar",
    goBack: "Atrás",
    completed: "Completado",
    watchedPct: (pct: number) => `Visto el ${pct}%`,
    notStarted: "Sin empezar",
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
    requestFailed: (status: number) => `La solicitud falló (${status})`,
    send: "Enviar",
    roadmap: "Ruta de aprendizaje",
    settings: "Ajustes",
    aiTutor: "Tutor de IA",
  },
  tabs: {
    learn: "Aprender",
    courses: "Cursos",
    editor: "Editor",
    profile: "Perfil",
  },
  nav: {
    verifyEmail: "Verificar correo",
    lesson: "Lección",
    course: "Curso",
  },
  learn: {
    loadError: "No se pudieron cargar las lecciones.",
    greeting: (firstName: string) => `Hola, ${firstName}`,
    progressSummary: (totalDone: number) =>
      `100 días de código · ${totalDone}/100 lecciones completadas`,
    streakChip: (n: number) =>
      n === 1 ? `Racha: ${n} día` : `Racha: ${n} días`,
    continueLabel: "Continúa donde lo dejaste",
    continueTitle: (day: number, lessonTitle: string) =>
      `Día ${day} · ${lessonTitle}`,
    continueWatched: (pct: number, duration: string) =>
      `Visto el ${pct}% · ${duration}`,
    allCompleteTitle: "Las 100 lecciones están completas",
    allCompleteSubtitle: "Buen trabajo: repasa cualquier lección abajo.",
    sectionSubtitle: (from: number, to: number, done: number, total: number) =>
      `Días ${from}–${to} · ${done}/${total} completadas`,
    lessonDay: (n: number) => `Día ${n}`,
    statusPlaying: (pct: number) => `Reproduciendo · ${pct}%`,
  },
  courses: {
    intro:
      "Cursos completos de Python en vídeo: elige un creador para empezar a ver.",
    countPlaylists: (n: number) =>
      n === 1 ? `${n} lista de reproducción` : `${n} listas de reproducción`,
    countVideos: (n: number) => (n === 1 ? `${n} vídeo` : `${n} vídeos`),
    countOneShots: (n: number) =>
      n === 1 ? `${n} vídeo único` : `${n} vídeos únicos`,
  },
  editor: {
    title: "Editor de código",
    subtitle: "Ejecuta Python aquí mismo: el editor del sitio web, en la app.",
    signInNotice:
      "Vuelve a iniciar sesión dentro del editor para guardar tu código en GitHub: el editor tiene su propio inicio de sesión, independiente de la app.",
    reload: "Recargar el editor",
    loading: "Cargando el editor…",
  },
  profile: {
    signedOutSubtitle:
      "Learn Python, en línea o sin conexión. Inicia sesión para mantener tu progreso, tu racha y tu tutor de IA en este dispositivo.",
    createAccountLink: "¿Eres nuevo? Crea una cuenta",
    signedOutInfo:
      "Las lecciones se pueden explorar gratis sin iniciar sesión. Tu progreso se queda en este dispositivo.",
    authBadge: (auth: "google" | "email") =>
      `Sesión iniciada con ${auth === "google" ? "Google" : "correo electrónico"}`,
    authBadgeMfa: " · 2FA activada",
    statStreakLabel: "días de racha",
    statGoalLabel: "min / día de objetivo",
    statLessonsLabel: "lecciones completadas",
    streakHint: "Completa una lección hoy para empezar tu racha.",
  },
  lesson: {
    notesEmpty: "Aún no hay notas para esta lección.",
    notesHeading: "Notas",
    tutorialSummary: "Resumen",
    tutorialPractice: "Práctica",
    quizHeading: "Cuestionario",
    quizQuestionOf: (current: number, total: number) =>
      `Pregunta ${current} de ${total}`,
    quizScore: (correct: number, total: number) =>
      `Tu puntuación: ${correct}/${total} (${Math.round(
        (correct / total) * 100
      )} %)`,
    quizPassed: "✓ Prueba superada",
    quizFailed: "Casi: necesitas el 70 % o más para aprobar. Inténtalo de nuevo.",
    quizRetake: "Repetir el cuestionario",
    quizNext: "Siguiente pregunta",
    quizSeeResult: "Ver el resultado",
    notFound: "Lección no encontrada.",
    markComplete: "Marcar como completada",
    completedButton: "✓ Completada",
    askTutor: "Preguntar al tutor de IA",
    saveOffline: "Guardar sin conexión",
    downloading: "Descargando…",
    downloadingPct: (pct: number) => `Descargando ${pct}%`,
    removeDownload: "Eliminar descarga",
    downloadPaused: "Descarga en pausa: toca de nuevo para reintentarlo.",
    downloadFailed: "La descarga falló.",
    savedOffline: "Guardado sin conexión",
    prevLesson: "← Anterior",
    nextLesson: "Siguiente →",
  },
  course: {
    notFound: "Curso no encontrado.",
    closePlayer: "Cerrar el reproductor",
    tapPlayToStart: "Toca reproducir para empezar a ver",
    markAsComplete: "Marcar como completado",
    oneShotsHeading: "Vídeos únicos",
    playlistMeta: (count: number, totalDuration: string, done: number) =>
      `${count} vídeos · ${totalDuration} · ${done} completados`,
    oneShotsMeta: (count: number, totalDuration: string) =>
      `${count} vídeos · ${totalDuration}`,
    videoRowNumber: (n: number) => `${n}. `,
  },
  roadmap: {
    topicsComplete: (done: number, total: number) =>
      `${done} de ${total} temas completados`,
    stageTopicCount: (n: number) => (n === 1 ? `${n} tema` : `${n} temas`),
    topicDone: "✓ Hecho",
    topicLesson: "Lección",
    topicMeta: (difficulty: string, minutes: number) =>
      `${difficulty} · ${minutes} min`,
  },
  tutor: {
    modeTutor: "Tutor",
    modeExplain: "Explicar",
    modeDebug: "Depurar",
    modeQuiz: "Cuestionario",
    hintTutor: "Pregunta sobre la lección",
    hintExplain: "Pega código y pregunta qué hace",
    hintDebug: "Pega código con errores y pregunta qué está mal",
    hintQuiz: "Ponte a prueba sobre la lección",
    hintLessonSuffix: (hint: string, lessonId: string) =>
      `${hint} · Lección ${lessonId}`,
    greetingLesson:
      "Pregúntame lo que quieras sobre esta lección: respondo a partir del propio vídeo.",
    greetingGeneral:
      "Pregúntame lo que quieras sobre Python. Elige un modo arriba para explicar código, depurarlo o ponerte a prueba.",
    signInGateTitle: "Inicia sesión para usar el tutor de IA",
    signInGateText:
      "El tutor responde a partir de los vídeos de las lecciones, y eso necesita tu cuenta.",
    signInAgain: "Volver a iniciar sesión",
    errorSessionExpired:
      "Tu sesión caducó. Inicia sesión de nuevo para seguir chateando.",
    errorGeneric:
      "El tutor no puede responder ahora mismo. Revisa tu conexión e inténtalo de nuevo.",
    groundedBadge: "Basado en el vídeo",
    citation: (citation: string) => `[${citation}]`,
    codePlaceholder: "Pega tu código aquí (opcional)",
    askPlaceholder: "Haz una pregunta…",
  },
  auth: {
    welcomeBack: "Te damos la bienvenida de nuevo",
    signInSubtitle: "Inicia sesión para seguir aprendiendo Python.",
    continueWithGoogle: "Continuar con Google",
    orContinueWithEmail: "o continúa con tu correo",
    passwordPlaceholder: "Tu contraseña",
    forgotPassword: "¿Olvidaste tu contraseña?",
    createAccount: "Crear cuenta",
    enterEmailAndPassword: "Introduce tu correo electrónico y tu contraseña.",
    googleNoCode:
      "El inicio de sesión con Google no devolvió un código. Inténtalo de nuevo.",
    signUpSubtitle: "Empieza a aprender Python: gratis, sin tarjeta.",
    nameLabel: "Nombre",
    namePlaceholder: "Tu nombre",
    passwordMinPlaceholder: "Al menos 8 caracteres",
    verifyCodeNote:
      "Te enviaremos un código de 6 dígitos por correo para verificar tu cuenta.",
    alreadyHaveAccount: "¿Ya tienes cuenta?",
    enterName: "Introduce tu nombre.",
    passwordMin8: "La contraseña debe tener al menos 8 caracteres.",
    otpSubtitle: (email: string, purpose: "signup" | "signin") =>
      `Te enviamos un código de 6 dígitos a ${email || "tu correo electrónico"}. Introdúcelo abajo para ${
        purpose === "signup" ? "verificar tu cuenta" : "iniciar sesión"
      }.`,
    verify: "Verificar",
    resendCodePrompt: "¿No recibiste el código? Reenviar",
    noEmailToVerify:
      "No hay correo que verificar. Vuelve atrás e inténtalo de nuevo.",
    noEmailToSendCodeTo: "No hay correo al que enviar un código.",
    newCodeSentTo: (email: string) => `Se envió un nuevo código a ${email}.`,
    forgotPasswordTitle: "Contraseña olvidada",
    forgotSubtitle:
      "Introduce el correo con el que te registraste y te enviaremos un enlace para restablecerla.",
    sendResetLink: "Enviar enlace de restablecimiento",
    resetLinkSentFor: (email: string) =>
      `Si existe una cuenta para ${email}, le enviamos un enlace para restablecer la contraseña.`,
    resetLinkNote:
      "El enlace abre el sitio web, donde eliges una nueva contraseña. Luego vuelve aquí e inicia sesión con ella.",
    twoFactorTitle: "Autenticación en dos pasos",
    twoFactorSubtitle:
      "Tu cuenta tiene activada la autenticación en dos pasos. Introduce el código de 6 dígitos de tu app de autenticación, o toca Reenviar para recibir un código por correo.",
    verifyAndSignIn: "Verificar e iniciar sesión",
    resendCodeByEmail: "Reenviar el código por correo",
    codeSentToEmail: "Se envió un código a tu correo.",
  },
  settings: {
    signedInAs: (email: string) => `Sesión iniciada como ${email}`,
    appearance: "Apariencia",
    theme: "Tema",
    themeDark: "Oscuro",
    themeLight: "Claro",
    darkIsDefault: "El tema oscuro es el predeterminado.",
    dailyGoal: "Objetivo diario",
    minutesPerDay: "Minutos de aprendizaje al día",
    goalMinutes: (minutes: number) => `${minutes} min`,
    streak: "Racha",
    streakCount: (count: number) => `Racha de ${count} días`,
    streakExplainer:
      "Un día cuenta cuando completas o ves una lección. Si tu racha se rompe, puedes restaurarla en 24 horas, hasta 3 veces al mes.",
    restoresLeft: (n: number) => `Restauraciones restantes este mes: ${n} de 3.`,
    updates: "Actualizaciones",
    appUpdates: "Actualizaciones de la app",
    updatesExplainer:
      "Las nuevas versiones llegan como lanzamientos de GitHub. La app comprueba al iniciar; también puedes comprobarlo aquí.",
    checkForUpdates: "Buscar actualizaciones",
    upToDate: "Estás al día.",
    couldntCheckUpdates:
      "No se pudo comprobar si hay actualizaciones; inténtalo más tarde.",
    account: "Cuenta",
    appVersion: (version: string) => `Learn Python · versión ${version}`,
    language: "Idioma",
    languageHint: "Se aplica a toda la app de inmediato.",
  },
  update: {
    available: "Actualización disponible",
    versionLine: (version: string, size: string, mandatory: boolean) =>
      `Versión ${version}${size ? ` · ${size}` : ""}${
        mandatory ? " · Obligatoria" : ""
      }`,
    sizeMB: (bytes: number) => `${(bytes / (1024 * 1024)).toFixed(1)} MB`,
    newVersionAvailable: "Hay una nueva versión de Learn Python disponible.",
    downloading: (percent: number) => `Descargando… ${percent}%`,
    openingInstaller: "Abriendo el instalador…",
    downloadFailed: "No se pudo descargar la actualización.",
    downloadInterrupted: "La descarga se interrumpió.",
    allowInstallsInSettings: "Permitir instalaciones en los ajustes",
    update: "Actualizar",
    tryAgain: "Intentar de nuevo",
    later: "Más tarde",
    mandatoryHint: "Esta actualización es necesaria para seguir usando la app.",
  },
};
