// Lesson -> tutorial map: each of the 100 app lessons (python-day-001 …
// python-day-100) to the website tutorial slug that teaches its topic.
//
// Rules used when mapping (see the mapping notes in the report):
// - The tutorial must actually teach the lesson's topic. Parent-topic
//   matches count (e.g. Day 35 for-else -> the For Loops tutorial),
//   but a tutorial that never mentions the lesson's subject does NOT
//   (e.g. Day 45 `if __name__` has no tutorial — the Modules tutorial
//   never mentions `__name__`; Day 51 seek()/tell() has none — the
//   Read Files tutorial never mentions them).
// - Exercise / solution / shoutout lessons have NO tutorial: they
//   practise earlier topics, they don't teach a new one. A lesson
//   with no entry here shows no notes section (graceful fallback),
//   never a wrong tutorial.
// - Several lessons share one tutorial (e.g. all four inheritance
//   lessons -> python-inheritance); that is intended.
//
// Coverage: 59/100 lessons. The 41 unmapped are exercise/solution/
// shoutout lessons (29) and lessons whose topic has no tutorial yet
// (12): Day 2, 19 (break/continue), 29 (docstrings), 42 (enumerate),
// 45 (__name__), 46 (os module), 51 (seek/tell), 53 (map/filter/reduce),
// 71 (dir/__dict__/help), 84 (time module), 85 (CLI utility), 86
// (walrus operator), 87 (shutil), 89 (requests), 92 (function caching),
// 96 (asyncio), 97 (multithreading), 98 (multiprocessing), 100
// (conclusion). When the website writes tutorials for these topics,
// add the entries here and bundle the tutorials in tutorials-data.ts.

export const LESSON_TO_TUTORIAL: Record<string, string> = {
  "python-day-001": "python-intro",
  "python-day-003": "python-modules",
  "python-day-004": "python-getstarted",
  "python-day-005": "python-comments",
  "python-day-006": "python-variables",
  "python-day-009": "python-casting",
  "python-day-010": "python-user-input",
  "python-day-011": "python-strings",
  "python-day-012": "python-strings-slicing",
  "python-day-013": "python-strings-methods",
  "python-day-014": "python-conditions",
  "python-day-016": "python-match",
  "python-day-017": "python-for-loops",
  "python-day-018": "python-while-loops",
  "python-day-020": "python-functions",
  "python-day-021": "python-arguments",
  "python-day-022": "python-lists",
  "python-day-023": "python-lists-methods",
  "python-day-024": "python-tuples",
  "python-day-025": "python-tuples-methods",
  "python-day-028": "python-string-formatting",
  "python-day-030": "python-recursion",
  "python-day-031": "python-sets",
  "python-day-032": "python-sets-methods",
  "python-day-033": "python-dictionaries",
  "python-day-034": "python-dictionaries-methods",
  "python-day-035": "python-for-loops",
  "python-day-036": "python-try-except",
  "python-day-037": "python-try-except",
  "python-day-038": "python-try-except",
  "python-day-041": "python-if-shorthand",
  "python-day-043": "python-virtualenv",
  "python-day-044": "python-modules",
  "python-day-048": "python-scope",
  "python-day-049": "python-file-handling",
  "python-day-050": "python-file-open",
  "python-day-052": "python-lambda",
  "python-day-054": "python-operators-identity",
  "python-day-056": "python-oop",
  "python-day-057": "python-classes",
  "python-day-058": "python-class-init",
  "python-day-059": "python-decorators",
  "python-day-060": "python-class-properties",
  "python-day-061": "python-inheritance",
  "python-day-062": "python-encapsulation",
  "python-day-065": "python-class-methods",
  "python-day-066": "python-classes",
  "python-day-069": "python-class-methods",
  "python-day-070": "python-class-methods",
  "python-day-072": "python-inheritance",
  "python-day-073": "python-magic-methods",
  "python-day-074": "python-polymorphism",
  "python-day-077": "python-magic-methods",
  "python-day-078": "python-inheritance",
  "python-day-079": "python-inheritance",
  "python-day-080": "python-inheritance",
  "python-day-081": "python-inheritance",
  "python-day-091": "python-generators",
  "python-day-095": "python-regex",
};

/** Tutorial slug for a lesson id, or undefined when the lesson has no tutorial. */
export function tutorialSlugForLesson(lessonId: string): string | undefined {
  return LESSON_TO_TUTORIAL[lessonId];
}
