// Portuguese strings — UI chrome only. Content (lesson/video titles,
// course/creator names, notes, AI tutor answers, release notes) stays
// in English and is never passed through here.
import type { Strings } from "./index";

export const pt: Strings = {
  common: {
    appName: "Learn Python",
    signIn: "Entrar",
    signOut: "Sair",
    email: "E-mail",
    emailPlaceholder: "voce@exemplo.com",
    password: "Senha",
    showPassword: "Mostrar senha",
    hidePassword: "Ocultar senha",
    genericError: "Algo deu errado. Tente novamente.",
    enterEmailAddress: "Digite seu endereço de e-mail.",
    checkYourEmail: "Verifique seu e-mail",
    sixDigitCodeLabel: "Código de 6 dígitos",
    codePlaceholder: "123456",
    enterSixDigitCode: "Digite o código de 6 dígitos.",
    backToSignIn: "Voltar para o login",
    retry: "Tentar novamente",
    goBack: "Voltar",
    completed: "Concluído",
    watchedPct: (pct: number) => `Assistido ${pct}%`,
    notStarted: "Não iniciado",
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
      return h > 0 ? `${h}h ${m}min` : `${m}min`;
    },
    requestFailed: (status: number) => `Falha na solicitação (${status})`,
    send: "Enviar",
    roadmap: "Roteiro",
    settings: "Configurações",
    aiTutor: "Tutor de IA",
  },
  tabs: {
    learn: "Aprender",
    courses: "Cursos",
    editor: "Editor",
    profile: "Perfil",
  },
  nav: {
    verifyEmail: "Verificar e-mail",
    lesson: "Aula",
    course: "Curso",
  },
  learn: {
    loadError: "Não foi possível carregar as aulas.",
    greeting: (firstName: string) => `Olá, ${firstName}`,
    progressSummary: (totalDone: number) =>
      `100 dias de código · ${totalDone}/100 aulas concluídas`,
    streakChip: (n: number) =>
      n === 1 ? `Sequência: ${n} dia` : `Sequência: ${n} dias`,
    continueLabel: "Continue de onde parou",
    continueTitle: (day: number, lessonTitle: string) =>
      `Dia ${day} · ${lessonTitle}`,
    continueWatched: (pct: number, duration: string) =>
      `Assistido ${pct}% · ${duration}`,
    allCompleteTitle: "Todas as 100 aulas concluídas",
    allCompleteSubtitle: "Bom trabalho — revise qualquer aula abaixo.",
    sectionSubtitle: (from: number, to: number, done: number, total: number) =>
      `Dias ${from}–${to} · ${done}/${total} concluídas`,
    lessonDay: (n: number) => `Dia ${n}`,
    statusPlaying: (pct: number) => `Reproduzindo · ${pct}%`,
  },
  courses: {
    intro: "Cursos completos de Python em vídeo — escolha um criador para começar a assistir.",
    countPlaylists: (n: number) =>
      n === 1 ? `${n} playlist` : `${n} playlists`,
    countVideos: (n: number) => (n === 1 ? `${n} vídeo` : `${n} vídeos`),
    countOneShots: (n: number) =>
      n === 1 ? `${n} vídeo único` : `${n} vídeos únicos`,
  },
  editor: {
    title: "Editor de código",
    subtitle: "Execute Python aqui mesmo — o editor do site, dentro do app.",
    signInNotice:
      "Entre novamente dentro do editor para salvar seu código no GitHub — o editor tem seu próprio login, separado do app.",
    reload: "Recarregar editor",
    loading: "Carregando editor…",
  },
  profile: {
    signedOutSubtitle:
      "Aprenda Python, online ou offline. Entre para manter seu progresso, sua sequência e o tutor de IA neste dispositivo.",
    createAccountLink: "Novo por aqui? Criar uma conta",
    signedOutInfo:
      "As aulas são gratuitas para navegar sem entrar. Seu progresso fica neste dispositivo.",
    authBadge: (auth: "google" | "email") =>
      `Conectado com ${auth === "google" ? "Google" : "e-mail"}`,
    authBadgeMfa: " · 2FA ativada",
    statStreakLabel: "dias de sequência",
    statGoalLabel: "min / dia de meta",
    statLessonsLabel: "aulas concluídas",
    streakHint: "Conclua uma aula hoje para começar sua sequência.",
  },
  lesson: {
    notesEmpty: "Ainda não há notas para esta aula.",
    notesHeading: "Notas",
    tutorialSummary: "Resumo",
    tutorialPractice: "Prática",
    quizHeading: "Quiz",
    quizQuestionOf: (current: number, total: number) =>
      `Pergunta ${current} de ${total}`,
    quizScore: (correct: number, total: number) =>
      `Sua pontuação: ${correct}/${total} (${Math.round(
        (correct / total) * 100
      )} %)`,
    quizPassed: "✓ Teste aprovado",
    quizFailed: "Não foi desta vez — 70% ou mais para passar. Tente novamente.",
    quizRetake: "Refazer quiz",
    quizNext: "Próxima pergunta",
    quizSeeResult: "Ver resultado",
    notFound: "Aula não encontrada.",
    markComplete: "Marcar como concluída",
    completedButton: "✓ Concluída",
    askTutor: "Perguntar ao tutor de IA",
    saveOffline: "Salvar offline",
    downloading: "Baixando…",
    downloadingPct: (pct: number) => `Baixando ${pct}%`,
    removeDownload: "Remover download",
    downloadPaused: "Download pausado — toque novamente para tentar de novo.",
    downloadFailed: "Falha no download.",
    savedOffline: "Salvo offline",
    prevLesson: "← Anterior",
    nextLesson: "Próxima →",
  },
  course: {
    notFound: "Curso não encontrado.",
    closePlayer: "Fechar player",
    tapPlayToStart: "Toque em play para começar a assistir",
    markAsComplete: "Marcar como concluído",
    oneShotsHeading: "Vídeos únicos",
    playlistMeta: (count: number, totalDuration: string, done: number) =>
      `${count} vídeos · ${totalDuration} · ${done} concluídos`,
    oneShotsMeta: (count: number, totalDuration: string) =>
      `${count} vídeos · ${totalDuration}`,
    videoRowNumber: (n: number) => `${n}. `,
  },
  roadmap: {
    topicsComplete: (done: number, total: number) =>
      `${done} de ${total} tópicos concluídos`,
    stageTopicCount: (n: number) => (n === 1 ? `${n} tópico` : `${n} tópicos`),
    topicDone: "✓ Feito",
    topicLesson: "Aula",
    topicMeta: (difficulty: string, minutes: number) =>
      `${difficulty} · ${minutes} min`,
  },
  tutor: {
    modeTutor: "Tutor",
    modeExplain: "Explicar",
    modeDebug: "Depurar",
    modeQuiz: "Quiz",
    hintTutor: "Pergunte sobre a aula",
    hintExplain: "Cole o código e pergunte o que ele faz",
    hintDebug: "Cole o código com erro e pergunte o que está errado",
    hintQuiz: "Teste-se sobre a aula",
    hintLessonSuffix: (hint: string, lessonId: string) =>
      `${hint} · Aula ${lessonId}`,
    greetingLesson:
      "Pergunte-me qualquer coisa sobre esta aula — respondo com base no próprio vídeo.",
    greetingGeneral:
      "Pergunte-me qualquer coisa sobre Python. Escolha um modo acima para explicar código, depurá-lo ou testar-se com um quiz.",
    signInGateTitle: "Entre para usar o tutor de IA",
    signInGateText:
      "O tutor responde com base nos vídeos das aulas, e isso precisa da sua conta.",
    signInAgain: "Entrar novamente",
    errorSessionExpired: "Sua sessão expirou. Entre novamente para continuar conversando.",
    errorGeneric:
      "O tutor não conseguiu responder agora. Verifique sua conexão e tente novamente.",
    groundedBadge: "Com base no vídeo",
    citation: (citation: string) => `[${citation}]`,
    codePlaceholder: "Cole seu código aqui (opcional)",
    askPlaceholder: "Faça uma pergunta…",
  },
  auth: {
    welcomeBack: "Bem-vindo de volta",
    signInSubtitle: "Entre para continuar aprendendo Python.",
    continueWithGoogle: "Continuar com o Google",
    orContinueWithEmail: "ou continue com e-mail",
    passwordPlaceholder: "Sua senha",
    forgotPassword: "Esqueceu a senha?",
    createAccount: "Criar conta",
    enterEmailAndPassword: "Digite seu e-mail e senha.",
    googleNoCode: "O login com o Google não retornou um código. Tente novamente.",
    signUpSubtitle: "Comece a aprender Python — grátis, sem cartão.",
    nameLabel: "Nome",
    namePlaceholder: "Seu nome",
    passwordMinPlaceholder: "Pelo menos 8 caracteres",
    verifyCodeNote: "Enviaremos um código de 6 dígitos por e-mail para verificar sua conta.",
    alreadyHaveAccount: "Já tem uma conta?",
    enterName: "Digite seu nome.",
    passwordMin8: "A senha deve ter pelo menos 8 caracteres.",
    otpSubtitle: (email: string, purpose: "signup" | "signin") =>
      `Enviamos um código de 6 dígitos para ${email || "seu e-mail"}. Digite-o abaixo para ${
        purpose === "signup" ? "verificar sua conta" : "entrar"
      }.`,
    verify: "Verificar",
    resendCodePrompt: "Não recebeu o código? Reenviar",
    noEmailToVerify: "Nenhum e-mail para verificar. Volte e tente entrar novamente.",
    noEmailToSendCodeTo: "Nenhum e-mail para enviar o código.",
    newCodeSentTo: (email: string) => `Um novo código foi enviado para ${email}.`,
    forgotPasswordTitle: "Esqueceu a senha",
    forgotSubtitle:
      "Digite o e-mail com o qual você se cadastrou e enviaremos um link de redefinição.",
    sendResetLink: "Enviar link de redefinição",
    resetLinkSentFor: (email: string) =>
      `Se existir uma conta para ${email}, enviamos um link de redefinição de senha para lá.`,
    resetLinkNote:
      "O link abre o site, onde você escolhe uma nova senha. Depois volte aqui e entre com ela.",
    twoFactorTitle: "Autenticação em dois fatores",
    twoFactorSubtitle:
      "Sua conta tem autenticação em dois fatores ativada. Digite o código de 6 dígitos do seu app autenticador — ou toque em reenviar para receber um código por e-mail.",
    verifyAndSignIn: "Verificar e entrar",
    resendCodeByEmail: "Reenviar código por e-mail",
    codeSentToEmail: "Um código foi enviado para seu e-mail.",
  },
  settings: {
    signedInAs: (email: string) => `Conectado como ${email}`,
    appearance: "Aparência",
    theme: "Tema",
    themeDark: "Escuro",
    themeLight: "Claro",
    darkIsDefault: "O escuro é o padrão.",
    dailyGoal: "Meta diária",
    minutesPerDay: "Minutos de aprendizado por dia",
    goalMinutes: (minutes: number) => `${minutes} min`,
    streak: "Sequência",
    streakCount: (count: number) =>
      count === 1 ? `${count} dia de sequência` : `${count} dias de sequência`,
    streakExplainer:
      "Um dia conta quando você conclui ou assiste a uma aula. Se sua sequência quebrar, você pode restaurá-la em até 24 horas — até 3 vezes por mês.",
    restoresLeft: (n: number) => `Restaurações restantes neste mês: ${n} de 3.`,
    updates: "Atualizações",
    appUpdates: "Atualizações do app",
    updatesExplainer:
      "Novas versões chegam como lançamentos no GitHub. O app verifica ao iniciar; você também pode verificar aqui.",
    checkForUpdates: "Verificar atualizações",
    upToDate: "Você está atualizado.",
    couldntCheckUpdates: "Não foi possível verificar atualizações — tente novamente mais tarde.",
    account: "Conta",
    appVersion: (version: string) => `Learn Python · versão ${version}`,
    language: "Idioma",
    languageHint: "Aplica-se a todo o app imediatamente.",
  },
  update: {
    available: "Atualização disponível",
    versionLine: (version: string, size: string, mandatory: boolean) =>
      `Versão ${version}${size ? ` · ${size}` : ""}${
        mandatory ? " · Obrigatória" : ""
      }`,
    sizeMB: (bytes: number) => `${(bytes / (1024 * 1024)).toFixed(1)} MB`,
    newVersionAvailable: "Uma nova versão do Learn Python está disponível.",
    downloading: (percent: number) => `Baixando… ${percent}%`,
    openingInstaller: "Abrindo o instalador…",
    downloadFailed: "Não foi possível baixar a atualização.",
    downloadInterrupted: "O download foi interrompido.",
    allowInstallsInSettings: "Permitir instalações nas configurações",
    update: "Atualizar",
    tryAgain: "Tentar novamente",
    later: "Depois",
    mandatoryHint: "Esta atualização é obrigatória para continuar usando o app.",
  },
};
