// Learn tab — home: greeting + streak, Continue, the 100 lessons
// grouped by the website's 6 stages, and a Roadmap entry.
//
// Note on grouping: the API returns one moduleTitle ("100 Days of
// Code") for every lesson, so stages come from the website's day
// ranges (Basics 1–19, Functions & Collections 20–30, Data
// Structures & Errors 31–39, Intermediate 40–55, OOP 56–83,
// Advanced & Projects 84–100). SectionList keeps 100 rows fast.
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  SectionList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Link, router, useFocusEffect } from "expo-router";
import { fetchLessons } from "../../lib/api";
import { useAuth } from "../../lib/auth";
import {
  loadProgress,
  type ProgressState,
} from "../../lib/progress";
import { useTheme } from "../../lib/theme-context";
import { fontSize, radius, spacing } from "../../lib/theme";
import type { Lesson } from "../../lib/types";

interface Stage {
  title: string;
  fromDay: number;
  toDay: number;
}

const STAGES: Stage[] = [
  { title: "Basics", fromDay: 1, toDay: 19 },
  { title: "Functions & Collections", fromDay: 20, toDay: 30 },
  { title: "Data Structures & Errors", fromDay: 31, toDay: 39 },
  { title: "Intermediate", fromDay: 40, toDay: 55 },
  { title: "OOP", fromDay: 56, toDay: 83 },
  { title: "Advanced & Projects", fromDay: 84, toDay: 100 },
];

/** "python-day-001" -> 1; falls back to list position. */
function dayNumber(lesson: Lesson, index: number): number {
  const m = /day-(\d+)/i.exec(lesson.id);
  return m ? parseInt(m[1], 10) : index + 1;
}

/** "Intro to X | Python Tutorial - Day #1" -> "Intro to X". */
function shortTitle(title: string): string {
  const first = title.split(" | ")[0];
  return first.trim().length > 0 ? first.trim() : title;
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

interface LessonSection {
  title: string;
  subtitle: string;
  data: Lesson[];
}

export default function LearnScreen() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [progress, setProgress] = useState<ProgressState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      loadProgress().then((p) => {
        if (alive) setProgress(p);
      });
      return () => {
        alive = false;
      };
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      let alive = true;
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
      };
    }, [])
  );

  const completed = useMemo(
    () => new Set(progress?.completedLessonIds ?? []),
    [progress]
  );

  // First lesson not yet completed, in day order.
  const resumeLesson = useMemo(() => {
    const ordered = [...lessons].sort(
      (a, b) => dayNumber(a, 0) - dayNumber(b, 0)
    );
    return ordered.find((l) => !completed.has(l.id)) ?? null;
  }, [lessons, completed]);

  const sections = useMemo<LessonSection[]>(() => {
    if (lessons.length === 0) return [];
    return STAGES.map((stage) => {
      const data = lessons
        .filter((l) => {
          const d = dayNumber(l, 0);
          return d >= stage.fromDay && d <= stage.toDay;
        })
        .sort((a, b) => dayNumber(a, 0) - dayNumber(b, 0));
      const done = data.filter((l) => completed.has(l.id)).length;
      return {
        title: stage.title,
        subtitle: `Days ${stage.fromDay}–${stage.toDay} · ${done}/${data.length} complete`,
        data,
      };
    }).filter((s) => s.data.length > 0);
  }, [lessons, completed]);

  const totalDone = completed.size;
  const firstName = user?.name?.split(" ")[0];

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator color={theme.text} />
      </View>
    );
  }

  if (error && lessons.length === 0) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.danger, textAlign: "center" }}>
          Couldn&apos;t load lessons.{"\n"}
          {error}
        </Text>
        <Pressable
          style={[styles.retryButton, { borderColor: theme.border }]}
          onPress={() => {
            setError(null);
            setLoading(true);
            fetchLessons()
              .then(setLessons)
              .catch((e: Error) => setError(e.message))
              .finally(() => setLoading(false));
          }}
        >
          <Text style={{ color: theme.text }}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  const resumePct = resumeLesson
    ? (progress?.watchPct[resumeLesson.id] ?? 0)
    : 0;

  return (
    <SectionList<Lesson, LessonSection>
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={{ padding: spacing.md, paddingBottom: 32 }}
      sections={sections}
      keyExtractor={(l) => l.id}
      stickySectionHeadersEnabled
      ListHeaderComponent={
        <View style={{ marginBottom: spacing.md }}>
          <Text style={[styles.greeting, { color: theme.text }]}>
            {firstName ? `Hi, ${firstName}` : "Learn Python"}
          </Text>
          <Text style={[styles.sub, { color: theme.textMuted }]}>
            100 Days of Code · {totalDone}/100 lessons complete
          </Text>

          <View style={styles.chipRow}>
            <View
              style={[
                styles.streakChip,
                { backgroundColor: theme.surface2, borderColor: theme.border },
              ]}
            >
              <Text style={{ color: theme.text, fontSize: fontSize.sm }}>
                Streak: {progress?.streakCount ?? 0}{" "}
                {(progress?.streakCount ?? 0) === 1 ? "day" : "days"}
              </Text>
            </View>
            <Pressable
              style={[
                styles.roadmapButton,
                { backgroundColor: theme.surface2, borderColor: theme.border },
              ]}
              onPress={() => router.push("/roadmap")}
            >
              <Text style={{ color: theme.text, fontSize: fontSize.sm }}>
                Roadmap
              </Text>
            </Pressable>
          </View>

          {resumeLesson && (
            <Link href={`/lesson/${resumeLesson.id}`} asChild>
              <Pressable
                style={[
                  styles.continueCard,
                  {
                    backgroundColor: theme.surface,
                    borderColor: theme.border,
                  },
                ]}
              >
                <Text style={[styles.continueLabel, { color: theme.textMuted }]}>
                  Continue where you left off
                </Text>
                <Text style={[styles.continueTitle, { color: theme.text }]}>
                  Day {dayNumber(resumeLesson, 0)} ·{" "}
                  {shortTitle(resumeLesson.title)}
                </Text>
                <Text style={{ color: theme.textSecondary, fontSize: fontSize.sm }}>
                  {resumePct > 0
                    ? `Watched ${resumePct}% · ${formatDuration(resumeLesson.durationSeconds)}`
                    : formatDuration(resumeLesson.durationSeconds)}
                </Text>
              </Pressable>
            </Link>
          )}
          {!resumeLesson && lessons.length > 0 && (
            <View
              style={[
                styles.continueCard,
                { backgroundColor: theme.surface, borderColor: theme.border },
              ]}
            >
              <Text style={[styles.continueTitle, { color: theme.text }]}>
                All 100 lessons complete
              </Text>
              <Text style={{ color: theme.textSecondary, fontSize: fontSize.sm }}>
                Nice work — revisit any lesson below.
              </Text>
            </View>
          )}
        </View>
      }
      renderSectionHeader={({ section }) => (
        <View
          style={[styles.sectionHeader, { backgroundColor: theme.background }]}
        >
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            {section.title}
          </Text>
          <Text style={[styles.sectionSub, { color: theme.textMuted }]}>
            {section.subtitle}
          </Text>
        </View>
      )}
      renderItem={({ item }) => {
        const done = completed.has(item.id);
        const pct = progress?.watchPct[item.id] ?? 0;
        const isResume = resumeLesson?.id === item.id;
        const status = done
          ? "Completed"
          : isResume && pct > 0
            ? `Playing · ${pct}%`
            : pct > 0
              ? `Watched ${pct}%`
              : "Not started";
        const statusColor = done
          ? theme.success
          : pct > 0
            ? theme.textSecondary
            : theme.textMuted;
        return (
          <Link href={`/lesson/${item.id}`} asChild>
            <Pressable
              style={[
                styles.row,
                { backgroundColor: theme.surface, borderColor: theme.border },
              ]}
            >
              <View style={styles.rowMain}>
                <Text style={[styles.rowDay, { color: theme.textMuted }]}>
                  Day {dayNumber(item, 0)}
                </Text>
                <Text
                  style={[styles.rowTitle, { color: theme.text }]}
                  numberOfLines={2}
                >
                  {shortTitle(item.title)}
                </Text>
                <Text style={[styles.rowMeta, { color: theme.textMuted }]}>
                  {formatDuration(item.durationSeconds)}
                </Text>
              </View>
              <Text
                style={[styles.rowStatus, { color: statusColor }]}
                numberOfLines={1}
              >
                {done ? "✓ " : ""}
                {status}
              </Text>
            </Pressable>
          </Link>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 16 },
  greeting: { fontSize: fontSize.xxl, fontWeight: "700" },
  sub: { fontSize: fontSize.sm, marginTop: 4 },
  chipRow: { flexDirection: "row", marginTop: spacing.md, gap: spacing.sm },
  streakChip: {
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  roadmapButton: {
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  continueCard: {
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  continueLabel: { fontSize: fontSize.xs, marginBottom: 4 },
  continueTitle: { fontSize: fontSize.md, fontWeight: "600", marginBottom: 4 },
  sectionHeader: { paddingTop: spacing.lg, paddingBottom: spacing.sm },
  sectionTitle: { fontSize: fontSize.lg, fontWeight: "700" },
  sectionSub: { fontSize: fontSize.xs, marginTop: 2 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  rowMain: { flex: 1, gap: 2 },
  rowDay: { fontSize: fontSize.xs },
  rowTitle: { fontSize: fontSize.md, fontWeight: "600" },
  rowMeta: { fontSize: fontSize.xs },
  rowStatus: { fontSize: fontSize.xs, flexShrink: 0 },
  retryButton: {
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginTop: spacing.md,
  },
});
