// Lesson detail — VIDEO first, then NOTES, then QUIZ.
// Video: expo-video (useVideoPlayer + VideoView, 16:9, native
// controls). Watch percent is saved to progress.ts; at >=95% the
// lesson is marked complete. Notes are rendered by a small local
// Markdown renderer (no library installed). Quiz: one question at a
// time, 70%+ to pass, never gates anything. Save Offline downloads
// the stream with the new expo-file-system API and plays the local
// file next time.
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
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

function formatDuration(totalSeconds: number): string {
  const s = Math.max(0, Math.round(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const mm = String(m).padStart(2, "0");
  const ss = String(sec).padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${m}:${ss}`;
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
// Notes — small local Markdown renderer (headings, code blocks,
// lists, paragraphs, **bold**, `code`). Lines mentioning YouTube are
// dropped: the app never says where videos come from.
// ---------------------------------------------------------------------------

type NoteBlock =
  | { kind: "heading"; level: number; text: string }
  | { kind: "paragraph"; text: string }
  | { kind: "code"; text: string }
  | { kind: "list"; items: string[] };

function parseNotes(raw: string): NoteBlock[] {
  const lines = raw
    .split("\n")
    .map((l) => l.trimEnd())
    .filter((l) => !/youtu\.?be|youtube\.com/i.test(l));
  const blocks: NoteBlock[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.trim() === "") {
      i++;
      continue;
    }
    if (line.trimStart().startsWith("```")) {
      const buf: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trimStart().startsWith("```")) {
        buf.push(lines[i]);
        i++;
      }
      i++; // closing fence
      if (buf.join("").trim().length > 0) {
        blocks.push({ kind: "code", text: buf.join("\n") });
      }
      continue;
    }
    const heading = /^(#{1,3})\s+(.*)$/.exec(line.trimStart());
    if (heading) {
      blocks.push({
        kind: "heading",
        level: heading[1].length,
        text: heading[2].trim(),
      });
      i++;
      continue;
    }
    if (/^[-*]\s+/.test(line.trimStart())) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i].trimStart())) {
        items.push(lines[i].trimStart().replace(/^[-*]\s+/, ""));
        i++;
      }
      blocks.push({ kind: "list", items });
      continue;
    }
    const buf: string[] = [line.trim()];
    i++;
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !lines[i].trimStart().startsWith("```") &&
      !/^(#{1,3})\s+/.test(lines[i].trimStart()) &&
      !/^[-*]\s+/.test(lines[i].trimStart())
    ) {
      buf.push(lines[i].trim());
      i++;
    }
    blocks.push({ kind: "paragraph", text: buf.join(" ") });
  }
  return blocks;
}

function renderInline(
  text: string,
  theme: AppTheme,
  keyPrefix: string
): ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, idx) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return (
        <Text
          key={`${keyPrefix}-${idx}`}
          style={{ fontWeight: "700", color: theme.text }}
        >
          {part.slice(2, -2)}
        </Text>
      );
    }
    if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
      return (
        <Text
          key={`${keyPrefix}-${idx}`}
          style={{
            fontFamily: "monospace",
            backgroundColor: theme.surface2,
            color: theme.text,
          }}
        >
          {part.slice(1, -1)}
        </Text>
      );
    }
    return (
      <Text key={`${keyPrefix}-${idx}`} style={{ color: theme.textSecondary }}>
        {part}
      </Text>
    );
  });
}

function NotesSection({ notes, theme }: { notes: string; theme: AppTheme }) {
  const blocks = useMemo(() => parseNotes(notes), [notes]);
  if (blocks.length === 0) {
    return (
      <Text style={{ color: theme.textMuted, fontSize: fontSize.sm }}>
        No notes for this lesson yet.
      </Text>
    );
  }
  return (
    <View style={{ gap: spacing.sm }}>
      {blocks.map((block, bi) => {
        if (block.kind === "heading") {
          const size =
            block.level === 1
              ? fontSize.lg
              : block.level === 2
                ? fontSize.md
                : fontSize.sm;
          return (
            <Text
              key={bi}
              style={{ color: theme.text, fontSize: size, fontWeight: "700" }}
            >
              {renderInline(block.text, theme, `h${bi}`)}
            </Text>
          );
        }
        if (block.kind === "code") {
          return (
            <View
              key={bi}
              style={{
                backgroundColor: theme.surface2,
                borderRadius: radius.sm,
                padding: spacing.sm,
              }}
            >
              <Text
                style={{
                  fontFamily: "monospace",
                  fontSize: fontSize.sm,
                  color: theme.text,
                }}
              >
                {block.text}
              </Text>
            </View>
          );
        }
        if (block.kind === "list") {
          return (
            <View key={bi} style={{ gap: 4 }}>
              {block.items.map((item, ii) => (
                <Text
                  key={ii}
                  style={{ color: theme.textSecondary, fontSize: fontSize.sm }}
                >
                  • {renderInline(item, theme, `li${bi}-${ii}`)}
                </Text>
              ))}
            </View>
          );
        }
        return (
          <Text
            key={bi}
            style={{ color: theme.textSecondary, fontSize: fontSize.sm }}
          >
            {renderInline(block.text, theme, `p${bi}`)}
          </Text>
        );
      })}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Quiz — one question at a time. 70%+ passes; passing never gates
// anything, it just shows the badge.
// ---------------------------------------------------------------------------

function QuizSection({ quiz, theme }: { quiz: QuizQuestion[]; theme: AppTheme }) {
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
          Your score: {correct}/{total} ({Math.round((correct / total) * 100)}
          %)
        </Text>
        {passed ? (
          <Text style={{ color: theme.success, fontWeight: "700" }}>
            ✓ Test passed
          </Text>
        ) : (
          <Text style={{ color: theme.warning }}>
            Not quite — 70% or more passes. Try again.
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
          <Text style={{ color: theme.text }}>Retake quiz</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={{ gap: spacing.sm }}>
      <Text style={{ color: theme.textMuted, fontSize: fontSize.xs }}>
        Question {index + 1} of {total}
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
            {index + 1 >= total ? "See result" : "Next question"}
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
        setDlError("Download paused — tap again to retry.");
        setDlProgress(null);
      }
    } catch (e) {
      setDlError(e instanceof Error ? e.message : "Download failed.");
      setDlProgress(null);
    } finally {
      setDownloading(false);
    }
  }, [lesson, downloading, offlineFile]);

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
          {error ?? "Lesson not found."}
        </Text>
        <Pressable
          style={[styles.smallButton, { borderColor: theme.border, marginTop: spacing.md }]}
          onPress={() => router.back()}
        >
          <Text style={{ color: theme.text }}>Go back</Text>
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
            {lesson.title}
          </Text>
          <Text style={[styles.meta, { color: theme.textMuted }]}>
            {lesson.moduleTitle} · {formatDuration(lesson.durationSeconds)}
            {offlineSaved ? " · Saved offline" : ""}
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
              ? "Completed"
              : pct > 0
                ? `Watched ${pct}%`
                : "Not started"}
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
              {isComplete ? "✓ Completed" : "Mark complete"}
            </Text>
          </Pressable>
          <Link href={`/tutor?lessonId=${lesson.id}`} asChild>
            <Pressable
              style={[
                styles.actionButton,
                { backgroundColor: theme.surface2, borderColor: theme.border },
              ]}
            >
              <Text style={{ color: theme.text }}>Ask AI Tutor</Text>
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
                ? "Remove download"
                : downloading
                  ? dlProgress !== null
                    ? `Downloading ${Math.round(dlProgress * 100)}%`
                    : "Downloading…"
                  : "Save Offline"}
            </Text>
          </Pressable>
        </View>
        {dlError ? (
          <Text style={{ color: theme.danger, fontSize: fontSize.sm }}>
            {dlError}
          </Text>
        ) : null}

        <View>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Notes</Text>
          <NotesSection notes={lesson.notes} theme={theme} />
        </View>

        {lesson.quiz && lesson.quiz.length > 0 && (
          <View>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Quiz</Text>
            <QuizSection key={lesson.id} quiz={lesson.quiz} theme={theme} />
          </View>
        )}

        <View style={styles.navRow}>
          {prev ? (
            <Pressable
              style={[styles.navButton, { borderColor: theme.border }]}
              onPress={() => router.push(`/lesson/${prev.id}`)}
            >
              <Text style={{ color: theme.text }}>← Prev</Text>
            </Pressable>
          ) : (
            <View style={{ flex: 1 }} />
          )}
          {next ? (
            <Pressable
              style={[styles.navButton, { borderColor: theme.border }]}
              onPress={() => router.push(`/lesson/${next.id}`)}
            >
              <Text style={{ color: theme.text }}>Next →</Text>
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
