// i18n — language provider, the `Strings` type, and title helpers.
//
// English is the source of truth: `Strings` is defined here, `en.ts`
// implements it, and every other language file is typed as `Strings`,
// so TypeScript errors if any key is missing. Dynamic strings are
// functions so each language can apply its own grammar (plurals, word
// order, units) instead of sharing English word order.
//
// Scope: UI chrome ONLY (see en.ts). Content translations live in
// ./titles/<lang>.ts as partial maps with graceful fallback:
//   lessonTitles — keyed by lesson id (`python-day-001` …)
//   videoTitles  — keyed by YouTube videoId
//   roadmapNames — keyed by the English stage/topic/difficulty name
// A missing title falls back to the original English text, so a titles
// map may be partial. The main `Strings` object must stay complete.
//
// No RTL layout flipping in this version (Arabic strings only).

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";
import { en } from "./en";
import { hiRoman } from "./hi-roman";
import { urRoman } from "./ur-roman";
import { fr } from "./fr";
import { ja } from "./ja";
import { ko } from "./ko";
import { es } from "./es";
import { de } from "./de";
import { pt } from "./pt";
import { ru } from "./ru";
import { ar } from "./ar";
import { zh } from "./zh";
import { titles as titlesHiRoman } from "./titles/hi-roman";
import { titles as titlesUrRoman } from "./titles/ur-roman";
import { titles as titlesFr } from "./titles/fr";
import { titles as titlesJa } from "./titles/ja";
import { titles as titlesKo } from "./titles/ko";
import { titles as titlesEs } from "./titles/es";
import { titles as titlesDe } from "./titles/de";
import { titles as titlesPt } from "./titles/pt";
import { titles as titlesRu } from "./titles/ru";
import { titles as titlesAr } from "./titles/ar";
import { titles as titlesZh } from "./titles/zh";

export type LanguageCode =
  | "en"
  | "hi-roman"
  | "ur-roman"
  | "fr"
  | "ja"
  | "ko"
  | "es"
  | "de"
  | "pt"
  | "ru"
  | "ar"
  | "zh";

export interface LanguageInfo {
  code: LanguageCode;
  /** Native name, shown in the picker (e.g. "Français", "日本語"). */
  label: string;
  /** English name, shown under the native label. */
  englishName: string;
}

export const LANGUAGES: LanguageInfo[] = [
  { code: "en", label: "English", englishName: "English" },
  { code: "hi-roman", label: "Hinglish (Roman)", englishName: "Roman Hindi (Hinglish)" },
  { code: "ur-roman", label: "Urdu (Roman)", englishName: "Roman Urdu" },
  { code: "fr", label: "Français", englishName: "French" },
  { code: "ja", label: "日本語", englishName: "Japanese" },
  { code: "ko", label: "한국어", englishName: "Korean" },
  { code: "es", label: "Español", englishName: "Spanish" },
  { code: "de", label: "Deutsch", englishName: "German" },
  { code: "pt", label: "Português", englishName: "Portuguese" },
  { code: "ru", label: "Русский", englishName: "Russian" },
  { code: "ar", label: "العربية", englishName: "Arabic" },
  { code: "zh", label: "简体中文", englishName: "Chinese (Simplified)" },
];

/** The full UI-chrome string set. Every language file must implement all of it. */
export type Strings = {
  common: {
    appName: string;
    signIn: string;
    signOut: string;
    email: string;
    emailPlaceholder: string;
    password: string;
    showPassword: string;
    hidePassword: string;
    genericError: string;
    enterEmailAddress: string;
    checkYourEmail: string;
    sixDigitCodeLabel: string;
    codePlaceholder: string;
    enterSixDigitCode: string;
    backToSignIn: string;
    retry: string;
    goBack: string;
    completed: string;
    watchedPct: (pct: number) => string;
    notStarted: string;
    duration: (totalSeconds: number) => string;
    durationTotal: (totalSeconds: number) => string;
    requestFailed: (status: number) => string;
    send: string;
    roadmap: string;
    settings: string;
    aiTutor: string;
  };
  tabs: {
    learn: string;
    courses: string;
    editor: string;
    profile: string;
  };
  nav: {
    verifyEmail: string;
    lesson: string;
    course: string;
  };
  learn: {
    loadError: string;
    greeting: (firstName: string) => string;
    progressSummary: (totalDone: number) => string;
    streakChip: (n: number) => string;
    continueLabel: string;
    continueTitle: (day: number, lessonTitle: string) => string;
    continueWatched: (pct: number, duration: string) => string;
    allCompleteTitle: string;
    allCompleteSubtitle: string;
    sectionSubtitle: (from: number, to: number, done: number, total: number) => string;
    lessonDay: (n: number) => string;
    statusPlaying: (pct: number) => string;
  };
  courses: {
    intro: string;
    countPlaylists: (n: number) => string;
    countVideos: (n: number) => string;
    countOneShots: (n: number) => string;
  };
  editor: {
    title: string;
    subtitle: string;
    signInNotice: string;
    reload: string;
    loading: string;
  };
  profile: {
    signedOutSubtitle: string;
    createAccountLink: string;
    signedOutInfo: string;
    authBadge: (auth: "google" | "email") => string;
    authBadgeMfa: string;
    statStreakLabel: string;
    statGoalLabel: string;
    statLessonsLabel: string;
    streakHint: string;
  };
  lesson: {
    notesEmpty: string;
    notesHeading: string;
    tutorialSummary: string;
    tutorialPractice: string;
    quizHeading: string;
    quizQuestionOf: (current: number, total: number) => string;
    quizScore: (correct: number, total: number) => string;
    quizPassed: string;
    quizFailed: string;
    quizRetake: string;
    quizNext: string;
    quizSeeResult: string;
    notFound: string;
    markComplete: string;
    completedButton: string;
    askTutor: string;
    saveOffline: string;
    downloading: string;
    downloadingPct: (pct: number) => string;
    removeDownload: string;
    downloadPaused: string;
    downloadFailed: string;
    savedOffline: string;
    prevLesson: string;
    nextLesson: string;
  };
  course: {
    notFound: string;
    closePlayer: string;
    tapPlayToStart: string;
    markAsComplete: string;
    oneShotsHeading: string;
    playlistMeta: (count: number, totalDuration: string, done: number) => string;
    oneShotsMeta: (count: number, totalDuration: string) => string;
    videoRowNumber: (n: number) => string;
  };
  roadmap: {
    topicsComplete: (done: number, total: number) => string;
    stageTopicCount: (n: number) => string;
    topicDone: string;
    topicLesson: string;
    topicMeta: (difficulty: string, minutes: number) => string;
  };
  tutor: {
    modeTutor: string;
    modeExplain: string;
    modeDebug: string;
    modeQuiz: string;
    hintTutor: string;
    hintExplain: string;
    hintDebug: string;
    hintQuiz: string;
    hintLessonSuffix: (hint: string, lessonId: string) => string;
    greetingLesson: string;
    greetingGeneral: string;
    signInGateTitle: string;
    signInGateText: string;
    signInAgain: string;
    errorSessionExpired: string;
    errorGeneric: string;
    groundedBadge: string;
    citation: (citation: string) => string;
    codePlaceholder: string;
    askPlaceholder: string;
  };
  auth: {
    welcomeBack: string;
    signInSubtitle: string;
    continueWithGoogle: string;
    orContinueWithEmail: string;
    passwordPlaceholder: string;
    forgotPassword: string;
    createAccount: string;
    enterEmailAndPassword: string;
    googleNoCode: string;
    signUpSubtitle: string;
    nameLabel: string;
    namePlaceholder: string;
    passwordMinPlaceholder: string;
    verifyCodeNote: string;
    alreadyHaveAccount: string;
    enterName: string;
    passwordMin8: string;
    otpSubtitle: (email: string, purpose: "signup" | "signin") => string;
    verify: string;
    resendCodePrompt: string;
    noEmailToVerify: string;
    noEmailToSendCodeTo: string;
    newCodeSentTo: (email: string) => string;
    forgotPasswordTitle: string;
    forgotSubtitle: string;
    sendResetLink: string;
    resetLinkSentFor: (email: string) => string;
    resetLinkNote: string;
    twoFactorTitle: string;
    twoFactorSubtitle: string;
    verifyAndSignIn: string;
    resendCodeByEmail: string;
    codeSentToEmail: string;
  };
  settings: {
    signedInAs: (email: string) => string;
    appearance: string;
    theme: string;
    themeDark: string;
    themeLight: string;
    darkIsDefault: string;
    dailyGoal: string;
    minutesPerDay: string;
    goalMinutes: (minutes: number) => string;
    streak: string;
    streakCount: (count: number) => string;
    streakExplainer: string;
    restoresLeft: (n: number) => string;
    updates: string;
    appUpdates: string;
    updatesExplainer: string;
    checkForUpdates: string;
    upToDate: string;
    couldntCheckUpdates: string;
    account: string;
    appVersion: (version: string) => string;
    language: string;
    languageHint: string;
  };
  update: {
    available: string;
    versionLine: (version: string, size: string, mandatory: boolean) => string;
    sizeMB: (bytes: number) => string;
    newVersionAvailable: string;
    downloading: (percent: number) => string;
    openingInstaller: string;
    downloadFailed: string;
    downloadInterrupted: string;
    allowInstallsInSettings: string;
    update: string;
    tryAgain: string;
    later: string;
    mandatoryHint: string;
  };
};

/** Partial content-title maps (graceful fallback to the original text). */
export type TitlesMaps = {
  lessonTitles: Record<string, string>;
  videoTitles: Record<string, string>;
  roadmapNames: Record<string, string>;
};

const STRINGS: Record<LanguageCode, Strings> = {
  en,
  "hi-roman": hiRoman,
  "ur-roman": urRoman,
  fr,
  ja,
  ko,
  es,
  de,
  pt,
  ru,
  ar,
  zh,
};

const EMPTY_TITLES: TitlesMaps = {
  lessonTitles: {},
  videoTitles: {},
  roadmapNames: {},
};

const TITLES: Record<LanguageCode, TitlesMaps> = {
  en: EMPTY_TITLES,
  "hi-roman": titlesHiRoman,
  "ur-roman": titlesUrRoman,
  fr: titlesFr,
  ja: titlesJa,
  ko: titlesKo,
  es: titlesEs,
  de: titlesDe,
  pt: titlesPt,
  ru: titlesRu,
  ar: titlesAr,
  zh: titlesZh,
};

const KEY = "lp_language";

function isLanguageCode(code: string): code is LanguageCode {
  return LANGUAGES.some((l) => l.code === code);
}

/** Device locale when it matches a supported language, else English. */
function defaultLanguage(): LanguageCode {
  try {
    const code = Localization.getLocales()[0]?.languageCode ?? null;
    if (code && isLanguageCode(code)) return code;
  } catch {
    // Locale unavailable — fall through to English.
  }
  return "en";
}

interface LanguageContextValue {
  lang: LanguageCode;
  setLang: (lang: LanguageCode) => void;
  t: Strings;
  /** Translated lesson title, or the original title when untranslated. */
  lessonTitle: (id: string, fallback: string) => string;
  /** Translated course video title, or the original title when untranslated. */
  videoTitle: (videoId: string, fallback: string) => string;
  /** Translated roadmap stage/topic/difficulty name, or the English name. */
  roadmapName: (englishName: string) => string;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: "en",
  setLang: () => {},
  t: en,
  lessonTitle: (_id, fallback) => fallback,
  videoTitle: (_videoId, fallback) => fallback,
  roadmapName: (name) => name,
});

// Current strings for non-component code (e.g. api.ts error fallbacks).
// Components must use useLanguage() instead; this is English until the
// provider mounts and resolves the stored language.
let currentStrings: Strings = en;

export function getCurrentStrings(): Strings {
  return currentStrings;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LanguageCode>("en");

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((v) => {
        if (v && isLanguageCode(v)) {
          setLangState(v);
        } else {
          setLangState(defaultLanguage());
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    currentStrings = STRINGS[lang];
  }, [lang]);

  const setLang = useCallback((next: LanguageCode) => {
    setLangState(next);
    AsyncStorage.setItem(KEY, next).catch(() => {});
  }, []);

  const lessonTitle = useCallback(
    (id: string, fallback: string) =>
      TITLES[lang].lessonTitles[id] ?? fallback,
    [lang]
  );

  const videoTitle = useCallback(
    (videoId: string, fallback: string) =>
      TITLES[lang].videoTitles[videoId] ?? fallback,
    [lang]
  );

  const roadmapName = useCallback(
    (englishName: string) => TITLES[lang].roadmapNames[englishName] ?? englishName,
    [lang]
  );

  const value = useMemo(
    () => ({
      lang,
      setLang,
      t: STRINGS[lang],
      lessonTitle,
      videoTitle,
      roadmapName,
    }),
    [lang, setLang, lessonTitle, videoTitle, roadmapName]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  return useContext(LanguageContext);
}
