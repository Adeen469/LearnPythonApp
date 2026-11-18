// Lesson detail — VIDEO first, then NOTES, then QUIZ.
// Video: expo-video (useVideoPlayer + VideoView, 16:9, native
// controls). Watch percent is saved to progress.ts; at >=95% the
// lesson is marked complete. Notes are rendered by a small local
// Markdown renderer (no library installed). Quiz: one question at a
// time, 70%+ to pass, never gates anything. Save Offline downloads
// the stream with the new expo-file-system API and plays the local
// file next time.
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Link, router, useLocalSearchParams } from "expo-router";
import { useEvent } from "expo";
import { useVideoPlayer, VideoView } from "expo-video";
import { Directory, File, Paths } from "expo-file-system";
import { fetchLessons, videoUrl } from "../../lib/api";
import {
  loadProgress,
  saveProgress,
  todayKey,
  type ProgressState,
} from "../../lib/progress";
import { useTheme } from "../../lib/theme-context";
import { useLanguage } from "../../lib/i18n";
import { tutorialSlugForLesson } from "../../lib/lesson-tutorials";
import {
  getLocalizedTutorial,
  type LearnTutorial,
} from "../../lib/tutorials";
import { fontSize, radius, spacing, type AppTheme } from "../../lib/theme";
import type { Lesson, QuizQuestion } from "../../lib/types";

const COMPLETE_AT_PCT = 95;
const QUIZ_PASS = 0.7;

/** Streak rule (mirrors the website): a day counts when any lesson
 * is completed or watched. */
function touchActivity(p: ProgressState): ProgressState {
  const today = todayKey();
  if (p.lastActiveDay === today) return p;
  const yesterday = todayKey(new Date(Date.now() - 86_400_000));
  const streak = p.lastActiveDay === yesterday ? p.streakCount + 1 : 1;
  return { ...p, lastActiveDay: today, streakCount: streak };
}

// ---------------------------------------------------------------------------
// Video — a child component so useVideoPlayer always gets a final
// (stream or local) source. Keyed by source so an offline download
// swaps the player to the local file.
// ---------------------------------------------------------------------------

function LessonVideo({
  source,
  onProgress,
}: {
  source: string;
  onProgress: (pct: number) => void;
}) {
  const player = useVideoPlayer(source, (p) => {
    p.timeUpdateEventInterval = 1;
  });
  const timeUpdate = useEvent(player, "timeUpdate", {
    currentTime: 0,
    currentLiveTimestamp: null,
    currentOffsetFromLive: null,
    bufferedPosition: 0,
  });

  useEffect(() => {
    const duration = player.duration;
    if (duration > 0) {
      onProgress(
        Math.min(100, (timeUpdate.currentTime / duration) * 100)
      );
    }
  }, [timeUpdate, player, onProgress]);

  return (
    <VideoView
      player={player}
      nativeControls
      contentFit="contain"
      style={styles.video}
    />
  );
}

// ---------------------------------------------------------------------------
// Tutorial — the written lesson, bundled in the app (see
// src/lib/tutorials.ts). Rendered below the video, same structure as
// the website's lesson page: title, intro, blocks (heading / para /
// code / list / note / tip), then a Summary + Practice card. Shown in
// the user's language when a translation overlay exists, English
// otherwise. Code blocks are never translated.
// ---------------------------------------------------------------------------

function TutorialSection({
  tutorial,
  theme,
}: {
  tutorial: LearnTutorial;
  theme: AppTheme;
}) {
  const { t } = useLanguage();
  return (
    <View style={{ gap: spacing.md }}>
      <Text
        style={{
          color: theme.text,
          fontSize: fontSize.lg,
          fontWeight: "700",
        }}
      >
        {tutorial.title}
      </Text>
      <Text
        style={{
          color: theme.textSecondary,
          fontSize: fontSize.sm,
          lineHeight: 22,
        }}
      >
        {tutorial.intro}
      </Text>
      {tutorial.blocks.map((block, bi) => {
        if (block.type === "heading") {
          return (
            <Text
              key={bi}
              style={{
                color: theme.text,
                fontSize: fontSize.md,
                fontWeight: "700",
                marginTop: spacing.sm,
              }}
            >
              {block.text}
            </Text>
          );
        }
        if (block.type === "code") {
          return (
            <View
              key={bi}
              style={{
                backgroundColor: theme.surface2,
                borderRadius: radius.sm,
                padding: spacing.sm,
                gap: spacing.xs,
              }}
            >
              {block.title ? (
                <Text
                  style={{
                    color: theme.textMuted,
                    fontSize: fontSize.xs,
                    fontWeight: "600",
                  }}
                >
                  {block.title}
                </Text>
              ) : null}
              <Text
                style={{
                  fontFamily: "monospace",
                  fontSize: fontSize.sm,
                  color: theme.text,
                }}
              >
                {block.code}
              </Text>
              {block.output !== undefined ? (
                <View
                  style={{
                    borderTopWidth: 1,
                    borderTopColor: theme.border,
                    paddingTop: spacing.xs,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "monospace",
                      fontSize: fontSize.sm,
                      color: theme.success,
                    }}
                  >
                    {block.output}
                  </Text>
                </View>
              ) : null}
            </View>
          );
        }
        if (block.type === "list") {
          return (
            <View key={bi} style={{ gap: 4 }}>
              {block.items.map((item, ii) => (
                <Text
                  key={ii}
                  style={{
                    color: theme.textSecondary,
                    fontSize: fontSize.sm,
                    lineHeight: 20,
                  }}
                >
                  • {item}
                </Text>
              ))}
            </View>
          );
        }
        if (block.type === "note") {
          return (
            <View
              key={bi}
              style={{
                borderWidth: 1,
                borderColor: theme.warning,
                borderRadius: radius.sm,
                padding: spacing.sm,
                backgroundColor: theme.surface,
              }}
            >
              <Text
                style={{
                  color: theme.textSecondary,
                  fontSize: fontSize.sm,
                  lineHeight: 20,
                }}
              >
                {block.text}
              </Text>
            </View>
          );
        }
        if (block.type === "tip") {
          return (
            <View
              key={bi}
              style={{
                borderWidth: 1,
                borderColor: theme.info,
                borderRadius: radius.sm,
                padding: spacing.sm,
                backgroundColor: theme.surface,
              }}
            >
              <Text
                style={{
                  color: theme.textSecondary,
                  fontSize: fontSize.sm,
                  lineHeight: 20,
                }}
              >
                {block.text}
              </Text>
            </View>
          );
        }
        return (
          <Text
            key={bi}
            style={{
              color: theme.textSecondary,
              fontSize: fontSize.sm,
              lineHeight: 22,
            }}
          >
            {block.text}
          </Text>
        );
      })}
      <View
        style={{
          borderWidth: 1,
          borderColor: theme.border,
          borderRadius: radius.md,
          backgroundColor: theme.surface,
          padding: spacing.md,
          gap: spacing.sm,
        }}
      >
        <Text
          style={{
            color: theme.text,
            fontSize: fontSize.md,
            fontWeight: "700",
          }}
        >
          {t.lesson.tutorialSummary}
        </Text>
        <View style={{ gap: 4 }}>
          {tutorial.summary.map((line, i) => (
            <Text
              key={i}
              style={{
                color: theme.textSecondary,
                fontSize: fontSize.sm,
                lineHeight: 20,
              }}
            >
              <Text style={{ color: theme.success }}>✓ </Text>
              {line}
            </Text>
          ))}
        </View>
        <Text
          style={{
            color: theme.text,
            fontSize: fontSize.md,
            fontWeight: "700",
            marginTop: spacing.sm,
          }}
        >
          {t.lesson.tutorialPractice}
        </Text>
        <View style={{ gap: 4 }}>
          {tutorial.practice.map((task, i) => (
            <Text
              key={i}
              style={{
                color: theme.textSecondary,
                fontSize: fontSize.sm,
                lineHeight: 20,
              }}
            >
              {i + 1}. {task}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Quiz — one question at a time. 70%+ passes; passing never gates
// anything, it just shows the badge.
// ---------------------------------------------------------------------------

function QuizSection({ quiz, theme }: { quiz: QuizQuestion[]; theme: AppTheme }) {
  const { t } = useLanguage();
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);
  const [finished, setFinished] = useState(false);

  if (quiz.length === 0) return null;
  const total = quiz.length;
  const q = quiz[Math.min(index, total - 1)];
  const passed = finished && correct / total >= QUIZ_PASS;

  if (finished) {
    return (
      <View style={{ gap: spacing.sm }}>
        <Text style={{ color: theme.text, fontSize: fontSize.md, fontWeight: "600" }}>
          {t.lesson.quizScore(correct, total)}
        </Text>
        {passed ? (
          <Text style={{ color: theme.success, fontWeight: "700" }}>
            {t.lesson.quizPassed}
          </Text>
        ) : (
          <Text style={{ color: theme.warning }}>
            {t.lesson.quizFailed}
          </Text>
        )}
        <Pressable
          style={[styles.smallButton, { borderColor: theme.border }]}
          onPress={() => {
            setIndex(0);
            setPicked(null);
            setCorrect(0);
            setFinished(false);
          }}
        >
          <Text style={{ color: theme.text }}>{t.lesson.quizRetake}</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={{ gap: spacing.sm }}>
      <Text style={{ color: theme.textMuted, fontSize: fontSize.xs }}>
        {t.lesson.quizQuestionOf(index + 1, total)}
      </Text>
      <Text style={{ color: theme.text, fontSize: fontSize.md, fontWeight: "600" }}>
        {q.question}
      </Text>
      {q.options.map((option, oi) => {
        const isPicked = picked === oi;
        const isAnswer = oi === q.answer;
        const bg = !isPicked
          ? theme.surface
          : isAnswer
            ? theme.success
            : theme.danger;
        return (
          <Pressable
            key={oi}
            disabled={picked !== null}
            onPress={() => {
              setPicked(oi);
              if (oi === q.answer) setCorrect((c) => c + 1);
            }}
            style={[
              styles.option,
              { backgroundColor: bg, borderColor: theme.border },
              picked !== null && !isPicked && !isAnswer ? { opacity: 0.6 } : null,
            ]}
          >
            <Text style={{ color: theme.text, fontSize: fontSize.sm }}>
              {option}
            </Text>
          </Pressable>
        );
      })}
      {picked !== null && (
        <Pressable
          style={[styles.smallButton, { borderColor: theme.border }]}
          onPress={() => {
            if (index + 1 >= total) {
              setFinished(true);
            } else {
              setIndex((i) => i + 1);
              setPicked(null);
            }
          }}
        >
          <Text style={{ color: theme.text }}>
            {index + 1 >= total ? t.lesson.quizSeeResult : t.lesson.quizNext}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------

export default function LessonScreen() {
  const { theme } = useTheme();
  const { t, lessonTitle, lang } = useLanguage();
  const params = useLocalSearchParams<{ id: string }>();
  const rawId = params.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [progress, setProgress] = useState<ProgressState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [offlineSaved, setOfflineSaved] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [dlProgress, setDlProgress] = useState<number | null>(null);
  const [dlError, setDlError] = useState<string | null>(null);

  const progressRef = useRef<ProgressState | null>(null);
  const lastSavedPctRef = useRef(0);

  const lesson = useMemo(
    () => lessons.find((l) => l.id === id) ?? null,
    [lessons, id]
  );

  // Written lesson for this lesson (bundled tutorial, localised when a
  // translation overlay exists, English otherwise). Null when the
  // lesson has no tutorial — the notes section then shows the empty
  // text instead of a wrong tutorial.
  const tutorial = useMemo(() => {
    const slug = tutorialSlugForLesson(lesson?.id ?? "");
    if (!slug) return null;
    return getLocalizedTutorial(slug, lang);
  }, [lesson, lang]);

  const offlineFile = useMemo(
    () => new File(Paths.document, "offline", `${id}.mp4`),
    [id]
  );

  // Offline state follows the current lesson: when the lesson changes
  // (a new offlineFile), reset the download state to match the new
  // file. This is the render-time adjustment pattern — the reset
  // happens during render, guarded by the previous file, instead of
  // syncing state inside an effect.
  const [prevOfflineFile, setPrevOfflineFile] = useState(offlineFile);
  if (offlineFile !== prevOfflineFile) {
    setPrevOfflineFile(offlineFile);
    setOfflineSaved(offlineFile.exists);
    setDownloading(false);
    setDlProgress(null);
    setDlError(null);
  }

  // The video source is derived, not synced state: the offline file
  // when saved, otherwise the stream URL. It recomputes whenever the
  // lesson or the offline state changes.
  const videoSource = lesson
    ? offlineSaved
      ? offlineFile.uri
      : videoUrl(lesson.id)
    : null;

  useEffect(() => {
    let alive = true;
    loadProgress().then((p) => {
      if (!alive) return;
      progressRef.current = p;
      lastSavedPctRef.current = p.watchPct[id] ?? 0;
      setProgress(p);
    });
    fetchLessons()
      .then((ls) => {
        if (alive) setLessons(ls);
      })
      .catch((e: Error) => {
        if (alive) setError(e.message);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
      if (progressRef.current) void saveProgress(progressRef.current);
    };
  }, [id]);

  // (The offline reset and video source are derived above, next to
  // the offlineFile memo — no syncing effects here.)

  const handleProgress = useCallback(
    (pct: number) => {
      const p = progressRef.current;
      if (!p || !lesson) return;
      const lid = lesson.id;
      const prev = p.watchPct[lid] ?? 0;
      const next = Math.max(prev, Math.floor(pct));
      const newlyComplete =
        next >= COMPLETE_AT_PCT && !p.completedLessonIds.includes(lid);
      if (next === prev && !newlyComplete) return;
      p.watchPct[lid] = next;
      if (newlyComplete) {
        p.completedLessonIds = [...p.completedLessonIds, lid];
      }
      const touched = touchActivity(p);
      progressRef.current = touched;
      if (next - lastSavedPctRef.current >= 5 || next >= COMPLETE_AT_PCT) {
        lastSavedPctRef.current = next;
        void saveProgress(touched);
      }
      setProgress({ ...touched });
    },
    [lesson]
  );

  const markComplete = useCallback(() => {
    const p = progressRef.current;
    if (!p || !lesson) return;
    if (p.completedLessonIds.includes(lesson.id)) return;
    const next = touchActivity({
      ...p,
      completedLessonIds: [...p.completedLessonIds, lesson.id],
      watchPct: { ...p.watchPct, [lesson.id]: 100 },
    });
    progressRef.current = next;
    lastSavedPctRef.current = 100;
    void saveProgress(next);
    setProgress({ ...next });
  }, [lesson]);

  const downloadOffline = useCallback(async () => {
    if (!lesson || downloading) return;
    setDlError(null);
    setDownloading(true);
    setDlProgress(0);
    try {
      const dir = new Directory(Paths.document, "offline");
      if (!dir.exists) dir.create();
      const task = File.createDownloadTask(videoUrl(lesson.id), offlineFile);
      const sub = task.addListener("progress", (data) => {
        if (data.totalBytes > 0) {
          setDlProgress(data.bytesWritten / data.totalBytes);
        }
      });
      let result: File | null;
      try {
        result = await task.downloadAsync();
      } finally {
        sub.remove();
      }
      if (result) {
        setOfflineSaved(true);
        setDlProgress(null);
      } else {
        setDlError(t.lesson.downloadPaused);
        setDlProgress(null);
      }
    } catch (e) {
      setDlError(e instanceof Error ? e.message : t.lesson.downloadFailed);
      setDlProgress(null);
    } finally {
      setDownloading(false);
    }
  }, [lesson, downloading, offlineFile, t]);

  const removeOffline = useCallback(() => {
    try {
      offlineFile.delete();
    } catch {
      // Already gone.
    }
    setOfflineSaved(false);
  }, [offlineFile]);

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator color={theme.text} />
      </View>
    );
  }

  if (error || !lesson) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.danger, textAlign: "center" }}>
          {error ?? t.lesson.notFound}
        </Text>
        <Pressable
          style={[styles.smallButton, { borderColor: theme.border, marginTop: spacing.md }]}
          onPress={() => router.back()}
        >
          <Text style={{ color: theme.text }}>{t.common.goBack}</Text>
        </Pressable>
      </View>
    );
  }

  const index = lessons.findIndex((l) => l.id === lesson.id);
  const prev = index > 0 ? lessons[index - 1] : null;
  const next =
    index >= 0 && index < lessons.length - 1 ? lessons[index + 1] : null;
  const isComplete = progress?.completedLessonIds.includes(lesson.id) ?? false;
  const pct = progress?.watchPct[lesson.id] ?? 0;

  return (
    <ScrollView
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={{ paddingBottom: 32 }}
    >
      {videoSource ? (
        <LessonVideo
          key={videoSource}
          source={videoSource}
          onProgress={handleProgress}
        />
      ) : (
        <View style={[styles.video, styles.videoFallback]}>
          <ActivityIndicator color={theme.text} />
        </View>
      )}

      <View style={{ padding: spacing.md, gap: spacing.lg }}>
        <View>
          <Text style={[styles.title, { color: theme.text }]}>
            {lessonTitle(lesson.id, lesson.title)}
          </Text>
          <Text style={[styles.meta, { color: theme.textMuted }]}>
            {lesson.moduleTitle} · {t.common.duration(lesson.durationSeconds)}
            {offlineSaved ? ` · ${t.lesson.savedOffline}` : ""}
          </Text>
          <View
            style={[
              styles.progressTrack,
              { backgroundColor: theme.surface2 },
            ]}
          >
            <View
              style={[
                styles.progressFill,
                {
                  width: `${Math.min(100, pct)}%`,
                  backgroundColor: theme.success,
                },
              ]}
            />
          </View>
          <Text style={[styles.meta, { color: theme.textMuted }]}>
            {isComplete
              ? t.common.completed
              : pct > 0
                ? t.common.watchedPct(pct)
                : t.common.notStarted}
          </Text>
        </View>

        <View style={styles.actionRow}>
          <Pressable
            style={[
              styles.actionButton,
              { backgroundColor: theme.surface2, borderColor: theme.border },
            ]}
            onPress={markComplete}
            disabled={isComplete}
          >
            <Text style={{ color: theme.text }}>
              {isComplete ? t.lesson.completedButton : t.lesson.markComplete}
            </Text>
          </Pressable>
          <Link href={`/tutor?lessonId=${lesson.id}`} asChild>
            <Pressable
              style={[
                styles.actionButton,
                { backgroundColor: theme.surface2, borderColor: theme.border },
              ]}
            >
              <Text style={{ color: theme.text }}>{t.lesson.askTutor}</Text>
            </Pressable>
          </Link>
        </View>

        <View style={styles.actionRow}>
          <Pressable
            style={[
              styles.actionButton,
              { backgroundColor: theme.surface2, borderColor: theme.border },
            ]}
            onPress={offlineSaved ? removeOffline : downloadOffline}
            disabled={downloading}
          >
            <Text style={{ color: theme.text }}>
              {offlineSaved
                ? t.lesson.removeDownload
                : downloading
                  ? dlProgress !== null
                    ? t.lesson.downloadingPct(Math.round(dlProgress * 100))
                    : t.lesson.downloading
                  : t.lesson.saveOffline}
            </Text>
          </Pressable>
        </View>
        {dlError ? (
          <Text style={{ color: theme.danger, fontSize: fontSize.sm }}>
            {dlError}
          </Text>
        ) : null}

        <View>
          {tutorial ? (
            <TutorialSection tutorial={tutorial} theme={theme} />
          ) : (
            <Text style={{ color: theme.textMuted, fontSize: fontSize.sm }}>
              {t.lesson.notesEmpty}
            </Text>
          )}
        </View>

        {lesson.quiz && lesson.quiz.length > 0 && (
          <View>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>{t.lesson.quizHeading}</Text>
            <QuizSection key={lesson.id} quiz={lesson.quiz} theme={theme} />
          </View>
        )}

        <View style={styles.navRow}>
          {prev ? (
            <Pressable
              style={[styles.navButton, { borderColor: theme.border }]}
              onPress={() => router.push(`/lesson/${prev.id}`)}
            >
              <Text style={{ color: theme.text }}>{t.lesson.prevLesson}</Text>
            </Pressable>
          ) : (
            <View style={{ flex: 1 }} />
          )}
          {next ? (
            <Pressable
              style={[styles.navButton, { borderColor: theme.border }]}
              onPress={() => router.push(`/lesson/${next.id}`)}
            >
              <Text style={{ color: theme.text }}>{t.lesson.nextLesson}</Text>
            </Pressable>
          ) : (
            <View style={{ flex: 1 }} />
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 16 },
  video: { width: "100%", aspectRatio: 16 / 9, backgroundColor: "#000000" },
  videoFallback: { alignItems: "center", justifyContent: "center" },
  title: { fontSize: fontSize.lg, fontWeight: "700" },
  meta: { fontSize: fontSize.sm, marginTop: 4 },
  progressTrack: {
    height: 4,
    borderRadius: 2,
    marginTop: spacing.sm,
    overflow: "hidden",
  },
  progressFill: { height: "100%" },
  sectionTitle: {
    fontSize: fontSize.md,
    fontWeight: "700",
    marginBottom: spacing.sm,
  },
  actionRow: { flexDirection: "row", gap: spacing.sm },
  actionButton: {
    flex: 1,
    alignItems: "center",
    borderWidth: 1,
    borderRadius: radius.md,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  smallButton: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  option: {
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  navRow: { flexDirection: "row", gap: spacing.sm },
  navButton: {
    flex: 1,
    alignItems: "center",
    borderWidth: 1,
    borderRadius: radius.md,
    paddingVertical: 12,
  },
});
