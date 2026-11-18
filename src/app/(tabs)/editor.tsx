// Editor tab — the website's Pyodide editor inside a WebView.
// There is no native Python runtime, so the WebView IS the editor.
// Known gap (v1), stated plainly below instead of faked: the WebView
// has its own cookie jar, so a user signed in to the app is NOT signed
// in inside the editor — saving code to GitHub needs a separate
// sign-in inside the editor. The Reload button is there for when the
// editor gets stuck or after signing in inside it.
import { useEffect, useRef, useState, type ForwardRefExoticComponent, type RefAttributes } from "react";
import {
  ActivityIndicator,
  BackHandler,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { WebView as RNWebView, type WebViewProps } from "react-native-webview";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { API_BASE } from "../../lib/api";
import { useTheme } from "../../lib/theme-context";
import { useLanguage } from "../../lib/i18n";

// react-native-webview 14 types its component as WebView<P = undefined>,
// and WebViewProps & undefined collapses to never, so every prop fails
// to typecheck. Cast once to the real props type instead.
type WebViewInstance = InstanceType<typeof RNWebView>;
const WebView = RNWebView as unknown as ForwardRefExoticComponent<
  WebViewProps & RefAttributes<WebViewInstance>
>;

const EDITOR_URL = `${API_BASE}/editor`;

export default function EditorScreen() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();
  const webViewRef = useRef<WebViewInstance>(null);
  const [canGoBack, setCanGoBack] = useState(false);

  // Android back button: step back in the editor's history when
  // possible, otherwise let the tab navigator handle the press.
  useEffect(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      if (canGoBack) {
        webViewRef.current?.goBack();
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, [canGoBack]);

  return (
    <View
      style={[
        styles.root,
        { backgroundColor: theme.background, paddingTop: insets.top },
      ]}
    >
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <Text style={[styles.title, { color: theme.text }]}>{t.editor.title}</Text>
        <Text style={[styles.subtitle, { color: theme.textMuted }]}>
          {t.editor.subtitle}
        </Text>
      </View>

      <View
        style={[
          styles.notice,
          { backgroundColor: theme.surface2, borderColor: theme.border },
        ]}
      >
        <Text style={[styles.noticeText, { color: theme.textSecondary }]}>
          {t.editor.signInNotice}
        </Text>
        <Pressable
          onPress={() => webViewRef.current?.reload()}
          style={[styles.reloadButton, { borderColor: theme.border }]}
        >
          <Text style={[styles.reloadText, { color: theme.text }]}>
            {t.editor.reload}
          </Text>
        </Pressable>
      </View>

      <WebView
        ref={webViewRef}
        source={{ uri: EDITOR_URL }}
        style={styles.webview}
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState
        renderLoading={() => (
          <View
            style={[styles.loading, { backgroundColor: theme.background }]}
          >
            <ActivityIndicator color={theme.text} />
            <Text style={{ color: theme.textMuted, marginTop: 8 }}>
              {t.editor.loading}
            </Text>
          </View>
        )}
        onNavigationStateChange={(navState) =>
          setCanGoBack(navState.canGoBack)
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  title: { fontSize: 20, fontWeight: "600" },
  subtitle: { fontSize: 14, marginTop: 2 },
  notice: {
    margin: 12,
    marginBottom: 0,
    padding: 12,
    borderWidth: 1,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  noticeText: { flex: 1, fontSize: 13, lineHeight: 18 },
  reloadButton: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  reloadText: { fontSize: 13, fontWeight: "600" },
  webview: { flex: 1, marginTop: 12 },
  loading: { flex: 1, alignItems: "center", justifyContent: "center" },
});
