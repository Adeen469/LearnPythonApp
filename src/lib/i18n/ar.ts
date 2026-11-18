// Arabic strings — standard, common UI Arabic.
// Typed as `Strings` so TypeScript errors if any key is missing.
// No RTL layout changes here — strings only.
import type { Strings } from "./index";

export const ar: Strings = {
  common: {
    appName: "Learn Python",
    signIn: "تسجيل الدخول",
    signOut: "تسجيل الخروج",
    email: "البريد الإلكتروني",
    emailPlaceholder: "you@example.com",
    password: "كلمة المرور",
    showPassword: "إظهار كلمة المرور",
    hidePassword: "إخفاء كلمة المرور",
    genericError: "حدث خطأ ما. يُرجى المحاولة مرة أخرى.",
    enterEmailAddress: "أدخل عنوان بريدك الإلكتروني.",
    checkYourEmail: "تحقق من بريدك الإلكتروني",
    sixDigitCodeLabel: "رمز من 6 أرقام",
    codePlaceholder: "123456",
    enterSixDigitCode: "أدخل الرمز المكون من 6 أرقام.",
    backToSignIn: "العودة إلى تسجيل الدخول",
    retry: "إعادة المحاولة",
    goBack: "رجوع",
    completed: "مكتمل",
    watchedPct: (pct: number) => `شاهدت ${pct}٪`,
    notStarted: "لم يبدأ بعد",
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
      return h > 0 ? `${h} س ${m} د` : `${m} د`;
    },
    requestFailed: (status: number) => `فشل الطلب (${status})`,
    send: "إرسال",
    roadmap: "خارطة الطريق",
    settings: "الإعدادات",
    aiTutor: "المعلم الذكي",
  },
  tabs: {
    learn: "تعلّم",
    courses: "الدورات",
    editor: "المحرر",
    profile: "الملف الشخصي",
  },
  nav: {
    verifyEmail: "تأكيد البريد الإلكتروني",
    lesson: "الدرس",
    course: "الدورة",
  },
  learn: {
    loadError: "تعذّر تحميل الدروس.",
    greeting: (firstName: string) => `مرحباً، ${firstName}`,
    progressSummary: (totalDone: number) =>
      `100 يوم من البرمجة · ${totalDone}/100 درس مكتمل`,
    streakChip: (n: number) =>
      n === 1 ? `السلسلة: يوم واحد` : `السلسلة: ${n} أيام`,
    continueLabel: "تابع من حيث توقفت",
    continueTitle: (day: number, lessonTitle: string) =>
      `اليوم ${day} · ${lessonTitle}`,
    continueWatched: (pct: number, duration: string) =>
      `شاهدت ${pct}٪ · ${duration}`,
    allCompleteTitle: "أكملت الدروس الـ 100 كلها",
    allCompleteSubtitle: "أحسنت — يمكنك مراجعة أي درس أدناه.",
    sectionSubtitle: (from: number, to: number, done: number, total: number) =>
      `الأيام ${from}–${to} · ${done}/${total} مكتمل`,
    lessonDay: (n: number) => `اليوم ${n}`,
    statusPlaying: (pct: number) => `يُشغَّل الآن · ${pct}٪`,
  },
  courses: {
    intro: "دورات فيديو كاملة في بايثون — اختر معلّماً لتبدأ المشاهدة.",
    countPlaylists: (n: number) =>
      n === 1 ? `قائمة تشغيل واحدة` : `${n} قوائم تشغيل`,
    countVideos: (n: number) => (n === 1 ? `فيديو واحد` : `${n} مقاطع فيديو`),
    countOneShots: (n: number) =>
      n === 1 ? `فيديو واحد` : `${n} مقاطع فيديو`,
  },
  editor: {
    title: "محرر الأكواد",
    subtitle: "شغّل بايثون هنا مباشرة — محرر الموقع نفسه داخل التطبيق.",
    signInNotice:
      "سجّل الدخول مرة أخرى داخل المحرر لحفظ أكوادك على GitHub — للمحرر تسجيل دخول خاص به، منفصل عن التطبيق.",
    reload: "إعادة تحميل المحرر",
    loading: "جارٍ تحميل المحرر…",
  },
  profile: {
    signedOutSubtitle:
      "تعلّم بايثون، أونلاين أو أوفلاين. سجّل الدخول لحفظ تقدمك وسلسلتك والمعلم الذكي على هذا الجهاز.",
    createAccountLink: "جديد هنا؟ أنشئ حساباً",
    signedOutInfo:
      "الدروس مجانية للتصفح دون تسجيل الدخول. يبقى تقدمك على هذا الجهاز.",
    authBadge: (auth: "google" | "email") =>
      `تم تسجيل الدخول عبر ${auth === "google" ? "Google" : "البريد الإلكتروني"}`,
    authBadgeMfa: " · المصادقة الثنائية مفعّلة",
    statStreakLabel: "يوم متتالٍ",
    statGoalLabel: "دقيقة / هدف اليوم",
    statLessonsLabel: "درس مكتمل",
    streakHint: "أكمل درساً اليوم لبدء سلسلتك.",
  },
  lesson: {
    notesEmpty: "لا توجد ملاحظات لهذا الدرس بعد.",
    notesHeading: "الملاحظات",
    tutorialSummary: "الملخص",
    tutorialPractice: "التدريب",
    quizHeading: "الاختبار",
    quizQuestionOf: (current: number, total: number) =>
      `السؤال ${current} من ${total}`,
    quizScore: (correct: number, total: number) =>
      `نتيجتك: ${correct}/${total} (${Math.round(
        (correct / total) * 100
      )} ٪)`,
    quizPassed: "✓ نجحت في الاختبار",
    quizFailed: "ليس بعد — النجاح يتطلب 70٪ أو أكثر. حاول مرة أخرى.",
    quizRetake: "إعادة الاختبار",
    quizNext: "السؤال التالي",
    quizSeeResult: "عرض النتيجة",
    notFound: "الدرس غير موجود.",
    markComplete: "وضع علامة مكتمل",
    completedButton: "✓ مكتمل",
    askTutor: "اسأل المعلم الذكي",
    saveOffline: "حفظ دون اتصال",
    downloading: "جارٍ التنزيل…",
    downloadingPct: (pct: number) => `جارٍ التنزيل ${pct}٪`,
    removeDownload: "إزالة التنزيل",
    downloadPaused: "توقف التنزيل — انقر مرة أخرى لإعادة المحاولة.",
    downloadFailed: "فشل التنزيل.",
    savedOffline: "تم الحفظ دون اتصال",
    prevLesson: "← السابق",
    nextLesson: "التالي →",
  },
  course: {
    notFound: "الدورة غير موجودة.",
    closePlayer: "إغلاق المشغّل",
    tapPlayToStart: "انقر على التشغيل لبدء المشاهدة",
    markAsComplete: "وضع علامة مكتمل",
    oneShotsHeading: "فيديوهات منفردة",
    playlistMeta: (count: number, totalDuration: string, done: number) =>
      `${count} مقاطع فيديو · ${totalDuration} · ${done} مكتملة`,
    oneShotsMeta: (count: number, totalDuration: string) =>
      `${count} مقاطع فيديو · ${totalDuration}`,
    videoRowNumber: (n: number) => `${n}. `,
  },
  roadmap: {
    topicsComplete: (done: number, total: number) =>
      `${done} من ${total} مواضيع مكتملة`,
    stageTopicCount: (n: number) => (n === 1 ? `موضوع واحد` : `${n} مواضيع`),
    topicDone: "✓ تم",
    topicLesson: "الدرس",
    topicMeta: (difficulty: string, minutes: number) =>
      `${difficulty} · ${minutes} دقيقة`,
  },
  tutor: {
    modeTutor: "المعلم",
    modeExplain: "اشرح",
    modeDebug: "صحّح",
    modeQuiz: "اختبرني",
    hintTutor: "اسأل عن الدرس",
    hintExplain: "الصق الكود واسأل ماذا يفعل",
    hintDebug: "الصق الكود المعطّل واسأل ما الخطأ فيه",
    hintQuiz: "اختبر نفسك في الدرس",
    hintLessonSuffix: (hint: string, lessonId: string) =>
      `${hint} · الدرس ${lessonId}`,
    greetingLesson:
      "اسألني أي شيء عن هذا الدرس — أجيب من الفيديو نفسه.",
    greetingGeneral:
      "اسألني أي شيء عن بايثون. اختر وضعاً أعلاه لشرح الكود أو تصحيحه أو اختبار نفسك.",
    signInGateTitle: "سجّل الدخول لاستخدام المعلم الذكي",
    signInGateText:
      "يجيب المعلم من فيديوهات الدروس، وهذا يحتاج إلى حسابك.",
    signInAgain: "تسجيل الدخول مرة أخرى",
    errorSessionExpired: "انتهت جلستك. سجّل الدخول مرة أخرى لمتابعة المحادثة.",
    errorGeneric:
      "تعذّر على المعلم الإجابة الآن. تحقق من اتصالك وحاول مرة أخرى.",
    groundedBadge: "مستند إلى الفيديو",
    citation: (citation: string) => `[${citation}]`,
    codePlaceholder: "الصق الكود هنا (اختياري)",
    askPlaceholder: "اطرح سؤالاً…",
  },
  auth: {
    welcomeBack: "مرحباً بعودتك",
    signInSubtitle: "سجّل الدخول لمتابعة تعلّم بايثون.",
    continueWithGoogle: "المتابعة عبر Google",
    orContinueWithEmail: "أو تابع عبر البريد الإلكتروني",
    passwordPlaceholder: "كلمة المرور",
    forgotPassword: "نسيت كلمة المرور؟",
    createAccount: "إنشاء حساب",
    enterEmailAndPassword: "أدخل بريدك الإلكتروني وكلمة المرور.",
    googleNoCode: "لم يُرجع تسجيل الدخول عبر Google رمزاً. يُرجى المحاولة مرة أخرى.",
    signUpSubtitle: "ابدأ تعلّم بايثون — مجاناً، دون الحاجة إلى بطاقة.",
    nameLabel: "الاسم",
    namePlaceholder: "اسمك",
    passwordMinPlaceholder: "8 أحرف على الأقل",
    verifyCodeNote: "سنرسل لك رمزاً من 6 أرقام عبر البريد الإلكتروني لتأكيد حسابك.",
    alreadyHaveAccount: "لديك حساب بالفعل؟",
    enterName: "أدخل اسمك.",
    passwordMin8: "يجب أن تكون كلمة المرور 8 أحرف على الأقل.",
    otpSubtitle: (email: string, purpose: "signup" | "signin") =>
      `أرسلنا رمزاً من 6 أرقام إلى ${email || "بريدك الإلكتروني"}. أدخله أدناه ${
        purpose === "signup" ? "لتأكيد حسابك" : "لتسجيل الدخول"
      }.`,
    verify: "تأكيد",
    resendCodePrompt: "لم يصلك الرمز؟ أعد الإرسال",
    noEmailToVerify: "لا يوجد بريد إلكتروني للتأكيد. عُد وحاول تسجيل الدخول مرة أخرى.",
    noEmailToSendCodeTo: "لا يوجد بريد إلكتروني لإرسال الرمز إليه.",
    newCodeSentTo: (email: string) => `تم إرسال رمز جديد إلى ${email}.`,
    forgotPasswordTitle: "نسيت كلمة المرور",
    forgotSubtitle:
      "أدخل البريد الإلكتروني الذي سجّلت به وسنرسل لك رابط إعادة التعيين.",
    sendResetLink: "إرسال رابط إعادة التعيين",
    resetLinkSentFor: (email: string) =>
      `إذا كان هناك حساب لـ ${email}، فقد أرسلنا رابط إعادة تعيين كلمة المرور إليه.`,
    resetLinkNote:
      "يفتح الرابط الموقع، حيث تختار كلمة مرور جديدة. ثم عُد هنا وسجّل الدخول بها.",
    twoFactorTitle: "المصادقة الثنائية",
    twoFactorSubtitle:
      "حسابك مفعّل عليه المصادقة الثنائية. أدخل الرمز المكون من 6 أرقام من تطبيق المصادقة — أو انقر على إعادة الإرسال للحصول على رمز عبر البريد الإلكتروني بدلاً من ذلك.",
    verifyAndSignIn: "تأكيد وتسجيل الدخول",
    resendCodeByEmail: "إعادة إرسال الرمز عبر البريد الإلكتروني",
    codeSentToEmail: "تم إرسال رمز إلى بريدك الإلكتروني.",
  },
  settings: {
    signedInAs: (email: string) => `تم تسجيل الدخول باسم ${email}`,
    appearance: "المظهر",
    theme: "السمة",
    themeDark: "داكن",
    themeLight: "فاتح",
    darkIsDefault: "الداكن هو الافتراضي.",
    dailyGoal: "الهدف اليومي",
    minutesPerDay: "دقائق التعلم يومياً",
    goalMinutes: (minutes: number) => `${minutes} دقيقة`,
    streak: "السلسلة",
    streakCount: (count: number) => `${count} يوم متتالٍ`,
    streakExplainer:
      "يُحتسب اليوم عندما تكمل درساً أو تشاهده. إذا انقطعت سلسلتك، يمكنك استعادتها خلال 24 ساعة — حتى 3 مرات في الشهر.",
    restoresLeft: (n: number) => `عمليات الاستعادة المتبقية هذا الشهر: ${n} من 3.`,
    updates: "التحديثات",
    appUpdates: "تحديثات التطبيق",
    updatesExplainer:
      "تصل الإصدارات الجديدة كإصدارات GitHub. يتحقق التطبيق عند الإطلاق؛ ويمكنك التحقق هنا أيضاً.",
    checkForUpdates: "التحقق من التحديثات",
    upToDate: "أنت محدَّث.",
    couldntCheckUpdates: "تعذّر التحقق من التحديثات — حاول مرة أخرى لاحقاً.",
    account: "الحساب",
    appVersion: (version: string) => `Learn Python · الإصدار ${version}`,
    language: "اللغة",
    languageHint: "تُطبَّق على التطبيق كله فوراً.",
  },
  update: {
    available: "يتوفر تحديث",
    versionLine: (version: string, size: string, mandatory: boolean) =>
      `الإصدار ${version}${size ? ` · ${size}` : ""}${
        mandatory ? " · مطلوب" : ""
      }`,
    sizeMB: (bytes: number) => `${(bytes / (1024 * 1024)).toFixed(1)} MB`,
    newVersionAvailable: "يتوفر إصدار جديد من Learn Python.",
    downloading: (percent: number) => `جارٍ التنزيل… ${percent}٪`,
    openingInstaller: "جارٍ فتح المثبّت…",
    downloadFailed: "تعذّر تنزيل التحديث.",
    downloadInterrupted: "انقطع التنزيل.",
    allowInstallsInSettings: "اسمح بالتثبيت في الإعدادات",
    update: "تحديث",
    tryAgain: "إعادة المحاولة",
    later: "لاحقاً",
    mandatoryHint: "هذا التحديث مطلوب لمواصلة استخدام التطبيق.",
  },
};
