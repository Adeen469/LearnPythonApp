// Courses tab — three creator cards (CodeWithHarry first, Mosh second,
// Apna College third). Tapping a card opens /course/<slug>.
// No channel links anywhere — handles are display-only text.
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  COURSE_CREATORS,
  type CourseCreator,
} from "../../lib/courses-data";
import { useTheme } from "../../lib/theme-context";

function creatorCounts(creator: CourseCreator): string {
  const playlistVideos = creator.playlists.reduce(
    (n, p) => n + p.videos.length,
    0
  );
  const parts: string[] = [];
  if (creator.playlists.length > 0) {
    parts.push(
      `${creator.playlists.length} playlist${
        creator.playlists.length === 1 ? "" : "s"
      }`
    );
    parts.push(`${playlistVideos} video${playlistVideos === 1 ? "" : "s"}`);
  }
  if (creator.oneShots.length > 0) {
    parts.push(
      `${creator.oneShots.length} one-shot${
        creator.oneShots.length === 1 ? "" : "s"
      }`
    );
  }
  return parts.join(" · ");
}

export default function CoursesScreen() {
  const { theme } = useTheme();

  return (
    <ScrollView
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.intro, { color: theme.textMuted }]}>
        Full Python video courses — pick a creator to start watching.
      </Text>

      {COURSE_CREATORS.map((creator) => (
        <Pressable
          key={creator.slug}
          onPress={() => router.push(`/course/${creator.slug}`)}
          style={[
            styles.card,
            {
              backgroundColor: theme.surface,
              borderColor: theme.border,
            },
          ]}
        >
          <View style={styles.cardTop}>
            <Image
              source={{ uri: creator.avatarUrl }}
              style={[styles.avatar, { backgroundColor: theme.surface2 }]}
            />
            <View style={styles.cardHead}>
              <Text style={[styles.name, { color: theme.text }]}>
                {creator.name}
              </Text>
              <Text style={[styles.meta, { color: theme.textMuted }]}>
                {creator.handle} · {creator.subscribers}
              </Text>
              <Text style={[styles.meta, { color: theme.textMuted }]}>
                {creator.language} · {creatorCounts(creator)}
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={theme.textMuted}
            />
          </View>
          <Text
            style={[styles.tagline, { color: theme.textSecondary }]}
            numberOfLines={2}
          >
            {creator.tagline}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16 },
  intro: { fontSize: 14, marginBottom: 16 },
  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  cardTop: { flexDirection: "row", alignItems: "center" },
  avatar: { width: 56, height: 56, borderRadius: 28, marginRight: 12 },
  cardHead: { flex: 1 },
  name: { fontSize: 17, fontWeight: "600" },
  meta: { fontSize: 13, marginTop: 2 },
  tagline: { fontSize: 14, marginTop: 12, lineHeight: 20 },
});
