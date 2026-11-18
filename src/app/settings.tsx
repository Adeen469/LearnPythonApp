// Settings — theme, daily goal, streak restore rules, sign-out,
// app version.
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Constants from "expo-constants";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTheme } from "../lib/theme-context";
import { useAuth } from "../lib/auth";
import {
  emptyProgress,
  loadProgress,
  saveProgress,
  type ProgressState,
} from "../lib/progress";

const GOAL_OPTIONS = [15, 30, 45, 60];

export default function SettingsScreen() {
  const { theme, name, setName } = useTheme();
  const { user, signOut } = useAuth();
  const [progress, setProgress] = useState<ProgressState>(emptyProgress);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    loadProgress().then(setProgress);
  }, []);

  async function setGoal(minutes: number) {
    const next = { ...progress, goalMinutesPerDay: minutes };
    setProgress(next);
    await saveProgress(next);
  }

  async function handleSignOut() {
    setSigningOut(true);
    try {
      await signOut();
      router.back();
    } finally {
      setSigningOut(false);
    }
  }

  const version = Constants.expoConfig?.version ?? "1.0.0";
  const restoresLeft = Math.max(0, 3 - progress.restoresUsed);

  return (
    <ScrollView
      contentContainerStyle={[
        styles.content,
        { backgroundColor: theme.background },
      ]}
    >
      {user ? (
        <Text style={[styles.signedInAs, { color: theme.textMuted }]}>
          Signed in as {user.email}
        </Text>
      ) : null}

      <Text style={[styles.sectionTitle, { color: theme.text }]}>Appearance</Text>
      <View style={[styles.card, { borderColor: theme.border }]}>
        <View style={styles.row}>
          <Ionicons
            name={name === "dark" ? "moon-outline" : "sunny-outline"}
            size={20}
            color={theme.textSecondary}
          />
          <Text style={[styles.rowLabel, { color: theme.text }]}>Theme</Text>
        </View>
        <View style={styles.segmented}>
          {(["dark", "light"] as const).map((option) => {
            const active = name === option;
            return (
              <Pressable
                key={option}
                style={[
                  styles.segment,
                  {
                    backgroundColor: active ? theme.text : "transparent",
                    borderColor: theme.border,
                  },
                ]}
                onPress={() => setName(option)}
              >
                <Text
                  style={[
                    styles.segmentText,
                    { color: active ? theme.background : theme.textSecondary },
                  ]}
                >
                  {option === "dark" ? "Dark" : "Light"}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <Text style={[styles.hint, { color: theme.textMuted }]}>
          Dark is the default.
        </Text>
      </View>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>Daily goal</Text>
      <View style={[styles.card, { borderColor: theme.border }]}>
        <Text style={[styles.rowLabel, { color: theme.text }]}>
          Minutes of learning per day
        </Text>
        <View style={styles.goalRow}>
          {GOAL_OPTIONS.map((minutes) => {
            const active = progress.goalMinutesPerDay === minutes;
            return (
              <Pressable
                key={minutes}
                style={[
                  styles.goalChip,
                  {
                    borderColor: active ? theme.text : theme.border,
                    backgroundColor: active ? theme.text : "transparent",
                  },
                ]}
                onPress={() => setGoal(minutes)}
              >
                <Text
                  style={[
                    styles.goalChipText,
                    { color: active ? theme.background : theme.text },
                  ]}
                >
                  {minutes} min
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>Streak</Text>
      <View style={[styles.card, { borderColor: theme.border }]}>
        <View style={styles.row}>
          <Ionicons name="flame-outline" size={20} color={theme.warning} />
          <Text style={[styles.rowLabel, { color: theme.text }]}>
            {progress.streakCount} day streak
          </Text>
        </View>
        <Text style={[styles.body, { color: theme.textMuted }]}>
          A day counts when you complete or watch a lesson. If your
          streak breaks, you can restore it within 24 hours — up to 3
          times a month.
        </Text>
        <Text style={[styles.body, { color: theme.textMuted }]}>
          Restores left this month: {restoresLeft} of 3.
        </Text>
      </View>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>Account</Text>
      {user ? (
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
                Sign out
              </Text>
            </>
          )}
        </Pressable>
      ) : (
        <Pressable
          style={[styles.signOutButton, { borderColor: theme.border }]}
          onPress={() => router.push("/auth/signin")}
        >
          <Ionicons name="log-in-outline" size={20} color={theme.text} />
          <Text style={[styles.signOutText, { color: theme.text }]}>Sign in</Text>
        </Pressable>
      )}

      <Text style={[styles.version, { color: theme.textMuted }]}>
        Learn Python · version {version}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
  },
  signedInAs: {
    fontSize: 14,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    marginTop: 8,
    marginBottom: 12,
  },
  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  rowLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  segmented: {
    flexDirection: "row",
    gap: 8,
    marginTop: 16,
  },
  segment: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 10,
    alignItems: "center",
  },
  segmentText: {
    fontSize: 15,
    fontWeight: "600",
  },
  hint: {
    fontSize: 13,
    marginTop: 12,
  },
  goalRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 14,
  },
  goalChip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  goalChipText: {
    fontSize: 15,
    fontWeight: "600",
  },
  body: {
    fontSize: 14,
    lineHeight: 21,
    marginTop: 10,
  },
  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    marginBottom: 8,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: "600",
  },
  disabled: {
    opacity: 0.5,
  },
  version: {
    fontSize: 13,
    textAlign: "center",
    marginTop: 24,
  },
});
