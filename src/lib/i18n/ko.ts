// Korean strings — UI chrome only (see en.ts for scope).
import type { Strings } from "./index";

export const ko: Strings = {
  common: {
    appName: "Learn Python",
    signIn: "로그인",
    signOut: "로그아웃",
    email: "이메일",
    emailPlaceholder: "you@example.com",
    password: "비밀번호",
    showPassword: "비밀번호 표시",
    hidePassword: "비밀번호 숨기기",
    genericError: "문제가 발생했습니다. 다시 시도해 주세요.",
    enterEmailAddress: "이메일 주소를 입력해 주세요.",
    checkYourEmail: "이메일을 확인해 주세요",
    sixDigitCodeLabel: "6자리 코드",
    codePlaceholder: "123456",
    enterSixDigitCode: "6자리 코드를 입력해 주세요.",
    backToSignIn: "로그인으로 돌아가기",
    retry: "다시 시도",
    goBack: "뒤로 가기",
    completed: "완료됨",
    watchedPct: (pct: number) => `시청 ${pct}%`,
    notStarted: "시작 전",
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
      return h > 0 ? `${h}시간 ${m}분` : `${m}분`;
    },
    requestFailed: (status: number) => `요청 실패 (${status})`,
    send: "보내기",
    roadmap: "로드맵",
    settings: "설정",
    aiTutor: "AI 튜터",
  },
  tabs: {
    learn: "학습",
    courses: "강좌",
    editor: "에디터",
    profile: "프로필",
  },
  nav: {
    verifyEmail: "이메일 인증",
    lesson: "레슨",
    course: "강좌",
  },
  learn: {
    loadError: "레슨을 불러오지 못했습니다.",
    greeting: (firstName: string) => `안녕하세요, ${firstName}님`,
    progressSummary: (totalDone: number) =>
      `100 Days of Code · ${totalDone}/100개 레슨 완료`,
    streakChip: (n: number) => `연속 ${n}일`,
    continueLabel: "이어서 학습하기",
    continueTitle: (day: number, lessonTitle: string) =>
      `Day ${day} · ${lessonTitle}`,
    continueWatched: (pct: number, duration: string) =>
      `시청 ${pct}% · ${duration}`,
    allCompleteTitle: "100개 레슨을 모두 완료했습니다",
    allCompleteSubtitle: "수고하셨습니다 — 아래에서 언제든 복습할 수 있습니다.",
    sectionSubtitle: (from: number, to: number, done: number, total: number) =>
      `Day ${from}–${to} · ${done}/${total}개 완료`,
    lessonDay: (n: number) => `Day ${n}`,
    statusPlaying: (pct: number) => `재생 중 · ${pct}%`,
  },
  courses: {
    intro: "전체 Python 동영상 강좌 — 크리에이터를 선택해 시청을 시작하세요.",
    countPlaylists: (n: number) => `${n}개 플레이리스트`,
    countVideos: (n: number) => `${n}개 동영상`,
    countOneShots: (n: number) => `${n}개 원샷 영상`,
  },
  editor: {
    title: "코드 에디터",
    subtitle: "여기에서 바로 Python을 실행할 수 있습니다 — 웹사이트의 에디터를 앱 안에서 사용합니다.",
    signInNotice:
      "코드를 GitHub에 저장하려면 에디터 안에서 다시 로그인해 주세요. 에디터 로그인은 앱 로그인과 별개입니다.",
    reload: "에디터 새로고침",
    loading: "에디터 불러오는 중…",
  },
  profile: {
    signedOutSubtitle:
      "Learn Python, 온라인에서도 오프라인에서도. 로그인하면 이 기기에서 진도, 연속 학습 기록, AI 튜터를 이어갈 수 있습니다.",
    createAccountLink: "처음 오셨나요? 계정 만들기",
    signedOutInfo:
      "레슨은 로그인 없이 무료로 볼 수 있습니다. 진도는 이 기기에 저장됩니다.",
    authBadge: (auth: "google" | "email") =>
      `${auth === "google" ? "Google" : "이메일"}로 로그인됨`,
    authBadgeMfa: " · 2단계 인증 켜짐",
    statStreakLabel: "일 연속",
    statGoalLabel: "분 / 일 목표",
    statLessonsLabel: "완료한 레슨",
    streakHint: "오늘 레슨을 완료하면 연속 학습 기록이 시작됩니다.",
  },
  lesson: {
    notesEmpty: "이 레슨의 노트가 아직 없습니다.",
    notesHeading: "노트",
    tutorialSummary: "요약",
    tutorialPractice: "연습",
    quizHeading: "퀴즈",
    quizQuestionOf: (current: number, total: number) =>
      `문제 ${current} / ${total}`,
    quizScore: (correct: number, total: number) =>
      `점수: ${correct}/${total} (${Math.round(
        (correct / total) * 100
      )} %)`,
    quizPassed: "✓ 테스트 통과",
    quizFailed: "아쉽네요 — 70% 이상이면 통과입니다. 다시 도전해 보세요.",
    quizRetake: "퀴즈 다시 풀기",
    quizNext: "다음 문제",
    quizSeeResult: "결과 보기",
    notFound: "레슨을 찾을 수 없습니다.",
    markComplete: "완료로 표시",
    completedButton: "✓ 완료됨",
    askTutor: "AI 튜터에게 질문하기",
    saveOffline: "오프라인 저장",
    downloading: "다운로드 중…",
    downloadingPct: (pct: number) => `다운로드 중 ${pct}%`,
    removeDownload: "다운로드 삭제",
    downloadPaused: "다운로드가 일시 중지되었습니다 — 다시 탭하여 재시도하세요.",
    downloadFailed: "다운로드에 실패했습니다.",
    savedOffline: "오프라인 저장됨",
    prevLesson: "← 이전",
    nextLesson: "다음 →",
  },
  course: {
    notFound: "강좌를 찾을 수 없습니다.",
    closePlayer: "플레이어 닫기",
    tapPlayToStart: "탭하여 시청 시작",
    markAsComplete: "완료로 표시",
    oneShotsHeading: "원샷 영상",
    playlistMeta: (count: number, totalDuration: string, done: number) =>
      `${count}개 동영상 · ${totalDuration} · ${done}개 완료`,
    oneShotsMeta: (count: number, totalDuration: string) =>
      `${count}개 동영상 · ${totalDuration}`,
    videoRowNumber: (n: number) => `${n}. `,
  },
  roadmap: {
    topicsComplete: (done: number, total: number) =>
      `${done}/${total}개 주제 완료`,
    stageTopicCount: (n: number) => `${n}개 주제`,
    topicDone: "✓ 완료",
    topicLesson: "레슨",
    topicMeta: (difficulty: string, minutes: number) =>
      `${difficulty} · ${minutes}분`,
  },
  tutor: {
    modeTutor: "튜터",
    modeExplain: "설명",
    modeDebug: "디버그",
    modeQuiz: "퀴즈",
    hintTutor: "레슨에 대해 질문하기",
    hintExplain: "코드를 붙여넣고 무슨 일을 하는지 물어보기",
    hintDebug: "오류 있는 코드를 붙여넣고 무엇이 잘못됐는지 물어보기",
    hintQuiz: "이 레슨으로 스스로 테스트하기",
    hintLessonSuffix: (hint: string, lessonId: string) =>
      `${hint} · 레슨 ${lessonId}`,
    greetingLesson:
      "이 레슨에 대해 무엇이든 물어보세요 — 동영상 내용을 바탕으로 답변합니다.",
    greetingGeneral:
      "Python에 대해 무엇이든 물어보세요. 위에서 모드를 선택하면 코드 설명, 디버그, 퀴즈를 할 수 있습니다.",
    signInGateTitle: "AI 튜터를 사용하려면 로그인하세요",
    signInGateText:
      "튜터는 레슨 동영상을 바탕으로 답변하므로 계정이 필요합니다.",
    signInAgain: "다시 로그인",
    errorSessionExpired: "세션이 만료되었습니다. 다시 로그인하여 대화를 이어가세요.",
    errorGeneric:
      "지금은 튜터가 답변할 수 없습니다. 연결을 확인하고 다시 시도해 주세요.",
    groundedBadge: "동영상 기반 답변",
    citation: (citation: string) => `[${citation}]`,
    codePlaceholder: "코드를 여기에 붙여넣으세요 (선택 사항)",
    askPlaceholder: "질문하기…",
  },
  auth: {
    welcomeBack: "다시 오신 것을 환영합니다",
    signInSubtitle: "로그인하고 학습을 이어가세요.",
    continueWithGoogle: "Google로 계속하기",
    orContinueWithEmail: "또는 이메일로 계속하기",
    passwordPlaceholder: "비밀번호",
    forgotPassword: "비밀번호를 잊으셨나요?",
    createAccount: "계정 만들기",
    enterEmailAndPassword: "이메일과 비밀번호를 입력해 주세요.",
    googleNoCode: "Google 로그인에서 코드가 반환되지 않았습니다. 다시 시도해 주세요.",
    signUpSubtitle: "Python 학습을 시작하세요 — 무료, 카드 등록 불필요.",
    nameLabel: "이름",
    namePlaceholder: "이름",
    passwordMinPlaceholder: "8자 이상",
    verifyCodeNote: "계정 인증을 위해 6자리 코드를 이메일로 보내드립니다.",
    alreadyHaveAccount: "이미 계정이 있으신가요?",
    enterName: "이름을 입력해 주세요.",
    passwordMin8: "비밀번호는 8자 이상이어야 합니다.",
    otpSubtitle: (email: string, purpose: "signup" | "signin") =>
      `${email || "이메일"}로 6자리 코드를 보냈습니다. ${
        purpose === "signup" ? "계정을 인증하려면" : "로그인하려면"
      } 아래에 입력해 주세요.`,
    verify: "인증",
    resendCodePrompt: "코드를 받지 못하셨나요? 다시 보내기",
    noEmailToVerify: "인증할 이메일이 없습니다. 돌아가서 다시 로그인해 주세요.",
    noEmailToSendCodeTo: "코드를 보낼 이메일이 없습니다.",
    newCodeSentTo: (email: string) => `새 코드를 ${email}로 보냈습니다.`,
    forgotPasswordTitle: "비밀번호 찾기",
    forgotSubtitle:
      "가입할 때 사용한 이메일을 입력하면 재설정 링크를 보내드립니다.",
    sendResetLink: "재설정 링크 보내기",
    resetLinkSentFor: (email: string) =>
      `${email}에 대한 계정이 존재하면 비밀번호 재설정 링크를 보냈습니다.`,
    resetLinkNote:
      "링크를 열면 웹사이트에서 새 비밀번호를 선택할 수 있습니다. 그런 다음 여기로 돌아와 새 비밀번호로 로그인하세요.",
    twoFactorTitle: "2단계 인증",
    twoFactorSubtitle:
      "계정에 2단계 인증이 켜져 있습니다. 인증 앱의 6자리 코드를 입력하세요. 또는 다시 보내기를 탭하면 이메일로 코드를 받을 수 있습니다.",
    verifyAndSignIn: "인증하고 로그인",
    resendCodeByEmail: "이메일로 코드 다시 보내기",
    codeSentToEmail: "코드를 이메일로 보냈습니다.",
  },
  settings: {
    signedInAs: (email: string) => `${email}(으)로 로그인됨`,
    appearance: "모양",
    theme: "테마",
    themeDark: "다크",
    themeLight: "라이트",
    darkIsDefault: "다크가 기본값입니다.",
    dailyGoal: "일일 목표",
    minutesPerDay: "하루 학습 시간(분)",
    goalMinutes: (minutes: number) => `${minutes}분`,
    streak: "연속 학습",
    streakCount: (count: number) => `${count}일 연속`,
    streakExplainer:
      "레슨을 완료하거나 시청한 날이 기록됩니다. 연속 기록이 끊어지면 24시간 이내에 복원할 수 있습니다 — 한 달에 최대 3번까지.",
    restoresLeft: (n: number) => `이번 달 남은 복원 횟수: 3회 중 ${n}회.`,
    updates: "업데이트",
    appUpdates: "앱 업데이트",
    updatesExplainer:
      "새 버전은 GitHub 릴리스로 제공됩니다. 앱은 실행 시 확인하며, 여기서도 확인할 수 있습니다.",
    checkForUpdates: "업데이트 확인",
    upToDate: "최신 버전입니다.",
    couldntCheckUpdates: "업데이트를 확인할 수 없습니다 — 나중에 다시 시도해 주세요.",
    account: "계정",
    appVersion: (version: string) => `Learn Python · 버전 ${version}`,
    language: "언어",
    languageHint: "앱 전체에 즉시 적용됩니다.",
  },
  update: {
    available: "업데이트 가능",
    versionLine: (version: string, size: string, mandatory: boolean) =>
      `버전 ${version}${size ? ` · ${size}` : ""}${
        mandatory ? " · 필수" : ""
      }`,
    sizeMB: (bytes: number) => `${(bytes / (1024 * 1024)).toFixed(1)} MB`,
    newVersionAvailable: "새로운 버전의 Learn Python을 사용할 수 있습니다.",
    downloading: (percent: number) => `다운로드 중… ${percent}%`,
    openingInstaller: "설치 프로그램을 여는 중…",
    downloadFailed: "업데이트를 다운로드하지 못했습니다.",
    downloadInterrupted: "다운로드가 중단되었습니다.",
    allowInstallsInSettings: "설정에서 설치를 허용해 주세요",
    update: "업데이트",
    tryAgain: "다시 시도",
    later: "나중에",
    mandatoryHint: "이 업데이트는 앱을 계속 사용하려면 필수입니다.",
  },
};
