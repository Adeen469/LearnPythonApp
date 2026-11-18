// Sign-in screen — email + password, and native Google sign-in.
//
// Google uses the backend's app-mode flow (?app=1): the account
// chooser opens in the system browser, the backend returns through
// learnpython://auth, and the code is exchanged here for a session.
// The chooser stays in the browser because Google blocks OAuth
// inside embedded WebViews.
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
import * as WebBrowser from "expo-web-browser";
import { useTheme } from "../../lib/theme-context";
import { useLanguage } from "../../lib/i18n";
import { useAuth } from "../../lib/auth";
import {
  emailSignin,
  exchangeAppCode,
  GOOGLE_START_URL,
  sendOtp,
} from "../../lib/api";

WebBrowser.maybeCompleteAuthSession();

function errorMessage(err: unknown, fallback: string): string {
  return err instanceof Error ? err.message : fallback;
}

export default function SignInScreen() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const { refresh } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleEmailSignIn() {
    if (!email.trim() || !password) {
      setError(t.auth.enterEmailAndPassword);
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const result = await emailSignin(email.trim(), password);
      if (result.needs2fa) {
        router.push("/auth/two-factor");
        return;
      }
      await refresh();
      router.back();
    } catch (err) {
      const status = (err as { status?: number }).status;
      if (status === 403) {
        // Email not verified yet — send a fresh code and go to OTP.
        try {
          await sendOtp(email.trim(), "signin");
        } catch {
          // The OTP screen has its own resend button.
        }
        router.push({
          pathname: "/auth/otp",
          params: { email: email.trim(), purpose: "signin" },
        });
        return;
      }
      setError(errorMessage(err, t.common.genericError));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setError(null);
    setGoogleLoading(true);
    try {
      const result = await WebBrowser.openAuthSessionAsync(
        GOOGLE_START_URL,
        "learnpython://auth"
      );
      if (result.type !== "success") return; // user cancelled
      const code = new URL(result.url).searchParams.get("code");
      if (!code) {
        setError(t.auth.googleNoCode);
        return;
      }
      await exchangeAppCode(code);
      await refresh();
      router.back();
    } catch (err) {
      setError(errorMessage(err, t.common.genericError));
    } finally {
      setGoogleLoading(false);
    }
  }

  const busy = loading || googleLoading;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.title, { color: theme.text }]}>{t.auth.welcomeBack}</Text>
        <Text style={[styles.subtitle, { color: theme.textMuted }]}>
          {t.auth.signInSubtitle}
        </Text>

        <Pressable
          style={[styles.googleButton, busy && styles.disabled]}
          onPress={handleGoogleSignIn}
          disabled={busy}
        >
          {googleLoading ? (
            <ActivityIndicator color="#1f1f1f" />
          ) : (
            <Text style={styles.googleButtonText}>{t.auth.continueWithGoogle}</Text>
          )}
        </Pressable>

        <View style={styles.dividerRow}>
          <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
          <Text style={[styles.dividerText, { color: theme.textMuted }]}>
            {t.auth.orContinueWithEmail}
          </Text>
          <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
        </View>

        <Text style={[styles.label, { color: theme.textSecondary }]}>{t.common.email}</Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.surface2,
              borderColor: theme.border,
              color: theme.text,
            },
          ]}
          placeholder={t.common.emailPlaceholder}
          placeholderTextColor={theme.textMuted}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          textContentType="emailAddress"
          returnKeyType="next"
        />

        <Text style={[styles.label, { color: theme.textSecondary }]}>{t.common.password}</Text>
        <View
          style={[
            styles.passwordRow,
            { backgroundColor: theme.surface2, borderColor: theme.border },
          ]}
        >
          <TextInput
            style={[styles.passwordInput, { color: theme.text }]}
            placeholder={t.auth.passwordPlaceholder}
            placeholderTextColor={theme.textMuted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            textContentType="password"
            returnKeyType="go"
            onSubmitEditing={handleEmailSignIn}
          />
          <Pressable
            onPress={() => setShowPassword((v) => !v)}
            hitSlop={8}
            accessibilityLabel={showPassword ? t.common.hidePassword : t.common.showPassword}
          >
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color={theme.textMuted}
            />
          </Pressable>
        </View>

        {error ? (
          <Text style={[styles.error, { color: theme.danger }]}>{error}</Text>
        ) : null}

        <Pressable
          style={[
            styles.primaryButton,
            { backgroundColor: theme.accent },
            busy && styles.disabled,
          ]}
          onPress={handleEmailSignIn}
          disabled={busy}
        >
          {loading ? (
            <ActivityIndicator color={theme.background} />
          ) : (
            <Text style={[styles.primaryButtonText, { color: theme.background }]}>
              {
                t.common.signIn
              }
            </Text>
          )}
        </Pressable>

        <View style={styles.linksRow}>
          <Pressable onPress={() => router.push("/auth/forgot")}>
            <Text style={[styles.link, { color: theme.textSecondary }]}>
              {t.auth.forgotPassword}
            </Text>
          </Pressable>
          <Pressable onPress={() => router.push("/auth/signup")}>
            <Text style={[styles.link, { color: theme.text }]}>
              {t.auth.createAccount}
            </Text>
          </Pressable>
        </View>
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
  },
  googleButton: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#dadce0",
  },
  googleButtonText: {
    color: "#1f1f1f",
    fontSize: 16,
    fontWeight: "600",
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 13,
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
  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 13,
    fontSize: 16,
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
  linksRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  link: {
    fontSize: 15,
  },
});
