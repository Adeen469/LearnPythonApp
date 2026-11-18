// Forgot password — sends the reset email.
//
// The reset itself happens on the WEBSITE: the email link opens
// there, where the user chooses a new password. The app does not
// handle reset links in v1 — the screen says so plainly.
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTheme } from "../../lib/theme-context";
import { forgotPassword } from "../../lib/api";

function errorMessage(err: unknown): string {
  return err instanceof Error
    ? err.message
    : "Something went wrong. Please try again.";
}

export default function ForgotScreen() {
  const { theme } = useTheme();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function handleSend() {
    if (!email.trim()) {
      setError("Enter your email address.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await forgotPassword(email.trim());
      setSent(true);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {sent ? (
          <>
            <Ionicons
              name="mail-outline"
              size={40}
              color={theme.success}
              style={styles.icon}
            />
            <Text style={[styles.title, { color: theme.text }]}>
              Check your email
            </Text>
            <Text style={[styles.subtitle, { color: theme.textMuted }]}>
              If an account exists for{" "}
              <Text style={{ color: theme.text }}>{email.trim()}</Text>, we sent
              a password reset link there.
            </Text>
            <Text style={[styles.note, { color: theme.textMuted }]}>
              The link opens the website, where you choose a new password.
              Then come back here and sign in with it.
            </Text>
            <Pressable
              style={[
                styles.primaryButton,
                { backgroundColor: theme.accent },
              ]}
              onPress={() => router.push("/auth/signin")}
            >
              <Text
                style={[styles.primaryButtonText, { color: theme.background }]}
              >
                Back to sign in
              </Text>
            </Pressable>
          </>
        ) : (
          <>
            <Text style={[styles.title, { color: theme.text }]}>
              Forgot password
            </Text>
            <Text style={[styles.subtitle, { color: theme.textMuted }]}>
              Enter the email you signed up with and we&apos;ll send you a
              reset link.
            </Text>

            <Text style={[styles.label, { color: theme.textSecondary }]}>Email</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.surface2,
                  borderColor: theme.border,
                  color: theme.text,
                },
              ]}
              placeholder="you@example.com"
              placeholderTextColor={theme.textMuted}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              textContentType="emailAddress"
              returnKeyType="go"
              onSubmitEditing={handleSend}
            />

            {error ? (
              <Text style={[styles.error, { color: theme.danger }]}>{error}</Text>
            ) : null}

            <Pressable
              style={[
                styles.primaryButton,
                { backgroundColor: theme.accent },
                loading && styles.disabled,
              ]}
              onPress={handleSend}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={theme.background} />
              ) : (
                <Text
                  style={[styles.primaryButtonText, { color: theme.background }]}
                >
                  Send reset link
                </Text>
              )}
            </Pressable>

            <View style={styles.spacer} />
            <Pressable onPress={() => router.push("/auth/signin")}>
              <Text
                style={[
                  styles.link,
                  { color: theme.textMuted, textAlign: "center" },
                ]}
              >
                Back to sign in
              </Text>
            </Pressable>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 32,
  },
  icon: {
    marginBottom: 16,
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
  note: {
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 16,
    marginBottom: 16,
  },
  error: {
    fontSize: 14,
    marginBottom: 16,
  },
  primaryButton: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 4,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "700",
  },
  disabled: {
    opacity: 0.5,
  },
  spacer: {
    height: 24,
  },
  link: {
    fontSize: 15,
  },
});
