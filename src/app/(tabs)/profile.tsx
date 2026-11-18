// Profile tab.
//
// Signed out: sign-in button + app info. Signed in: avatar initial,
// name/email, streak and daily goal from local progress, links to
// Roadmap / Settings / AI Tutor, and sign-out.
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useTheme } from "../../lib/theme-context";
import { useLanguage } from "../../lib/i18n";
import { useAuth } from "../../lib/auth";
import {
  emptyProgress,
  loadProgress,
  type ProgressState,
} from "../../lib/progress";

function MenuRow({
  icon,
  label,
  onPress,
  danger,
  theme,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  danger?: boolean;
  theme: ReturnType<typeof useTheme>["theme"];
}) {
  return (
    <Pressable
      style={[styles.menuRow, { borderColor: theme.border }]}
      onPress={onPress}
    >
      <Ionicons
        name={icon}
        size={20}
        color={danger ? theme.danger : theme.textSecondary}
      />
      <Text
        style={[
          styles.menuLabel,
          { color: danger ? theme.danger : theme.text },
        ]}
      >
        {label}
      </Text>
      <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
    </Pressable>
  );
}

export default function ProfileScreen() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const { user, loading, signOut } = useAuth();
  const [progress, setProgress] = useState<ProgressState>(emptyProgress);
  const [signingOut, setSigningOut] = useState(false);

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

  async function handleSignOut() {
    setSigningOut(true);
    try {
      await signOut();
    } finally {
      setSigningOut(false);
    }
  }

  if (loading) {
    return (
      <View
        style={[styles.center, { backgroundColor: theme.background }]}
      >
        <ActivityIndicator color={theme.text} />
      </View>
    );
  }

  if (!user) {
    return (
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { backgroundColor: theme.background },
        ]}
      >
        <Text style={[styles.title, { color: theme.text }]}>{t.common.appName}</Text>
        <Text style={[styles.subtitle, { color: theme.textMuted }]}>
          {t.profile.signedOutSubtitle}
        </Text>
        <Pressable
          style={[styles.primaryButton, { backgroundColor: theme.accent }]}
          onPress={() => router.push("/auth/signin")}
        >
          <Text style={[styles.primaryButtonText, { color: theme.background }]}>
            {t.common.signIn}
          </Text>
        </Pressable>
        <Pressable
          style={styles.secondaryLink}
          onPress={() => router.push("/auth/signup")}
        >
          <Text style={[styles.link, { color: theme.textSecondary }]}>
            {t.profile.createAccountLink}
          </Text>
        </Pressable>
        <View style={[styles.infoCard, { borderColor: theme.border }]}>
          <Text style={[styles.infoText, { color: theme.textMuted }]}>
            {t.profile.signedOutInfo}
          </Text>
        </View>
      </ScrollView>
    );
  }

  const initial =
    user.name.trim().charAt(0).toUpperCase() ||
    user.email.charAt(0).toUpperCase();

  return (
    <ScrollView
      contentContainerStyle={[
        styles.content,
        { backgroundColor: theme.background },
      ]}
    >
      <View style={styles.header}>
        <View
          style={[styles.avatar, { backgroundColor: theme.surface2 }]}
        >
          <Text style={[styles.avatarText, { color: theme.text }]}>
            {initial}
          </Text>
        </View>
        <Text style={[styles.name, { color: theme.text }]}>{user.name}</Text>
        <Text style={[styles.email, { color: theme.textMuted }]}>
          {user.email}
        </Text>
        <Text style={[styles.authBadge, { color: theme.textMuted }]}>
          {t.profile.authBadge(user.auth === "google" ? "google" : "email")}
          {user.mfa ? t.profile.authBadgeMfa : ""}
        </Text>
      </View>

      <View style={styles.statsRow}>
        <View style={[styles.statCard, { borderColor: theme.border }]}>
          <Ionicons name="flame-outline" size={22} color={theme.warning} />
          <Text style={[styles.statValue, { color: theme.text }]}>
            {progress.streakCount}
          </Text>
          <Text style={[styles.statLabel, { color: theme.textMuted }]}>
            {t.profile.statStreakLabel}
          </Text>
        </View>
        <View style={[styles.statCard, { borderColor: theme.border }]}>
          <Ionicons name="time-outline" size={22} color={theme.info} />
          <Text style={[styles.statValue, { color: theme.text }]}>
            {progress.goalMinutesPerDay}
          </Text>
          <Text style={[styles.statLabel, { color: theme.textMuted }]}>
            {t.profile.statGoalLabel}
          </Text>
        </View>
        <View style={[styles.statCard, { borderColor: theme.border }]}>
          <Ionicons
            name="checkmark-circle-outline"
            size={22}
            color={theme.success}
          />
          <Text style={[styles.statValue, { color: theme.text }]}>
            {progress.completedLessonIds.length}
          </Text>
          <Text style={[styles.statLabel, { color: theme.textMuted }]}>
            {t.profile.statLessonsLabel}
          </Text>
        </View>
      </View>

      {progress.streakCount === 0 ? (
        <Text style={[styles.streakHint, { color: theme.textMuted }]}>
          {t.profile.streakHint}
        </Text>
      ) : null}

      <View style={styles.menu}>
        <MenuRow
          icon="map-outline"
          label={t.common.roadmap}
          onPress={() => router.push("/roadmap")}
          theme={theme}
        />
        <MenuRow
          icon="chatbubble-ellipses-outline"
          label={t.common.aiTutor}
          onPress={() => router.push("/tutor")}
          theme={theme}
        />
        <MenuRow
          icon="settings-outline"
          label={t.common.settings}
          onPress={() => router.push("/settings")}
          theme={theme}
        />
      </View>

      <Pressable
        style={[
          styles.signOutButton,
          { borderColor: theme.border },
          signingOut && styles.disabled,
        ]}
        onPress={handleSignOut}
        disabled={signingOut}
      >
        {signingOut ? (
          <ActivityIndicator color={theme.danger} />
        ) : (
          <>
            <Ionicons name="log-out-outline" size={20} color={theme.danger} />
            <Text style={[styles.signOutText, { color: theme.danger }]}>
              {t.common.signOut}
            </Text>
          </>
        )}
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 15,
    marginTop: 8,
    marginBottom: 24,
    lineHeight: 22,
  },
  primaryButton: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryLink: {
    marginTop: 20,
    alignItems: "center",
  },
  link: {
    fontSize: 15,
  },
  infoCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginTop: 32,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 21,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: "700",
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
  },
  email: {
    fontSize: 14,
    marginTop: 4,
  },
  authBadge: {
    fontSize: 13,
    marginTop: 6,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    gap: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
  },
  statLabel: {
    fontSize: 12,
  },
  streakHint: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 16,
  },
  menu: {
    marginTop: 24,
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 12,
  },
  menuLabel: {
    flex: 1,
    fontSize: 16,
  },
  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 12,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: "600",
  },
  disabled: {
    opacity: 0.5,
  },
});
