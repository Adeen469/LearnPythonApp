// Merged tutorial translation overlays — generated, see ./<lang>.ts.
// English has no overlays: getTutorialTranslations("en") returns {}
// and every lookup falls back to the English tutorial.

import { TRANSLATIONS as hiRoman } from "./hi-roman";
import { TRANSLATIONS as urRoman } from "./ur-roman";
import { TRANSLATIONS as fr } from "./fr";
import { TRANSLATIONS as ja } from "./ja";
import { TRANSLATIONS as ko } from "./ko";
import { TRANSLATIONS as es } from "./es";
import { TRANSLATIONS as de } from "./de";
import { TRANSLATIONS as pt } from "./pt";
import { TRANSLATIONS as ru } from "./ru";
import { TRANSLATIONS as ar } from "./ar";
import { TRANSLATIONS as zh } from "./zh";
import type { TutorialTranslations } from "../tutorials";
import type { LanguageCode } from "../i18n";

const OVERLAYS: Record<Exclude<LanguageCode, "en">, TutorialTranslations> = {
  "hi-roman": hiRoman,
  "ur-roman": urRoman,
  "fr": fr,
  "ja": ja,
  "ko": ko,
  "es": es,
  "de": de,
  "pt": pt,
  "ru": ru,
  "ar": ar,
  "zh": zh,
};

/** Merged tutorial overlays for a language ({} for English). */
export function getTutorialTranslations(lang: LanguageCode): TutorialTranslations {
  if (lang === "en") return {};
  return OVERLAYS[lang as Exclude<LanguageCode, "en">] ?? {};
}
