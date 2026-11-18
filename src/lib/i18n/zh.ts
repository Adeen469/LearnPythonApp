// Chinese (Simplified) strings — UI chrome only (see en.ts for scope).
import type { Strings } from "./index";

export const zh: Strings = {
  common: {
    appName: "Learn Python",
    signIn: "登录",
    signOut: "退出登录",
    email: "邮箱",
    emailPlaceholder: "you@example.com",
    password: "密码",
    showPassword: "显示密码",
    hidePassword: "隐藏密码",
    genericError: "出了点问题，请重试。",
    enterEmailAddress: "请输入您的邮箱地址。",
    checkYourEmail: "请查看您的邮箱",
    sixDigitCodeLabel: "6 位验证码",
    codePlaceholder: "123456",
    enterSixDigitCode: "请输入 6 位验证码。",
    backToSignIn: "返回登录",
    retry: "重试",
    goBack: "返回",
    completed: "已完成",
    watchedPct: (pct: number) => `已观看 ${pct}%`,
    notStarted: "未开始",
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
      return h > 0 ? `${h}小时${m}分钟` : `${m}分钟`;
    },
    requestFailed: (status: number) => `请求失败 (${status})`,
    send: "发送",
    roadmap: "学习路线",
    settings: "设置",
    aiTutor: "AI 导师",
  },
  tabs: {
    learn: "学习",
    courses: "课程",
    editor: "编辑器",
    profile: "我的",
  },
  nav: {
    verifyEmail: "验证邮箱",
    lesson: "课时",
    course: "课程",
  },
  learn: {
    loadError: "无法加载课程。",
    greeting: (firstName: string) => `你好，${firstName}`,
    progressSummary: (totalDone: number) =>
      `100 Days of Code · 已完成 ${totalDone}/100 课`,
    streakChip: (n: number) => `连续学习 ${n} 天`,
    continueLabel: "继续上次的学习",
    continueTitle: (day: number, lessonTitle: string) =>
      `第 ${day} 天 · ${lessonTitle}`,
    continueWatched: (pct: number, duration: string) =>
      `已观看 ${pct}% · ${duration}`,
    allCompleteTitle: "100 课已全部完成",
    allCompleteSubtitle: "做得很好 — 可以在下方随时复习。",
    sectionSubtitle: (from: number, to: number, done: number, total: number) =>
      `第 ${from}–${to} 天 · 已完成 ${done}/${total}`,
    lessonDay: (n: number) => `第 ${n} 天`,
    statusPlaying: (pct: number) => `播放中 · ${pct}%`,
  },
  courses: {
    intro: "完整的 Python 视频课程 — 选择一位讲师开始观看。",
    countPlaylists: (n: number) => `${n} 个播放列表`,
    countVideos: (n: number) => `${n} 个视频`,
    countOneShots: (n: number) => `${n} 个单集视频`,
  },
  editor: {
    title: "代码编辑器",
    subtitle: "直接在这里运行 Python — 这就是网站上的编辑器，现已内置于应用中。",
    signInNotice:
      "要把代码保存到 GitHub，请在编辑器内重新登录一次 — 编辑器的登录与应用是分开的。",
    reload: "重新加载编辑器",
    loading: "正在加载编辑器…",
  },
  profile: {
    signedOutSubtitle:
      "Learn Python，随时随地学习。登录后，可在此设备上同步您的学习进度、连续打卡和 AI 导师。",
    createAccountLink: "新用户？创建账号",
    signedOutInfo:
      "无需登录即可免费浏览课程。您的进度保存在此设备上。",
    authBadge: (auth: "google" | "email") =>
      `已通过${auth === "google" ? " Google" : "邮箱"}登录`,
    authBadgeMfa: " · 已开启双重验证",
    statStreakLabel: "天连续打卡",
    statGoalLabel: "分钟 / 天目标",
    statLessonsLabel: "已完成课程",
    streakHint: "今天完成一节课即可开始连续打卡。",
  },
  lesson: {
    notesEmpty: "本课暂无笔记。",
    notesHeading: "笔记",
    tutorialSummary: "小结",
    tutorialPractice: "练习",
    quizHeading: "测验",
    quizQuestionOf: (current: number, total: number) =>
      `第 ${current} 题，共 ${total} 题`,
    quizScore: (correct: number, total: number) =>
      `您的得分：${correct}/${total} (${Math.round(
        (correct / total) * 100
      )} %)`,
    quizPassed: "✓ 测试通过",
    quizFailed: "差一点 — 达到 70% 即可通过，再试一次吧。",
    quizRetake: "重新测验",
    quizNext: "下一题",
    quizSeeResult: "查看结果",
    notFound: "未找到该课程。",
    markComplete: "标记为完成",
    completedButton: "✓ 已完成",
    askTutor: "向 AI 导师提问",
    saveOffline: "离线保存",
    downloading: "下载中…",
    downloadingPct: (pct: number) => `下载中 ${pct}%`,
    removeDownload: "删除下载",
    downloadPaused: "下载已暂停 — 点按重试。",
    downloadFailed: "下载失败。",
    savedOffline: "已离线保存",
    prevLesson: "← 上一课",
    nextLesson: "下一课 →",
  },
  course: {
    notFound: "未找到该课程。",
    closePlayer: "关闭播放器",
    tapPlayToStart: "点按开始播放",
    markAsComplete: "标记为完成",
    oneShotsHeading: "单集视频",
    playlistMeta: (count: number, totalDuration: string, done: number) =>
      `${count} 个视频 · ${totalDuration} · 已完成 ${done} 个`,
    oneShotsMeta: (count: number, totalDuration: string) =>
      `${count} 个视频 · ${totalDuration}`,
    videoRowNumber: (n: number) => `${n}. `,
  },
  roadmap: {
    topicsComplete: (done: number, total: number) =>
      `已完成 ${done}/${total} 个主题`,
    stageTopicCount: (n: number) => `${n} 个主题`,
    topicDone: "✓ 已完成",
    topicLesson: "课时",
    topicMeta: (difficulty: string, minutes: number) =>
      `${difficulty} · ${minutes} 分钟`,
  },
  tutor: {
    modeTutor: "导师",
    modeExplain: "讲解",
    modeDebug: "调试",
    modeQuiz: "测验",
    hintTutor: "询问有关本课的问题",
    hintExplain: "粘贴代码，询问它的作用",
    hintDebug: "粘贴有问题的代码，询问错在哪里",
    hintQuiz: "用本课内容考考自己",
    hintLessonSuffix: (hint: string, lessonId: string) =>
      `${hint} · 第 ${lessonId} 课`,
    greetingLesson:
      "关于本课有任何问题都可以问我 — 我会根据视频内容回答。",
    greetingGeneral:
      "关于 Python 有任何问题都可以问我。选择上方模式，可以讲解代码、调试代码或进行测验。",
    signInGateTitle: "登录后使用 AI 导师",
    signInGateText:
      "导师根据课程视频作答，需要您的账号。",
    signInAgain: "重新登录",
    errorSessionExpired: "您的会话已过期，请重新登录以继续对话。",
    errorGeneric:
      "导师暂时无法回答，请检查网络连接后重试。",
    groundedBadge: "基于视频内容",
    citation: (citation: string) => `[${citation}]`,
    codePlaceholder: "在此粘贴代码（可选）",
    askPlaceholder: "请输入问题…",
  },
  auth: {
    welcomeBack: "欢迎回来",
    signInSubtitle: "登录以继续学习 Python。",
    continueWithGoogle: "使用 Google 继续",
    orContinueWithEmail: "或使用邮箱继续",
    passwordPlaceholder: "您的密码",
    forgotPassword: "忘记密码？",
    createAccount: "创建账号",
    enterEmailAndPassword: "请输入您的邮箱和密码。",
    googleNoCode: "Google 登录未返回验证码，请重试。",
    signUpSubtitle: "开始学习 Python — 免费，无需绑定银行卡。",
    nameLabel: "姓名",
    namePlaceholder: "您的姓名",
    passwordMinPlaceholder: "至少 8 个字符",
    verifyCodeNote: "我们将向您发送一封包含 6 位验证码的邮件以验证账号。",
    alreadyHaveAccount: "已有账号？",
    enterName: "请输入您的姓名。",
    passwordMin8: "密码至少需要 8 个字符。",
    otpSubtitle: (email: string, purpose: "signup" | "signin") =>
      `我们已向 ${email || "您的邮箱"} 发送了 6 位验证码，请输入以下验证码${
        purpose === "signup" ? "以验证您的账号" : "以登录"
      }。`,
    verify: "验证",
    resendCodePrompt: "没收到验证码？重新发送",
    noEmailToVerify: "没有需要验证的邮箱，请返回并重新登录。",
    noEmailToSendCodeTo: "没有可发送验证码的邮箱。",
    newCodeSentTo: (email: string) => `新验证码已发送至 ${email}。`,
    forgotPasswordTitle: "忘记密码",
    forgotSubtitle:
      "输入您注册时使用的邮箱，我们将向您发送重置链接。",
    sendResetLink: "发送重置链接",
    resetLinkSentFor: (email: string) =>
      `如果 ${email} 存在对应账号，我们已向其发送密码重置链接。`,
    resetLinkNote:
      "打开链接后可在网站上设置新密码，然后回到这里用新密码登录。",
    twoFactorTitle: "双重验证",
    twoFactorSubtitle:
      "您的账号已开启双重验证，请输入验证器应用中的 6 位验证码 — 或点按重新发送，改用邮箱接收验证码。",
    verifyAndSignIn: "验证并登录",
    resendCodeByEmail: "通过邮箱重新发送验证码",
    codeSentToEmail: "验证码已发送至您的邮箱。",
  },
  settings: {
    signedInAs: (email: string) => `当前登录账号：${email}`,
    appearance: "外观",
    theme: "主题",
    themeDark: "深色",
    themeLight: "浅色",
    darkIsDefault: "默认为深色。",
    dailyGoal: "每日目标",
    minutesPerDay: "每天学习时长（分钟）",
    goalMinutes: (minutes: number) => `${minutes} 分钟`,
    streak: "连续打卡",
    streakCount: (count: number) => `连续 ${count} 天`,
    streakExplainer:
      "完成或观看一节课的当天即计入打卡。如果连续打卡中断，可在 24 小时内恢复 — 每月最多 3 次。",
    restoresLeft: (n: number) => `本月剩余恢复次数：${n}/3 次。`,
    updates: "更新",
    appUpdates: "应用更新",
    updatesExplainer:
      "新版本将通过 GitHub 发布。应用会在启动时检查更新，您也可以在这里手动检查。",
    checkForUpdates: "检查更新",
    upToDate: "已是最新版本。",
    couldntCheckUpdates: "无法检查更新 — 请稍后再试。",
    account: "账号",
    appVersion: (version: string) => `Learn Python · 版本 ${version}`,
    language: "语言",
    languageHint: "立即应用于整个应用。",
  },
  update: {
    available: "有可用更新",
    versionLine: (version: string, size: string, mandatory: boolean) =>
      `版本 ${version}${size ? ` · ${size}` : ""}${
        mandatory ? " · 必须更新" : ""
      }`,
    sizeMB: (bytes: number) => `${(bytes / (1024 * 1024)).toFixed(1)} MB`,
    newVersionAvailable: "Learn Python 有新版本可用。",
    downloading: (percent: number) => `下载中… ${percent}%`,
    openingInstaller: "正在打开安装程序…",
    downloadFailed: "无法下载更新。",
    downloadInterrupted: "下载已中断。",
    allowInstallsInSettings: "请在设置中允许安装",
    update: "更新",
    tryAgain: "重试",
    later: "稍后",
    mandatoryHint: "此更新为继续使用应用所必需。",
  },
};
