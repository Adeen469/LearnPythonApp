// Roadmap — the muted timeline-rail roadmap from ROADMAP_STAGES
// (29 topics, 6 stages). A topic shows its completion state from
// the mapped lesson's progress; tapping it opens that lesson, or
// Courses when no lesson matches. No 3D, no saturated gradients.
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import { fetchLessons } from "../lib/api";
import { loadProgress, type ProgressState } from "../lib/progress";
import {
  ROADMAP_STAGES,
  type RoadmapTopic,
} from "../lib/roadmap-data";
import { useTheme } from "../lib/theme-context";
import { useLanguage } from "../lib/i18n";
import { fontSize, radius, spacing } from "../lib/theme";
import type { Lesson } from "../lib/types";

// ---------------------------------------------------------------------------
// learnSlug -> lesson. Roadmap topics are W3Schools-style tutorial
// pages ("Python For Loops"), lessons are Day videos ("For Loop in
// Python | Python Tutorial - Day #17"). Match on shared title words
// (light stemming, prefix-tolerant); no match -> Courses.
// ---------------------------------------------------------------------------

function stem(word: string): string {
  return word.length > 3 && word.endsWith("s") ? word.slice(0, -1) : word;
}

function topicKeywords(topic: RoadmapTopic): string[] {
  const fromTitle = topic.title.replace(/^python\s+/i, "");
  const fromSlug = (topic.learnSlug ?? "")
    .replace(/^python-/, "")
    .replace(/-/g, " ");
  const words = new Set<string>();
  for (const phrase of [fromTitle, fromSlug]) {
    for (const w of phrase.toLowerCase().split(/[^a-z0-9]+/)) {
      if (w.length > 2) words.add(stem(w));
    }
  }
  return [...words];
}

function findLessonForTopic(
  topic: RoadmapTopic,
  lessons: Lesson[]
): Lesson | null {
  if (!topic.learnSlug) return null;
  const keys = topicKeywords(topic);
  if (keys.length === 0) return null;
  let best: Lesson | null = null;
  let bestScore = 0;
  for (const lesson of lessons) {
    const titleWords = lesson.title
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .map(stem);
    let score = 0;
    for (const key of keys) {
      if (
        titleWords.some((w) => w.startsWith(key) || key.startsWith(w))
      ) {
        score++;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      best = lesson;
    }
  }
  if (best && bestScore >= Math.max(1, Math.ceil(keys.length / 2))) {
    return best;
  }
  return null;
}

export default function RoadmapScreen() {
  const { theme } = useTheme();
  const { t, roadmapName } = useLanguage();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [progress, setProgress] = useState<ProgressState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    fetchLessons()
      .then((ls) => {
        if (alive) setLessons(ls);
      })
      .catch(() => {})
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

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

  const completed = useMemo(
    () => new Set(progress?.completedLessonIds ?? []),
    [progress]
  );

  const mapping = useMemo(() => {
    const m = new Map<string, Lesson | null>();
    for (const stage of ROADMAP_STAGES) {
      for (const topic of stage.topics) {
        m.set(topic.id, findLessonForTopic(topic, lessons));
      }
    }
    return m;
  }, [lessons]);

  const totalTopics = ROADMAP_STAGES.reduce(
    (n, s) => n + s.topics.length,
    0
  );
  const doneTopics = ROADMAP_STAGES.reduce(
    (n, s) =>
      n +
      s.topics.filter((t) => {
        const lesson = mapping.get(t.id);
        return lesson ? completed.has(lesson.id) : false;
      }).length,
    0
  );

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator color={theme.text} />
      </View>
    );
  }

  return (
    <ScrollView
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={{ padding: spacing.md, paddingBottom: 32 }}
    >
      <Text style={[styles.title, { color: theme.text }]}>{t.common.roadmap}</Text>
      <Text style={[styles.sub, { color: theme.textMuted }]}>
        {t.roadmap.topicsComplete(doneTopics, totalTopics)}
      </Text>

      {ROADMAP_STAGES.map((stage) => (
        <View key={stage.id} style={{ marginTop: spacing.lg }}>
          <Text style={[styles.stageTitle, { color: theme.text }]}>
            {roadmapName(stage.title)}
          </Text>
          <Text style={[styles.stageSub, { color: theme.textMuted }]}>
            {t.roadmap.stageTopicCount(stage.topics.length)}
          </Text>

          <View style={styles.rail}>
            <View
              style={[styles.railLine, { backgroundColor: theme.border }]}
            />
            {stage.topics.map((topic) => {
              const lesson = mapping.get(topic.id) ?? null;
              const done = lesson ? completed.has(lesson.id) : false;
              return (
                <Pressable
                  key={topic.id}
                  style={styles.topicRow}
                  onPress={() => {
                    if (lesson) router.push(`/lesson/${lesson.id}`);
                    else router.push("/courses");
                  }}
                >
                  <View style={styles.dotWrap}>
                    <View
                      style={[
                        styles.dot,
                        {
                          backgroundColor: done
                            ? theme.success
                            : theme.background,
                          borderColor: done ? theme.success : theme.textMuted,
                        },
                      ]}
                    />
                  </View>
                  <View
                    style={[
                      styles.topicCard,
                      {
                        backgroundColor: theme.surface,
                        borderColor: theme.border,
                      },
                    ]}
                  >
                    <View style={styles.topicHead}>
                      <Text
                        style={[styles.topicTitle, { color: theme.text }]}
                      >
                        {roadmapName(topic.title)}
                      </Text>
                      <Text
                        style={{
                          color: done ? theme.success : theme.textMuted,
                          fontSize: fontSize.xs,
                          fontWeight: "700",
                        }}
                      >
                        {done
                          ? t.roadmap.topicDone
                          : lesson
                            ? t.roadmap.topicLesson
                            : t.tabs.courses}
                      </Text>
                    </View>
                    <Text
                      style={[styles.topicMeta, { color: theme.textMuted }]}
                    >
                      {t.roadmap.topicMeta(
                        roadmapName(topic.difficulty),
                        topic.estimatedMinutes
                      )}
                    </Text>
                    <Text
                      style={[styles.topicBlurb, { color: theme.textSecondary }]}
                    >
                      {topic.blurb}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: fontSize.xxl, fontWeight: "700" },
  sub: { fontSize: fontSize.sm, marginTop: 4 },
  stageTitle: { fontSize: fontSize.lg, fontWeight: "700" },
  stageSub: { fontSize: fontSize.xs, marginTop: 2 },
  rail: { position: "relative", marginTop: spacing.md },
  railLine: {
    position: "absolute",
    left: 10,
    top: 12,
    bottom: 12,
    width: 2,
  },
  topicRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: spacing.sm,
  },
  dotWrap: {
    width: 22,
    alignItems: "center",
    paddingTop: 16,
    zIndex: 1,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
  },
  topicCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: 4,
  },
  topicHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.sm,
  },
  topicTitle: { fontSize: fontSize.md, fontWeight: "600", flex: 1 },
  topicMeta: { fontSize: fontSize.xs },
  topicBlurb: { fontSize: fontSize.sm },
});
