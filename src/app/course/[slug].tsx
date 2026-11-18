// Course detail — creator header, playlists + one-shots, inline player.
// Param: slug. A video with megaLessonId plays from
// /api/video/[megaLessonId] (expo-video); without it, the embed plays
// in a WebView (temporary stand-in until a MEGA/Drive link exists for
// that video). Progress is local (progress.ts); 95% watched = completed.
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type ScrollViewInstance,
} from "react-native";
import { Stack, useFocusEffect, useLocalSearchParams } from "expo-router";
import { WebView } from "react-native-webview";
import { Ionicons } from "@expo/vector-icons";
import { useVideoPlayer, VideoView } from "expo-video";
import { videoUrl } from "../../lib/api";
import {
  COURSE_CREATORS,
  type CoursePlaylist,
  type CourseVideo,
} from "../../lib/courses-data";
import {
  emptyProgress,
  loadProgress,
  saveProgress,
  type ProgressState,
} from "../../lib/progress";
import { useTheme } from "../../lib/theme-context";

/** Progress key for a course video: the MEGA lesson id when it has one. */
function videoKey(video: CourseVideo): string {
  return video.megaLessonId ?? video.videoId;
}

/** Seconds -> "11:50" or "11:52:24". Empty when unknown. */
function formatHms(totalSeconds?: number): string {
  if (totalSeconds == null) return "";
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const mm = String(m).padStart(2, "0");
  const ss = String(sec).padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${m}:${ss}`;
}

/** Seconds -> "12h 34m" (or "45m" under an hour). */
function formatTotal(totalSeconds: number): string {
  const totalMinutes = Math.floor(totalSeconds / 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function playlistSeconds(playlist: CoursePlaylist): number {
  return playlist.videos.reduce((n, v) => n + (v.durationSeconds ?? 0), 0);
}

// ---------------------------------------------------------------------------
// expo-video player for MEGA/Drive videos. Mounted with key={videoKey}
// so switching videos remounts a fresh player for the new source.
// ---------------------------------------------------------------------------

function MegaPlayer({
  uri,
  videoKey: key,
  onWatchProgress,
}: {
  uri: string;
  videoKey: string;
  onWatchProgress: (key: string, pct: number) => void;
}) {
  const player = useVideoPlayer(uri, (p) => {
    p.timeUpdateEventInterval = 1;
    p.play();
  });
  const savedPctRef = useRef(0);
  const latestPctRef = useRef(0);

  useEffect(() => {
    const sub = player.addListener("timeUpdate", ({ currentTime }) => {
      const duration = player.duration;
      if (!duration || duration <= 0) return;
      const pct = Math.min(100, Math.round((currentTime / duration) * 100));
      latestPctRef.current = Math.max(latestPctRef.current, pct);
      if (pct - savedPctRef.current >= 5 || pct >= 95) {
        savedPctRef.current = pct;
        onWatchProgress(key, pct);
      }
    });
    return () => {
      sub.remove();
      // Persist the last seen percent so progress isn't lost between
      // the 5% saves (e.g. the user closes the video at 93%).
      if (latestPctRef.current > savedPctRef.current) {
        onWatchProgress(key, latestPctRef.current);
      }
    };
  }, [player, key, onWatchProgress]);

  return (
    <VideoView
      player={player}
      style={styles.video}
      contentFit="contain"
      nativeControls
    />
  );
}

// ---------------------------------------------------------------------------
// One video row inside a playlist / one-shots list.
// ---------------------------------------------------------------------------

function VideoRow({
  video,
  index,
  progress,
  selected,
  onSelect,
}: {
  video: CourseVideo;
  index: number;
  progress: ProgressState;
  selected: boolean;
  onSelect: (video: CourseVideo) => void;
}) {
  const { theme } = useTheme();
  const key = videoKey(video);
  const pct = progress.watchPct[key] ?? 0;
  const completed =
    progress.completedLessonIds.includes(key) || pct >= 95;
  const duration = formatHms(video.durationSeconds);

  return (
    <Pressable
      onPress={() => onSelect(video)}
      style={[
        styles.videoRow,
        {
          backgroundColor: selected ? theme.surface2 : theme.surface,
          borderColor: theme.border,
        },
      ]}
    >
      <View style={styles.videoRowIcon}>
        {completed ? (
          <Ionicons name="checkmark-circle" size={22} color={theme.success} />
        ) : pct > 0 ? (
          <Ionicons name="play-circle" size={22} color={theme.text} />
        ) : (
          <Ionicons
            name="play-circle-outline"
            size={22}
            color={theme.textMuted}
          />
        )}
      </View>
      <View style={styles.videoRowBody}>
        <Text
          style={[styles.videoRowTitle, { color: theme.text }]}
          numberOfLines={2}
        >
          {index + 1}. {video.title}
        </Text>
        <Text style={[styles.videoRowMeta, { color: theme.textMuted }]}>
          {completed ? "Completed" : pct > 0 ? `Watched ${pct}%` : "Not started"}
          {duration ? ` · ${duration}` : ""}
        </Text>
      </View>
    </Pressable>
  );
}

// ---------------------------------------------------------------------------
// Course detail screen.
// ---------------------------------------------------------------------------

export default function CourseScreen() {
  const { theme } = useTheme();
  const { slug } = useLocalSearchParams<{ slug?: string | string[] }>();
  const slugValue = Array.isArray(slug) ? slug[0] : slug;
  const creator = COURSE_CREATORS.find((c) => c.slug === slugValue);

  const [progress, setProgress] = useState<ProgressState>(emptyProgress);
  const [selected, setSelected] = useState<CourseVideo | null>(null);
  const scrollRef = useRef<ScrollViewInstance>(null);
  const progressRef = useRef(progress);
  // Keep the ref in sync after render — never write to a ref during
  // render. The focus effect and the progress handler read the latest
  // progress through this ref.
  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  // Reload local progress whenever the screen gains focus — a lesson
  // completed elsewhere (e.g. the Learn tab) may share this video's key.
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

  const updateVideoProgress = useCallback((key: string, pct: number) => {
    const prev = progressRef.current;
    const alreadyDone = prev.completedLessonIds.includes(key);
    const prevPct = prev.watchPct[key] ?? 0;
    const nextPct = Math.max(prevPct, pct);
    if (alreadyDone && nextPct <= prevPct) return;
    const next: ProgressState = {
      ...prev,
      watchPct: { ...prev.watchPct, [key]: pct >= 95 ? 100 : nextPct },
      completedLessonIds:
        pct >= 95 && !alreadyDone
          ? [...prev.completedLessonIds, key]
          : prev.completedLessonIds,
    };
    progressRef.current = next;
    setProgress(next);
    void saveProgress(next);
  }, []);

  const selectVideo = useCallback((video: CourseVideo) => {
    setSelected(video);
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  }, []);

  if (!creator) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text }}>Course not found.</Text>
      </View>
    );
  }

  const selectedKey = selected ? videoKey(selected) : null;
  const selectedPct = selectedKey ? progress.watchPct[selectedKey] ?? 0 : 0;
  const selectedCompleted = selectedKey
    ? progress.completedLessonIds.includes(selectedKey) || selectedPct >= 95
    : false;

  return (
    <ScrollView
      ref={scrollRef}
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={styles.content}
    >
      <Stack.Screen options={{ title: creator.name }} />

      {/* Creator header */}
      <View style={styles.header}>
        <Image
          source={{ uri: creator.avatarUrl }}
          style={[styles.avatar, { backgroundColor: theme.surface2 }]}
        />
        <Text style={[styles.name, { color: theme.text }]}>
          {creator.name}
        </Text>
        <Text style={[styles.meta, { color: theme.textMuted }]}>
          {creator.handle} · {creator.subscribers}
        </Text>
        <Text style={[styles.meta, { color: theme.textMuted }]}>
          {creator.language}
        </Text>
        <Text style={[styles.tagline, { color: theme.textSecondary }]}>
          {creator.tagline}
        </Text>
      </View>

      {/* Inline player */}
      {selected && (
        <View
          style={[
            styles.playerBox,
            { backgroundColor: theme.surface, borderColor: theme.border },
          ]}
        >
          <View style={styles.playerTitleRow}>
            <Text
              style={[styles.playerTitle, { color: theme.text }]}
              numberOfLines={2}
            >
              {selected.title}
            </Text>
            <Pressable
              onPress={() => setSelected(null)}
              hitSlop={8}
              accessibilityLabel="Close player"
            >
              <Ionicons name="close" size={22} color={theme.textMuted} />
            </Pressable>
          </View>

          {selected.megaLessonId ? (
            <MegaPlayer
              key={videoKey(selected)}
              uri={videoUrl(selected.megaLessonId)}
              videoKey={videoKey(selected)}
              onWatchProgress={updateVideoProgress}
            />
          ) : (
            <WebView
              source={{
                uri: `https://www.youtube.com/embed/${selected.videoId}?rel=0&autoplay=1`,
              }}
              style={styles.video}
              javaScriptEnabled
              domStorageEnabled
              allowsFullscreenVideo
              mediaPlaybackRequiresUserAction={false}
            />
          )}

          <View style={styles.playerStatusRow}>
            <Text style={[styles.playerStatus, { color: theme.textMuted }]}>
              {selectedCompleted
                ? "Completed"
                : selectedPct > 0
                  ? `Watched ${selectedPct}%`
                  : "Tap play to start watching"}
            </Text>
            {!selected.megaLessonId && !selectedCompleted && (
              <Pressable
                onPress={() => updateVideoProgress(videoKey(selected), 100)}
                style={[
                  styles.markComplete,
                  { borderColor: theme.border, backgroundColor: theme.surface2 },
                ]}
              >
                <Text style={{ color: theme.text, fontSize: 13 }}>
                  Mark as complete
                </Text>
              </Pressable>
            )}
          </View>
        </View>
      )}

      {/* Playlists */}
      {creator.playlists.map((playlist) => {
        const done = playlist.videos.filter(
          (v) =>
            progress.completedLessonIds.includes(videoKey(v)) ||
            (progress.watchPct[videoKey(v)] ?? 0) >= 95
        ).length;
        return (
          <View key={playlist.title} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              {playlist.title}
            </Text>
            <Text style={[styles.sectionMeta, { color: theme.textMuted }]}>
              {playlist.videos.length} videos ·{" "}
              {formatTotal(playlistSeconds(playlist))} · {done} completed
            </Text>
            {playlist.videos.map((video, i) => (
              <VideoRow
                key={video.videoId}
                video={video}
                index={i}
                progress={progress}
                selected={selected?.videoId === video.videoId}
                onSelect={selectVideo}
              />
            ))}
          </View>
        );
      })}

      {/* One-shots */}
      {creator.oneShots.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            One-shot videos
          </Text>
          <Text style={[styles.sectionMeta, { color: theme.textMuted }]}>
            {creator.oneShots.length} videos ·{" "}
            {formatTotal(
              creator.oneShots.reduce(
                (n, v) => n + (v.durationSeconds ?? 0),
                0
              )
            )}
          </Text>
          {creator.oneShots.map((video, i) => (
            <VideoRow
              key={video.videoId}
              video={video}
              index={i}
              progress={progress}
              selected={selected?.videoId === video.videoId}
              onSelect={selectVideo}
            />
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, paddingBottom: 32 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  header: { alignItems: "center", marginBottom: 20 },
  avatar: { width: 72, height: 72, borderRadius: 36, marginBottom: 12 },
  name: { fontSize: 20, fontWeight: "700" },
  meta: { fontSize: 13, marginTop: 2 },
  tagline: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    marginTop: 8,
  },
  playerBox: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
  },
  playerTitleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  playerTitle: { flex: 1, fontSize: 15, fontWeight: "600", marginRight: 8 },
  video: { width: "100%", aspectRatio: 16 / 9, backgroundColor: "#000000" },
  playerStatusRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  playerStatus: { fontSize: 13 },
  markComplete: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: "600", marginBottom: 4 },
  sectionMeta: { fontSize: 13, marginBottom: 10 },
  videoRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  videoRowIcon: { marginRight: 10 },
  videoRowBody: { flex: 1 },
  videoRowTitle: { fontSize: 14, lineHeight: 19 },
  videoRowMeta: { fontSize: 12, marginTop: 4 },
});
