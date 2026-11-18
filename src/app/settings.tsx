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
import { LANGUAGES, useLanguage } from "../lib/i18n";
import UpdateDialog from "../components/UpdateDialog";
import {
  checkForUpdate,
  type UpdateInfo,
} from "../lib/updates";
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
  const { lang, setLang, t } = useLanguage();
  const [progress, setProgress] = useState<ProgressState>(emptyProgress);
  const [signingOut, setSigningOut] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<
    "idle" | "checking" | "uptodate" | "unavailable"
  >("idle");
  const [manualUpdate, setManualUpdate] = useState<UpdateInfo | null>(null);

  async function handleCheckForUpdates() {
    setUpdateStatus("checking");
    const result = await checkForUpdate();
    if (result.status === "update") {
      setManualUpdate(result.info);
      setUpdateStatus("idle");
    } else {
      setUpdateStatus(result.status);
    }
  }

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
          {t.settings.signedInAs(user.email)}
        </Text>
      ) : null}

      <Text style={[styles.sectionTitle, { color: theme.text }]}>{t.settings.appearance}</Text>
      <View style={[styles.card, { borderColor: theme.border }]}>
        <View style={styles.row}>
          <Ionicons
            name={name === "dark" ? "moon-outline" : "sunny-outline"}
            size={20}
            color={theme.textSecondary}
          />
          <Text style={[styles.rowLabel, { color: theme.text }]}>{t.settings.theme}</Text>
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
                  {option === "dark" ? t.settings.themeDark : t.settings.themeLight}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <Text style={[styles.hint, { color: theme.textMuted }]}>
          {t.settings.darkIsDefault}
        </Text>
      </View>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>
        {t.settings.language}
      </Text>
      <View style={[styles.card, { borderColor: theme.border }]}>
        {LANGUAGES.map((l) => {
          const active = lang === l.code;
          return (
            <Pressable
              key={l.code}
              style={[
                styles.langRow,
                active && { backgroundColor: theme.surface2 },
              ]}
              onPress={() => setLang(l.code)}
            >
              <View>
                <Text style={[styles.langLabel, { color: theme.text }]}>
                  {l.label}
                </Text>
                <Text style={[styles.langSub, { color: theme.textMuted }]}>
                  {l.englishName}
                </Text>
              </View>
              {active ? (
                <Ionicons name="checkmark" size={20} color={theme.text} />
              ) : null}
            </Pressable>
          );
        })}
        <Text style={[styles.hint, { color: theme.textMuted }]}>
          {t.settings.languageHint}
        </Text>
      </View>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>{t.settings.dailyGoal}</Text>
      <View style={[styles.card, { borderColor: theme.border }]}>
        <Text style={[styles.rowLabel, { color: theme.text }]}>
          {t.settings.minutesPerDay}
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
                  {t.settings.goalMinutes(minutes)}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>{t.settings.streak}</Text>
      <View style={[styles.card, { borderColor: theme.border }]}>
        <View style={styles.row}>
          <Ionicons name="flame-outline" size={20} color={theme.warning} />
          <Text style={[styles.rowLabel, { color: theme.text }]}>
            {t.settings.streakCount(progress.streakCount)}
          </Text>
        </View>
        <Text style={[styles.body, { color: theme.textMuted }]}>
          {t.settings.streakExplainer}
        </Text>
        <Text style={[styles.body, { color: theme.textMuted }]}>
          {t.settings.restoresLeft(restoresLeft)}
        </Text>
      </View>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>{t.settings.updates}</Text>
      <View style={[styles.card, { borderColor: theme.border }]}>
        <View style={styles.row}>
          <Ionicons name="cloud-download-outline" size={20} color={theme.textSecondary} />
          <Text style={[styles.rowLabel, { color: theme.text }]}>
            {t.settings.appUpdates}
          </Text>
        </View>
        <Text style={[styles.body, { color: theme.textMuted }]}>
          {t.settings.updatesExplainer}
        </Text>
        <Pressable
          style={[
            styles.checkButton,
            { borderColor: theme.border },
            updateStatus === "checking" && styles.disabled,
          ]}
          onPress={handleCheckForUpdates}
          disabled={updateStatus === "checking"}
        >
          {updateStatus === "checking" ? (
            <ActivityIndicator color={theme.text} />
          ) : (
            <Text style={[styles.checkButtonText, { color: theme.text }]}>
              {t.settings.checkForUpdates}
            </Text>
          )}
        </Pressable>
        {updateStatus === "uptodate" ? (
          <Text style={[styles.hint, { color: theme.textMuted }]}>
            {t.settings.upToDate}
          </Text>
        ) : null}
        {updateStatus === "unavailable" ? (
          <Text style={[styles.hint, { color: theme.textMuted }]}>
            {t.settings.couldntCheckUpdates}
          </Text>
        ) : null}
      </View>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>{t.settings.account}</Text>
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
                {t.common.signOut}
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
          <Text style={[styles.signOutText, { color: theme.text }]}>{t.common.signIn}</Text>
        </Pressable>
      )}

      <Text style={[styles.version, { color: theme.textMuted }]}>
        {t.settings.appVersion(version)}
      </Text>

      {manualUpdate ? (
        <UpdateDialog
          info={manualUpdate}
          onClose={() => setManualUpdate(null)}
        />
      ) : null}
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
  checkButton: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 14,
  },
  checkButtonText: {
    fontSize: 15,
    fontWeight: "600",
  },
  langRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  langLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  langSub: {
    fontSize: 13,
    marginTop: 2,
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
