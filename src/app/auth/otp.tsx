// OTP verification screen — 6-digit code for signup or signin.
// Params: email, purpose ("signup" | "signin"). Verifying signs the
// user in (the endpoint sets the session cookie, captured by api.ts).
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
import { router, useLocalSearchParams } from "expo-router";
import { useTheme } from "../../lib/theme-context";
import { useAuth } from "../../lib/auth";
import { sendOtp, verifyOtp } from "../../lib/api";

function errorMessage(err: unknown): string {
  return err instanceof Error
    ? err.message
    : "Something went wrong. Please try again.";
}

export default function OtpScreen() {
  const { theme } = useTheme();
  const { refresh } = useAuth();
  const params = useLocalSearchParams();
  const email = typeof params.email === "string" ? params.email : "";
  const purpose = params.purpose === "signin" ? "signin" : "signup";

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  async function handleVerify() {
    if (code.trim().length !== 6) {
      setError("Enter the 6-digit code.");
      return;
    }
    if (!email) {
      setError("No email to verify. Go back and try signing in again.");
      return;
    }
    setError(null);
    setInfo(null);
    setLoading(true);
    try {
      await verifyOtp(email, code.trim(), purpose);
      await refresh();
      router.back();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (!email) {
      setError("No email to send a code to.");
      return;
    }
    setError(null);
    setInfo(null);
    setResending(true);
    try {
      await sendOtp(email, purpose);
      setInfo(`A new code was sent to ${email}.`);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setResending(false);
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
        <Text style={[styles.title, { color: theme.text }]}>Check your email</Text>
        <Text style={[styles.subtitle, { color: theme.textMuted }]}>
          We sent a 6-digit code to{" "}
          <Text style={{ color: theme.text }}>{email || "your email"}</Text>.
          Enter it below to {purpose === "signup" ? "verify your account" : "sign in"}.
        </Text>

        <Text style={[styles.label, { color: theme.textSecondary }]}>6-digit code</Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.surface2,
              borderColor: theme.border,
              color: theme.text,
            },
          ]}
          placeholder="123456"
          placeholderTextColor={theme.textMuted}
          value={code}
          onChangeText={(v) => setCode(v.replace(/[^0-9]/g, "").slice(0, 6))}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          maxLength={6}
          returnKeyType="go"
          onSubmitEditing={handleVerify}
        />

        {error ? (
          <Text style={[styles.error, { color: theme.danger }]}>{error}</Text>
        ) : null}
        {info ? (
          <Text style={[styles.info, { color: theme.success }]}>{info}</Text>
        ) : null}

        <Pressable
          style={[
            styles.primaryButton,
            { backgroundColor: theme.accent },
            loading && styles.disabled,
          ]}
          onPress={handleVerify}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={theme.background} />
          ) : (
            <Text style={[styles.primaryButtonText, { color: theme.background }]}>
              Verify
            </Text>
          )}
        </Pressable>

        <Pressable
          style={styles.resendLink}
          onPress={handleResend}
          disabled={resending}
        >
          {resending ? (
            <ActivityIndicator color={theme.textMuted} size="small" />
          ) : (
            <Text style={[styles.link, { color: theme.textSecondary }]}>
              Didn&apos;t get a code? Resend
            </Text>
          )}
        </Pressable>

        <View style={styles.spacer} />
        <Pressable onPress={() => router.push("/auth/signin")}>
          <Text style={[styles.link, { color: theme.textMuted, textAlign: "center" }]}>
            Back to sign in
          </Text>
        </Pressable>
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
    fontSize: 20,
    letterSpacing: 4,
    marginBottom: 16,
  },
  error: {
    fontSize: 14,
    marginBottom: 16,
  },
  info: {
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
  resendLink: {
    marginTop: 20,
    alignItems: "center",
  },
  link: {
    fontSize: 15,
  },
  spacer: {
    height: 24,
  },
});
