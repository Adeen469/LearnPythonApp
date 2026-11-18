// Bundled written lessons (tutorials) — types, lookup, localisation.
//
// The English tutorial data lives in ./tutorials-data.ts (verbatim copy
// of the website's web/src/lib/learn/*.ts, mapped slugs only — see
// ./lesson-tutorials.ts). Translation overlays live in
// ./tutorials-i18n/<lang>.ts (verbatim copies of the website's
// web/src/lib/learn/i18n/<lang>/*.ts, mapped slugs only). Neither file
// is hand-edited: re-copy from the website when it grows.
//
// Localisation follows the website's overlay model exactly (see the
// website's web/src/lib/learn/i18n/index.ts `localizeTutorial`):
// title/intro/prose blocks/summary/practice are replaced from the
// overlay, code blocks are NEVER translated and stay in English, and
// any missing field falls back to the English original. A language
// with no overlay yet (or a tutorial with no overlay) renders in
// English — never a broken screen.

import { TUTORIALS_EN } from "./tutorials-data";
import { getTutorialTranslations } from "./tutorials-i18n";
import type { LanguageCode } from "./i18n";

export type TutorialBlock =
  | { type: "heading"; text: string }
  | { type: "para"; text: string }
  | { type: "code"; code: string; output?: string; title?: string }
  | { type: "list"; items: string[] }
  | { type: "note"; text: string }
  | { type: "tip"; text: string };

export interface LearnTutorial {
  slug: string;
  title: string;
  intro: string;
  blocks: TutorialBlock[];
  /** 3 hands-on tasks for the reader to try in the editor. */
  practice: string[];
  /** 3-5 takeaway lines. */
  summary: string[];
}

/**
 * Translation overlay for one tutorial — same shape as the website's
 * TranslatedTutorial. `blocks` is keyed by the 0-based index of the
 * block in the English `blocks` array; code blocks never appear here.
 */
export interface TranslatedTutorial {
  title?: string;
  intro?: string;
  blocks?: Record<number, { text?: string; items?: string[] }>;
  summary?: string[];
  practice?: string[];
}

export type TutorialTranslations = Record<string, TranslatedTutorial>;

/** English tutorial for a slug, or null when the slug isn't bundled. */
export function getTutorial(slug: string): LearnTutorial | null {
  return TUTORIALS_EN[slug] ?? null;
}

/**
 * Localised copy of a tutorial: title/intro/prose blocks/summary/
 * practice replaced from the overlay, code blocks kept verbatim in
 * English. Any missing field falls back to the English original.
 * Pass no overlay (or undefined) to get the tutorial unchanged.
 * (Port of the website's `localizeTutorial`, same behaviour.)
 */
export function localizeTutorial(
  t: LearnTutorial,
  tr?: TranslatedTutorial
): LearnTutorial {
  if (!tr) return t;
  return {
    ...t,
    title: tr.title ?? t.title,
    intro: tr.intro ?? t.intro,
    blocks: t.blocks.map((b, i) => {
      const tb = tr.blocks?.[i];
      if (!tb || b.type === "code") return b;
      if (b.type === "list") {
        return tb.items !== undefined ? { ...b, items: tb.items } : b;
      }
      return tb.text !== undefined ? { ...b, text: tb.text } : b;
    }),
    summary: tr.summary ?? t.summary,
    practice: tr.practice ?? t.practice,
  };
}

/** Localised tutorial for a slug in a language, or null when not bundled. */
export function getLocalizedTutorial(
  slug: string,
  lang: LanguageCode
): LearnTutorial | null {
  const t = getTutorial(slug);
  if (!t) return null;
  if (lang === "en") return t;
  const overlay = getTutorialTranslations(lang)[slug];
  return localizeTutorial(t, overlay);
}
