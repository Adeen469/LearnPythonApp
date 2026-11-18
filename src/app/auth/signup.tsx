// Sign-up screen — name + email + password.
//
// The backend creates the account UNVERIFIED and emails a 6-digit
// code (POST /api/auth/email/signup returns { sent: true }, not a
// session). So a successful sign-up always goes to the OTP screen
// with purpose "signup" — the account cannot sign in until the
// code is verified.
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
import { useLanguage } from "../../lib/i18n";
import { emailSignup } from "../../lib/api";

function errorMessage(err: unknown, fallback: string): string {
  return err instanceof Error ? err.message : fallback;
}

export default function SignUpScreen() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSignUp() {
    if (!name.trim()) {
      setError(t.auth.enterName);
      return;
    }
    if (!email.trim()) {
      setError(t.common.enterEmailAddress);
      return;
    }
    if (password.length < 8) {
      setError(t.auth.passwordMin8);
      return;
    }
    setError(null);
    setLoading(true);
    try {
      // The route answers { sent: true } — no session yet. The OTP
      // screen verifies the code and signs the user in.
      await emailSignup(email.trim(), name.trim(), password);
      router.push({
        pathname: "/auth/otp",
        params: { email: email.trim(), purpose: "signup" },
      });
    } catch (err) {
      setError(errorMessage(err, t.common.genericError));
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
        <Text style={[styles.title, { color: theme.text }]}>{t.auth.createAccount}</Text>
        <Text style={[styles.subtitle, { color: theme.textMuted }]}>
          {t.auth.signUpSubtitle}
        </Text>

        <Text style={[styles.label, { color: theme.textSecondary }]}>{t.auth.nameLabel}</Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.surface2,
              borderColor: theme.border,
              color: theme.text,
            },
          ]}
          placeholder={t.auth.namePlaceholder}
          placeholderTextColor={theme.textMuted}
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          autoCorrect={false}
          textContentType="name"
          returnKeyType="next"
        />

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
            placeholder={t.auth.passwordMinPlaceholder}
            placeholderTextColor={theme.textMuted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            textContentType="newPassword"
            returnKeyType="go"
            onSubmitEditing={handleSignUp}
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
            loading && styles.disabled,
          ]}
          onPress={handleSignUp}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={theme.background} />
          ) : (
            <Text style={[styles.primaryButtonText, { color: theme.background }]}>
              {
                t.auth.createAccount
              }
            </Text>
          )}
        </Pressable>

        <Text style={[styles.note, { color: theme.textMuted }]}>
          {t.auth.verifyCodeNote}
        </Text>

        <Pressable
          style={styles.signInLink}
          onPress={() => router.push("/auth/signin")}
        >
          <Text style={[styles.link, { color: theme.textSecondary }]}>
            {t.auth.alreadyHaveAccount}{" "}
            <Text style={{ color: theme.text }}>{t.common.signIn}</Text>
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
  note: {
    fontSize: 13,
    textAlign: "center",
    marginTop: 16,
  },
  signInLink: {
    marginTop: 24,
    alignItems: "center",
  },
  link: {
    fontSize: 15,
  },
});
