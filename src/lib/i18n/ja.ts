// Japanese strings — UI chrome only (see en.ts for scope).
import type { Strings } from "./index";

export const ja: Strings = {
  common: {
    appName: "Learn Python",
    signIn: "サインイン",
    signOut: "サインアウト",
    email: "メールアドレス",
    emailPlaceholder: "you@example.com",
    password: "パスワード",
    showPassword: "パスワードを表示",
    hidePassword: "パスワードを非表示",
    genericError: "問題が発生しました。もう一度お試しください。",
    enterEmailAddress: "メールアドレスを入力してください。",
    checkYourEmail: "メールを確認してください",
    sixDigitCodeLabel: "6桁のコード",
    codePlaceholder: "123456",
    enterSixDigitCode: "6桁のコードを入力してください。",
    backToSignIn: "サインインに戻る",
    retry: "再試行",
    goBack: "戻る",
    completed: "完了",
    watchedPct: (pct: number) => `視聴済み ${pct}%`,
    notStarted: "未開始",
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
      return h > 0 ? `${h}時間${m}分` : `${m}分`;
    },
    requestFailed: (status: number) => `リクエストに失敗しました (${status})`,
    send: "送信",
    roadmap: "ロードマップ",
    settings: "設定",
    aiTutor: "AIチューター",
  },
  tabs: {
    learn: "学習",
    courses: "コース",
    editor: "エディタ",
    profile: "プロフィール",
  },
  nav: {
    verifyEmail: "メールアドレスを確認",
    lesson: "レッスン",
    course: "コース",
  },
  learn: {
    loadError: "レッスンを読み込めませんでした。",
    greeting: (firstName: string) => `こんにちは、${firstName}さん`,
    progressSummary: (totalDone: number) =>
      `100 Days of Code · ${totalDone}/100レッスン完了`,
    streakChip: (n: number) => `連続 ${n} 日`,
    continueLabel: "続きから再開",
    continueTitle: (day: number, lessonTitle: string) =>
      `Day ${day} · ${lessonTitle}`,
    continueWatched: (pct: number, duration: string) =>
      `視聴済み ${pct}% · ${duration}`,
    allCompleteTitle: "100レッスンすべて完了",
    allCompleteSubtitle: "お疲れさまでした — 下からいつでも復習できます。",
    sectionSubtitle: (from: number, to: number, done: number, total: number) =>
      `Day ${from}–${to} · ${done}/${total}完了`,
    lessonDay: (n: number) => `Day ${n}`,
    statusPlaying: (pct: number) => `再生中 · ${pct}%`,
  },
  courses: {
    intro: "Pythonの動画コース — クリエイターを選んで視聴を始めましょう。",
    countPlaylists: (n: number) => `${n}本のプレイリスト`,
    countVideos: (n: number) => `${n}本の動画`,
    countOneShots: (n: number) => `${n}本のワンショット動画`,
  },
  editor: {
    title: "コードエディタ",
    subtitle: "ここでPythonを実行できます — ウェブサイトのエディタをアプリ内で使えます。",
    signInNotice:
      "コードをGitHubに保存するには、エディタ内でもう一度サインインしてください。エディタのサインインはアプリとは別です。",
    reload: "エディタを再読み込み",
    loading: "エディタを読み込み中…",
  },
  profile: {
    signedOutSubtitle:
      "Learn Python、オンラインでもオフラインでも。サインインすると、このデバイスで進捗・連続記録・AIチューターを引き継げます。",
    createAccountLink: "初めての方はこちら — アカウントを作成",
    signedOutInfo:
      "レッスンはサインインなしでも無料で閲覧できます。進捗はこのデバイスに保存されます。",
    authBadge: (auth: "google" | "email") =>
      `${auth === "google" ? "Google" : "メールアドレス"}でサインイン中`,
    authBadgeMfa: " · 2FAオン",
    statStreakLabel: "日連続",
    statGoalLabel: "分 / 日の目標",
    statLessonsLabel: "完了したレッスン",
    streakHint: "今日レッスンを完了すると、連続記録が始まります。",
  },
  lesson: {
    notesEmpty: "このレッスンのノートはまだありません。",
    notesHeading: "ノート",
    tutorialSummary: "Summary",
    tutorialPractice: "Practice",
    quizHeading: "クイズ",
    quizQuestionOf: (current: number, total: number) =>
      `問題 ${current} / ${total}`,
    quizScore: (correct: number, total: number) =>
      `スコア: ${correct}/${total} (${Math.round(
        (correct / total) * 100
      )} %)`,
    quizPassed: "✓ テストに合格しました",
    quizFailed: "あと少し — 70%以上で合格です。もう一度挑戦しましょう。",
    quizRetake: "もう一度受ける",
    quizNext: "次の問題",
    quizSeeResult: "結果を見る",
    notFound: "レッスンが見つかりませんでした。",
    markComplete: "完了にする",
    completedButton: "✓ 完了済み",
    askTutor: "AIチューターに質問",
    saveOffline: "オフライン保存",
    downloading: "ダウンロード中…",
    downloadingPct: (pct: number) => `ダウンロード中 ${pct}%`,
    removeDownload: "ダウンロードを削除",
    downloadPaused: "ダウンロードが一時停止しました — タップして再試行してください。",
    downloadFailed: "ダウンロードに失敗しました。",
    savedOffline: "オフライン保存済み",
    prevLesson: "← 前へ",
    nextLesson: "次へ →",
  },
  course: {
    notFound: "コースが見つかりませんでした。",
    closePlayer: "プレーヤーを閉じる",
    tapPlayToStart: "タップして再生を開始",
    markAsComplete: "完了にする",
    oneShotsHeading: "ワンショット動画",
    playlistMeta: (count: number, totalDuration: string, done: number) =>
      `${count}本の動画 · ${totalDuration} · ${done}本完了`,
    oneShotsMeta: (count: number, totalDuration: string) =>
      `${count}本の動画 · ${totalDuration}`,
    videoRowNumber: (n: number) => `${n}. `,
  },
  roadmap: {
    topicsComplete: (done: number, total: number) =>
      `${done}/${total}トピック完了`,
    stageTopicCount: (n: number) => `${n}トピック`,
    topicDone: "✓ 完了",
    topicLesson: "レッスン",
    topicMeta: (difficulty: string, minutes: number) =>
      `${difficulty} · ${minutes}分`,
  },
  tutor: {
    modeTutor: "チューター",
    modeExplain: "解説",
    modeDebug: "デバッグ",
    modeQuiz: "クイズ",
    hintTutor: "レッスンについて質問する",
    hintExplain: "コードを貼り付けて、動作を聞く",
    hintDebug: "壊れたコードを貼り付けて、問題点を聞く",
    hintQuiz: "このレッスンで自分をテストする",
    hintLessonSuffix: (hint: string, lessonId: string) =>
      `${hint} · レッスン ${lessonId}`,
    greetingLesson:
      "このレッスンについて何でも聞いてください — 動画の内容をもとに答えます。",
    greetingGeneral:
      "Pythonについて何でも聞いてください。上のモードを選ぶと、コードの解説、デバッグ、クイズができます。",
    signInGateTitle: "AIチューターを使うにはサインインしてください",
    signInGateText:
      "チューターはレッスン動画をもとに答えるため、アカウントが必要です。",
    signInAgain: "もう一度サインイン",
    errorSessionExpired: "セッションの有効期限が切れました。もう一度サインインしてチャットを続けてください。",
    errorGeneric:
      "チューターが今は答えられません。接続を確認して、もう一度お試しください。",
    groundedBadge: "動画に基づく回答",
    citation: (citation: string) => `[${citation}]`,
    codePlaceholder: "コードをここに貼り付け（任意）",
    askPlaceholder: "質問する…",
  },
  auth: {
    welcomeBack: "おかえりなさい",
    signInSubtitle: "サインインして学習を続けましょう。",
    continueWithGoogle: "Googleで続ける",
    orContinueWithEmail: "またはメールアドレスで続ける",
    passwordPlaceholder: "パスワード",
    forgotPassword: "パスワードをお忘れですか？",
    createAccount: "アカウントを作成",
    enterEmailAndPassword: "メールアドレスとパスワードを入力してください。",
    googleNoCode: "Googleサインインからコードが返されませんでした。もう一度お試しください。",
    signUpSubtitle: "Python学習を始めましょう — 無料、カード登録不要。",
    nameLabel: "名前",
    namePlaceholder: "お名前",
    passwordMinPlaceholder: "8文字以上",
    verifyCodeNote: "アカウント確認のため、6桁のコードをメールでお送りします。",
    alreadyHaveAccount: "すでにアカウントをお持ちですか？",
    enterName: "名前を入力してください。",
    passwordMin8: "パスワードは8文字以上にしてください。",
    otpSubtitle: (email: string, purpose: "signup" | "signin") =>
      `6桁のコードを${email || "あなたのメールアドレス"}に送信しました。${
        purpose === "signup" ? "アカウントを確認するには" : "サインインするには"
      }、下に入力してください。`,
    verify: "確認",
    resendCodePrompt: "コードが届きませんでしたか？ 再送信",
    noEmailToVerify: "確認するメールアドレスがありません。戻って、もう一度サインインしてください。",
    noEmailToSendCodeTo: "コードを送るメールアドレスがありません。",
    newCodeSentTo: (email: string) => `新しいコードを${email}に送信しました。`,
    forgotPasswordTitle: "パスワードを忘れた場合",
    forgotSubtitle:
      "登録したメールアドレスを入力すると、リセットリンクをお送りします。",
    sendResetLink: "リセットリンクを送信",
    resetLinkSentFor: (email: string) =>
      `${email}のアカウントが存在する場合、パスワードリセットリンクを送信しました。`,
    resetLinkNote:
      "リンクを開くとウェブサイトで新しいパスワードを設定できます。その後、こちらに戻って新しいパスワードでサインインしてください。",
    twoFactorTitle: "二要素認証",
    twoFactorSubtitle:
      "お客様のアカウントでは二要素認証がオンになっています。認証アプリの6桁のコードを入力してください。または、再送信をタップすると、メールでコードを受け取ることもできます。",
    verifyAndSignIn: "確認してサインイン",
    resendCodeByEmail: "メールでコードを再送信",
    codeSentToEmail: "コードをメールで送信しました。",
  },
  settings: {
    signedInAs: (email: string) => `${email}でサインイン中`,
    appearance: "外観",
    theme: "テーマ",
    themeDark: "ダーク",
    themeLight: "ライト",
    darkIsDefault: "ダークが既定です。",
    dailyGoal: "1日の目標",
    minutesPerDay: "1日あたりの学習時間（分）",
    goalMinutes: (minutes: number) => `${minutes}分`,
    streak: "連続記録",
    streakCount: (count: number) => `${count}日連続`,
    streakExplainer:
      "レッスンを完了または視聴した日がカウントされます。連続記録が途切れた場合、24時間以内であれば復旧できます — 月に最大3回まで。",
    restoresLeft: (n: number) => `今月の復旧残り回数: 3回中${n}回。`,
    updates: "アップデート",
    appUpdates: "アプリのアップデート",
    updatesExplainer:
      "新バージョンはGitHubリリースとして届きます。アプリは起動時に確認します。ここからも確認できます。",
    checkForUpdates: "アップデートを確認",
    upToDate: "最新バージョンです。",
    couldntCheckUpdates: "アップデートを確認できませんでした — 後でもう一度お試しください。",
    account: "アカウント",
    appVersion: (version: string) => `Learn Python · バージョン ${version}`,
    language: "言語",
    languageHint: "アプリ全体にすぐに適用されます。",
  },
  update: {
    available: "アップデートがあります",
    versionLine: (version: string, size: string, mandatory: boolean) =>
      `バージョン ${version}${size ? ` · ${size}` : ""}${
        mandatory ? " · 必須" : ""
      }`,
    sizeMB: (bytes: number) => `${(bytes / (1024 * 1024)).toFixed(1)} MB`,
    newVersionAvailable: "Learn Pythonの新しいバージョンが利用可能です。",
    downloading: (percent: number) => `ダウンロード中… ${percent}%`,
    openingInstaller: "インストーラーを開いています…",
    downloadFailed: "アップデートをダウンロードできませんでした。",
    downloadInterrupted: "ダウンロードが中断されました。",
    allowInstallsInSettings: "設定でインストールを許可してください",
    update: "アップデート",
    tryAgain: "もう一度試す",
    later: "後で",
    mandatoryHint: "このアップデートは、アプリを使い続けるために必須です。",
  },
};
