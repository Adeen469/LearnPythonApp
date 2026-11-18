// Root layout — providers + top-level Stack (Expo Router, SDK 58).
import { Suspense } from "react";
import { ActivityIndicator, View } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "../lib/auth";
import { ThemeProvider, useTheme } from "../lib/theme-context";
import { LanguageProvider, useLanguage } from "../lib/i18n";
import UpdateGate from "../components/UpdateGate";

function RootStack() {
  const { theme, name } = useTheme();
  const { t } = useLanguage();
  return (
    <>
      <StatusBar style={name === "dark" ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: theme.surface },
          headerTintColor: theme.text,
          headerTitleStyle: { color: theme.text },
          contentStyle: { backgroundColor: theme.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="auth/signin"
          options={{ title: t.common.signIn, presentation: "modal" }}
        />
        <Stack.Screen
          name="auth/signup"
          options={{ title: t.auth.createAccount, presentation: "modal" }}
        />
        <Stack.Screen
          name="auth/otp"
          options={{ title: t.nav.verifyEmail, presentation: "modal" }}
        />
        <Stack.Screen
          name="auth/forgot"
          options={{ title: t.auth.forgotPasswordTitle, presentation: "modal" }}
        />
        <Stack.Screen
          name="auth/two-factor"
          options={{ title: t.auth.twoFactorTitle, presentation: "modal" }}
        />
        <Stack.Screen name="lesson/[id]" options={{ title: t.nav.lesson }} />
        <Stack.Screen name="course/[slug]" options={{ title: t.nav.course }} />
        <Stack.Screen
          name="tutor"
          options={{ title: t.common.aiTutor, presentation: "modal" }}
        />
        <Stack.Screen name="settings" options={{ title: t.common.settings }} />
        <Stack.Screen name="roadmap" options={{ title: t.common.roadmap }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <LanguageProvider>
      {/* Checks for app updates on launch; renders nothing unless a
          newer release exists. Outside the Suspense boundary so it can
          show even while the session check is still running. */}
      <UpdateGate />
      {/* The AuthProvider suspends while the first session check runs;
          this fallback is the app's loading screen. */}
      <Suspense fallback={<LoadingFallback />}>
        <AuthProvider>
          <RootStack />
        </AuthProvider>
      </Suspense>
      </LanguageProvider>
    </ThemeProvider>
  );
}

function LoadingFallback() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#000000",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ActivityIndicator size="large" color="#ffffff" />
    </View>
  );
}
