// Russian strings — UI chrome only. Content (lesson/video titles,
// course/creator names, notes, AI tutor answers, release notes) stays
// in English and is never passed through here.
import type { Strings } from "./index";

// Russian plural: 1 день, 2–4 дня, 5–20 дней, 21 день, 22–24 дня, …
function plural(n: number, one: string, few: string, many: string): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
  return many;
}

export const ru: Strings = {
  common: {
    appName: "Learn Python",
    signIn: "Войти",
    signOut: "Выйти",
    email: "Эл. почта",
    emailPlaceholder: "you@example.com",
    password: "Пароль",
    showPassword: "Показать пароль",
    hidePassword: "Скрыть пароль",
    genericError: "Что-то пошло не так. Попробуйте ещё раз.",
    enterEmailAddress: "Введите адрес электронной почты.",
    checkYourEmail: "Проверьте почту",
    sixDigitCodeLabel: "6-значный код",
    codePlaceholder: "123456",
    enterSixDigitCode: "Введите 6-значный код.",
    backToSignIn: "Назад ко входу",
    retry: "Повторить",
    goBack: "Назад",
    completed: "Завершено",
    watchedPct: (pct: number) => `Просмотрено ${pct}%`,
    notStarted: "Не начато",
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
      return h > 0 ? `${h} ч ${m} мин` : `${m} мин`;
    },
    requestFailed: (status: number) => `Ошибка запроса (${status})`,
    send: "Отправить",
    roadmap: "План обучения",
    settings: "Настройки",
    aiTutor: "ИИ-репетитор",
  },
  tabs: {
    learn: "Обучение",
    courses: "Курсы",
    editor: "Редактор",
    profile: "Профиль",
  },
  nav: {
    verifyEmail: "Подтверждение почты",
    lesson: "Урок",
    course: "Курс",
  },
  learn: {
    loadError: "Не удалось загрузить уроки.",
    greeting: (firstName: string) => `Привет, ${firstName}`,
    progressSummary: (totalDone: number) =>
      `100 дней кода · ${totalDone}/100 уроков пройдено`,
    streakChip: (n: number) =>
      `Серия: ${n} ${plural(n, "день", "дня", "дней")}`,
    continueLabel: "Продолжить с того места, где остановились",
    continueTitle: (day: number, lessonTitle: string) =>
      `День ${day} · ${lessonTitle}`,
    continueWatched: (pct: number, duration: string) =>
      `Просмотрено ${pct}% · ${duration}`,
    allCompleteTitle: "Все 100 уроков пройдены",
    allCompleteSubtitle: "Отличная работа — пересмотрите любой урок ниже.",
    sectionSubtitle: (from: number, to: number, done: number, total: number) =>
      `Дни ${from}–${to} · ${done}/${total} пройдено`,
    lessonDay: (n: number) => `День ${n}`,
    statusPlaying: (pct: number) => `Воспроизведение · ${pct}%`,
  },
  courses: {
    intro: "Полные видеокурсы по Python — выберите автора, чтобы начать смотреть.",
    countPlaylists: (n: number) =>
      `${n} ${plural(n, "плейлист", "плейлиста", "плейлистов")}`,
    countVideos: (n: number) => `${n} видео`,
    countOneShots: (n: number) =>
      `${n} ${plural(n, "отдельный ролик", "отдельных ролика", "отдельных роликов")}`,
  },
  editor: {
    title: "Редактор кода",
    subtitle: "Запускайте Python прямо здесь — редактор с сайта, в приложении.",
    signInNotice:
      "Войдите ещё раз внутри редактора, чтобы сохранять код на GitHub — у редактора свой вход, отдельный от приложения.",
    reload: "Перезагрузить редактор",
    loading: "Загрузка редактора…",
  },
  profile: {
    signedOutSubtitle:
      "Учите Python онлайн или офлайн. Войдите, чтобы сохранить прогресс, серию и ИИ-репетитора на этом устройстве.",
    createAccountLink: "Впервые здесь? Создать аккаунт",
    signedOutInfo:
      "Уроки можно бесплатно просматривать без входа. Прогресс хранится на этом устройстве.",
    authBadge: (auth: "google" | "email") =>
      `Вы вошли через ${auth === "google" ? "Google" : "электронную почту"}`,
    authBadgeMfa: " · 2FA включена",
    statStreakLabel: "дней серии",
    statGoalLabel: "мин / день — цель",
    statLessonsLabel: "уроков пройдено",
    streakHint: "Пройдите сегодня урок, чтобы начать серию.",
  },
  lesson: {
    notesEmpty: "Для этого урока пока нет заметок.",
    notesHeading: "Заметки",
    tutorialSummary: "Summary",
    tutorialPractice: "Practice",
    quizHeading: "Тест",
    quizQuestionOf: (current: number, total: number) =>
      `Вопрос ${current} из ${total}`,
    quizScore: (correct: number, total: number) =>
      `Ваш результат: ${correct}/${total} (${Math.round(
        (correct / total) * 100
      )} %)`,
    quizPassed: "✓ Тест пройден",
    quizFailed: "Почти — для прохождения нужно 70% или больше. Попробуйте ещё раз.",
    quizRetake: "Пройти тест заново",
    quizNext: "Следующий вопрос",
    quizSeeResult: "Показать результат",
    notFound: "Урок не найден.",
    markComplete: "Отметить как пройденный",
    completedButton: "✓ Пройдено",
    askTutor: "Спросить ИИ-репетитора",
    saveOffline: "Сохранить офлайн",
    downloading: "Загрузка…",
    downloadingPct: (pct: number) => `Загрузка ${pct}%`,
    removeDownload: "Удалить загрузку",
    downloadPaused: "Загрузка приостановлена — нажмите ещё раз, чтобы повторить.",
    downloadFailed: "Не удалось загрузить.",
    savedOffline: "Сохранено офлайн",
    prevLesson: "← Назад",
    nextLesson: "Далее →",
  },
  course: {
    notFound: "Курс не найден.",
    closePlayer: "Закрыть плеер",
    tapPlayToStart: "Нажмите «Play», чтобы начать просмотр",
    markAsComplete: "Отметить как просмотренное",
    oneShotsHeading: "Отдельные ролики",
    playlistMeta: (count: number, totalDuration: string, done: number) =>
      `${count} видео · ${totalDuration} · ${done} пройдено`,
    oneShotsMeta: (count: number, totalDuration: string) =>
      `${count} видео · ${totalDuration}`,
    videoRowNumber: (n: number) => `${n}. `,
  },
  roadmap: {
    topicsComplete: (done: number, total: number) =>
      `${done} из ${total} тем пройдено`,
    stageTopicCount: (n: number) =>
      `${n} ${plural(n, "тема", "темы", "тем")}`,
    topicDone: "✓ Готово",
    topicLesson: "Урок",
    topicMeta: (difficulty: string, minutes: number) =>
      `${difficulty} · ${minutes} мин`,
  },
  tutor: {
    modeTutor: "Репетитор",
    modeExplain: "Объяснить",
    modeDebug: "Отладка",
    modeQuiz: "Тест",
    hintTutor: "Спросите об уроке",
    hintExplain: "Вставьте код и спросите, что он делает",
    hintDebug: "Вставьте неработающий код и спросите, что не так",
    hintQuiz: "Проверьте себя по уроку",
    hintLessonSuffix: (hint: string, lessonId: string) =>
      `${hint} · Урок ${lessonId}`,
    greetingLesson:
      "Спросите меня о чём угодно по этому уроку — я отвечаю на основе самого видео.",
    greetingGeneral:
      "Спросите меня о чём угодно про Python. Выберите режим выше, чтобы объяснить код, отладить его или проверить себя.",
    signInGateTitle: "Войдите, чтобы использовать ИИ-репетитора",
    signInGateText:
      "Репетитор отвечает на основе видео уроков, а для этого нужен ваш аккаунт.",
    signInAgain: "Войти ещё раз",
    errorSessionExpired: "Сеанс истёк. Войдите ещё раз, чтобы продолжить общение.",
    errorGeneric:
      "Репетитор сейчас не может ответить. Проверьте соединение и попробуйте ещё раз.",
    groundedBadge: "На основе видео",
    citation: (citation: string) => `[${citation}]`,
    codePlaceholder: "Вставьте код сюда (необязательно)",
    askPlaceholder: "Задайте вопрос…",
  },
  auth: {
    welcomeBack: "С возвращением",
    signInSubtitle: "Войдите, чтобы продолжить изучение Python.",
    continueWithGoogle: "Продолжить через Google",
    orContinueWithEmail: "или продолжите по электронной почте",
    passwordPlaceholder: "Ваш пароль",
    forgotPassword: "Забыли пароль?",
    createAccount: "Создать аккаунт",
    enterEmailAndPassword: "Введите электронную почту и пароль.",
    googleNoCode: "Вход через Google не вернул код. Попробуйте ещё раз.",
    signUpSubtitle: "Начните учить Python — бесплатно, без карты.",
    nameLabel: "Имя",
    namePlaceholder: "Ваше имя",
    passwordMinPlaceholder: "Не менее 8 символов",
    verifyCodeNote: "Мы отправим вам 6-значный код на почту для подтверждения аккаунта.",
    alreadyHaveAccount: "Уже есть аккаунт?",
    enterName: "Введите имя.",
    passwordMin8: "Пароль должен содержать не менее 8 символов.",
    otpSubtitle: (email: string, purpose: "signup" | "signin") =>
      `Мы отправили 6-значный код на ${email || "вашу электронную почту"}. Введите его ниже, чтобы ${
        purpose === "signup" ? "подтвердить аккаунт" : "войти"
      }.`,
    verify: "Подтвердить",
    resendCodePrompt: "Не получили код? Отправить ещё раз",
    noEmailToVerify: "Нет почты для подтверждения. Вернитесь и попробуйте войти ещё раз.",
    noEmailToSendCodeTo: "Нет адреса, на который можно отправить код.",
    newCodeSentTo: (email: string) => `Новый код отправлен на ${email}.`,
    forgotPasswordTitle: "Забыли пароль",
    forgotSubtitle:
      "Введите почту, с которой вы регистрировались, и мы пришлём ссылку для сброса пароля.",
    sendResetLink: "Отправить ссылку для сброса",
    resetLinkSentFor: (email: string) =>
      `Если аккаунт для ${email} существует, мы отправили туда ссылку для сброса пароля.`,
    resetLinkNote:
      "Ссылка откроет сайт, где вы выберете новый пароль. Затем вернитесь сюда и войдите с ним.",
    twoFactorTitle: "Двухфакторная аутентификация",
    twoFactorSubtitle:
      "На вашем аккаунте включена двухфакторная аутентификация. Введите 6-значный код из приложения-аутентификатора — или нажмите «Отправить ещё раз», чтобы получить код по почте.",
    verifyAndSignIn: "Подтвердить и войти",
    resendCodeByEmail: "Отправить код по почте ещё раз",
    codeSentToEmail: "Код отправлен на вашу почту.",
  },
  settings: {
    signedInAs: (email: string) => `Вы вошли как ${email}`,
    appearance: "Внешний вид",
    theme: "Тема",
    themeDark: "Тёмная",
    themeLight: "Светлая",
    darkIsDefault: "По умолчанию тёмная.",
    dailyGoal: "Дневная цель",
    minutesPerDay: "Минут обучения в день",
    goalMinutes: (minutes: number) => `${minutes} мин`,
    streak: "Серия",
    streakCount: (count: number) =>
      `${count} ${plural(count, "день", "дня", "дней")} подряд`,
    streakExplainer:
      "День засчитывается, когда вы проходите или смотрите урок. Если серия прервётся, её можно восстановить в течение 24 часов — до 3 раз в месяц.",
    restoresLeft: (n: number) => `Осталось восстановлений в этом месяце: ${n} из 3.`,
    updates: "Обновления",
    appUpdates: "Обновления приложения",
    updatesExplainer:
      "Новые версии выходят как релизы на GitHub. Приложение проверяет при запуске; проверить можно и здесь.",
    checkForUpdates: "Проверить обновления",
    upToDate: "У вас последняя версия.",
    couldntCheckUpdates: "Не удалось проверить обновления — попробуйте позже.",
    account: "Аккаунт",
    appVersion: (version: string) => `Learn Python · версия ${version}`,
    language: "Язык",
    languageHint: "Применяется ко всему приложению сразу.",
  },
  update: {
    available: "Доступно обновление",
    versionLine: (version: string, size: string, mandatory: boolean) =>
      `Версия ${version}${size ? ` · ${size}` : ""}${
        mandatory ? " · Обязательно" : ""
      }`,
    sizeMB: (bytes: number) => `${(bytes / (1024 * 1024)).toFixed(1)} MB`,
    newVersionAvailable: "Доступна новая версия Learn Python.",
    downloading: (percent: number) => `Загрузка… ${percent}%`,
    openingInstaller: "Открытие установщика…",
    downloadFailed: "Не удалось скачать обновление.",
    downloadInterrupted: "Загрузка прервана.",
    allowInstallsInSettings: "Разрешите установку в настройках",
    update: "Обновить",
    tryAgain: "Попробовать ещё раз",
    later: "Позже",
    mandatoryHint: "Это обновление обязательно для продолжения использования приложения.",
  },
};
