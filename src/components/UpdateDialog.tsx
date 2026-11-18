// Update dialog — shows the release notes as the update details,
// downloads the new APK and opens the Android installer.
// Optional updates have a "Later" button; mandatory updates have none
// and cannot be dismissed (the dialog covers the whole screen).
import { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useTheme } from "../lib/theme-context";
import {
  dismissUpdate,
  downloadAndInstall,
  openUnknownSourcesSettings,
  type UpdateInfo,
} from "../lib/updates";

function formatSize(bytes: number): string {
  if (!bytes || bytes <= 0) return "";
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

type DialogState =
  | { kind: "idle" }
  | { kind: "downloading"; progress: number }
  | { kind: "installing" }
  | { kind: "error"; message: string };

export default function UpdateDialog({
  info,
  onClose,
}: {
  info: UpdateInfo;
  onClose: () => void;
}) {
  const { theme } = useTheme();
  const [state, setState] = useState<DialogState>({ kind: "idle" });

  async function handleLater() {
    await dismissUpdate(info.tag);
    onClose();
  }

  async function handleUpdate() {
    setState({ kind: "downloading", progress: 0 });
    try {
      await downloadAndInstall(info, (fraction) =>
        setState({ kind: "downloading", progress: fraction })
      );
      setState({ kind: "installing" });
    } catch (e) {
      setState({
        kind: "error",
        message:
          e instanceof Error
            ? e.message
            : "The update could not be downloaded.",
      });
    }
  }

  const size = formatSize(info.sizeBytes);
  const downloading = state.kind === "downloading";
  const busy = downloading || state.kind === "installing";

  return (
    <Modal
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={info.mandatory ? undefined : onClose}
    >
      <View
        style={[
          styles.backdrop,
          { backgroundColor: "rgba(0, 0, 0, 0.75)" },
        ]}
      >
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.surface,
              borderColor: theme.border,
            },
          ]}
        >
          <Text style={[styles.title, { color: theme.text }]}>
            Update available
          </Text>
          <Text style={[styles.version, { color: theme.textMuted }]}>
            Version {info.version}
            {size ? ` · ${size}` : ""}
            {info.mandatory ? " · Required" : ""}
          </Text>

          {info.notes ? (
            <ScrollView
              style={[styles.notes, { borderColor: theme.border }]}
              showsVerticalScrollIndicator={false}
            >
              <Text style={[styles.notesText, { color: theme.text }]}>
                {info.notes}
              </Text>
            </ScrollView>
          ) : (
            <Text style={[styles.body, { color: theme.textMuted }]}>
              A new version of Learn Python is available.
            </Text>
          )}

          {downloading ? (
            <View style={styles.progressWrap}>
              <View
                style={[styles.progressTrack, { backgroundColor: theme.border }]}
              >
                <View
                  style={[
                    styles.progressFill,
                    {
                      backgroundColor: theme.text,
                      width: `${Math.round(state.progress * 100)}%`,
                    },
                  ]}
                />
              </View>
              <Text style={[styles.progressText, { color: theme.textMuted }]}>
                Downloading… {Math.round(state.progress * 100)}%
              </Text>
            </View>
          ) : null}

          {state.kind === "installing" ? (
            <View style={styles.progressWrap}>
              <ActivityIndicator color={theme.text} />
              <Text style={[styles.progressText, { color: theme.textMuted }]}>
                Opening installer…
              </Text>
            </View>
          ) : null}

          {state.kind === "error" ? (
            <Text style={[styles.error, { color: theme.danger }]}>
              {state.message}
            </Text>
          ) : null}

          {state.kind === "error" ? (
            <Pressable
              style={[styles.primaryButton, { backgroundColor: theme.text }]}
              onPress={async () => {
                try {
                  await openUnknownSourcesSettings();
                } catch {
                  // Settings could not be opened — nothing more to do.
                }
              }}
            >
              <Text
                style={[styles.primaryText, { color: theme.background }]}
              >
                Allow installs in settings
              </Text>
            </Pressable>
          ) : null}

          <Pressable
            style={[
              styles.primaryButton,
              { backgroundColor: theme.text },
              busy && styles.disabled,
            ]}
            onPress={handleUpdate}
            disabled={busy}
          >
            {downloading ? (
              <ActivityIndicator color={theme.background} />
            ) : (
              <Text style={[styles.primaryText, { color: theme.background }]}>
                {state.kind === "error" ? "Try again" : "Update"}
              </Text>
            )}
          </Pressable>

          {!info.mandatory && !busy ? (
            <Pressable
              style={[styles.secondaryButton, { borderColor: theme.border }]}
              onPress={handleLater}
            >
              <Text style={[styles.secondaryText, { color: theme.text }]}>
                Later
              </Text>
            </Pressable>
          ) : null}

          {info.mandatory ? (
            <Text style={[styles.hint, { color: theme.textMuted }]}>
              This update is required to keep using the app.
            </Text>
          ) : null}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
  },
  version: {
    fontSize: 14,
    marginTop: 6,
  },
  notes: {
    maxHeight: 220,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
  },
  notesText: {
    fontSize: 14,
    lineHeight: 21,
  },
  body: {
    fontSize: 14,
    lineHeight: 21,
    marginTop: 16,
  },
  progressWrap: {
    marginTop: 16,
    alignItems: "center",
    gap: 8,
  },
  progressTrack: {
    width: "100%",
    height: 8,
    borderRadius: 999,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
  },
  progressText: {
    fontSize: 13,
  },
  error: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 16,
  },
  primaryButton: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 16,
  },
  primaryText: {
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 10,
  },
  secondaryText: {
    fontSize: 16,
    fontWeight: "600",
  },
  disabled: {
    opacity: 0.5,
  },
  hint: {
    fontSize: 13,
    textAlign: "center",
    marginTop: 12,
  },
});
