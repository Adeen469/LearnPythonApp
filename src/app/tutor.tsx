// AI Tutor — chat UI over POST /api/ai (see API.md).
// Modes: tutor / explain / debug / quiz. explain + debug take an
// optional code snippet, sent along with the question. tutor + quiz
// are grounded in the lesson video's transcript — a "Grounded in the
// video" badge and [mm:ss] citations are shown when the response has
// them. Signed-out users get a sign-in gate, never a faked answer.
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Link, useLocalSearchParams } from "expo-router";
import { askAi, type AiMode } from "../lib/api";
import type { AiChatMessage } from "../lib/types";
import { useAuth } from "../lib/auth";
import { useTheme } from "../lib/theme-context";
import { useLanguage } from "../lib/i18n";

const MODES: { id: AiMode }[] = [
  { id: "tutor" },
  { id: "explain" },
  { id: "debug" },
  { id: "quiz" },
];


export default function TutorScreen() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const params = useLocalSearchParams<{ lessonId?: string }>();
  const rawLessonId = params.lessonId;
  const lessonId = Array.isArray(rawLessonId) ? rawLessonId[0] : rawLessonId;

  const modeLabels: Record<AiMode, string> = {
    tutor: t.tutor.modeTutor,
    explain: t.tutor.modeExplain,
    debug: t.tutor.modeDebug,
    quiz: t.tutor.modeQuiz,
  };
  const modeHints: Record<AiMode, string> = {
    tutor: t.tutor.hintTutor,
    explain: t.tutor.hintExplain,
    debug: t.tutor.hintDebug,
    quiz: t.tutor.hintQuiz,
  };

  const [mode, setMode] = useState<AiMode>("tutor");
  const [messages, setMessages] = useState<AiChatMessage[]>([
    {
      role: "assistant",
      text: lessonId ? t.tutor.greetingLesson : t.tutor.greetingGeneral,
    },
  ]);
  const [question, setQuestion] = useState("");
  const [code, setCode] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionExpired, setSessionExpired] = useState(false);
  const listRef = useRef<FlatList<AiChatMessage>>(null);

  const showsCodeInput = mode === "explain" || mode === "debug";

  const send = async () => {
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion || sending) return;
    const trimmedCode = showsCodeInput ? code.trim() : "";
    const userMessage: AiChatMessage = { role: "user", text: trimmedQuestion };
    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setCode("");
    setError(null);
    setSessionExpired(false);
    setSending(true);
    try {
      const res = await askAi({
        mode,
        lessonId,
        question: trimmedQuestion,
        code: trimmedCode || undefined,
      });
      if (res.error || !res.answer) {
        throw new Error(res.error ?? "Empty answer");
      }
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: res.answer,
          grounded: res.grounded,
          citations: res.citations,
        },
      ]);
    } catch (e) {
      const status = (e as { status?: number }).status;
      if (status === 401) {
        setSessionExpired(true);
        setError(t.tutor.errorSessionExpired);
      } else {
        setError(t.tutor.errorGeneric);
      }
    } finally {
      setSending(false);
    }
  };

  // Keep the latest message visible.
  useEffect(() => {
    listRef.current?.scrollToEnd({ animated: true });
  }, [messages, sending]);

  if (authLoading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator color={theme.text} />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <Text style={[styles.gateTitle, { color: theme.text }]}>
          {t.tutor.signInGateTitle}
        </Text>
        <Text style={[styles.gateText, { color: theme.textMuted }]}>
          {t.tutor.signInGateText}
        </Text>
        <Link href="/auth/signin" asChild>
          <Pressable
            style={[styles.signInButton, { borderColor: theme.border }]}
          >
            <Text style={[styles.signInText, { color: theme.text }]}>
              {t.common.signIn}
            </Text>
          </Pressable>
        </Link>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.root, { backgroundColor: theme.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={[styles.modeRow, { borderBottomColor: theme.border }]}>
        {MODES.map((m) => {
          const active = m.id === mode;
          return (
            <Pressable
              key={m.id}
              onPress={() => setMode(m.id)}
              style={[
                styles.modePill,
                {
                  borderColor: active ? theme.text : theme.border,
                  backgroundColor: active ? theme.surface2 : "transparent",
                },
              ]}
            >
              <Text
                style={[
                  styles.modeText,
                  { color: active ? theme.text : theme.textMuted },
                ]}
              >
                {modeLabels[m.id]}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <Text style={[styles.modeHint, { color: theme.textMuted }]}>
        {lessonId
          ? t.tutor.hintLessonSuffix(modeHints[mode], lessonId)
          : modeHints[mode]}
      </Text>

      <FlatList
        ref={listRef}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        data={messages}
        keyExtractor={(_, index) => String(index)}
        onContentSizeChange={() =>
          listRef.current?.scrollToEnd({ animated: true })
        }
        renderItem={({ item }) => {
          const isUser = item.role === "user";
          return (
            <View
              style={[
                styles.messageRow,
                isUser ? styles.messageRowRight : styles.messageRowLeft,
              ]}
            >
              <View
                style={[
                  styles.bubble,
                  isUser
                    ? [styles.userBubble, { backgroundColor: theme.surface2 }]
                    : [
                        styles.assistantBubble,
                        {
                          backgroundColor: theme.surface,
                          borderColor: theme.border,
                        },
                      ],
                ]}
              >
                <Text
                  style={[styles.messageText, { color: theme.text }]}
                >
                  {item.text}
                </Text>
                {!isUser && item.grounded ? (
                  <View
                    style={[
                      styles.groundedBadge,
                      { borderColor: theme.success },
                    ]}
                  >
                    <Text
                      style={[styles.groundedText, { color: theme.success }]}
                    >
                      {t.tutor.groundedBadge}
                    </Text>
                  </View>
                ) : null}
                {!isUser && item.citations && item.citations.length > 0 ? (
                  <View style={styles.citations}>
                    {item.citations.map((citation) => (
                      <Text
                        key={citation}
                        style={[styles.citation, { color: theme.info }]}
                      >
                        {citation.startsWith("[")
                          ? citation
                          : t.tutor.citation(citation)}
                      </Text>
                    ))}
                  </View>
                ) : null}
              </View>
            </View>
          );
        }}
        ListFooterComponent={
          sending ? (
            <View style={[styles.messageRow, styles.messageRowLeft]}>
              <View
                style={[
                  styles.bubble,
                  styles.assistantBubble,
                  {
                    backgroundColor: theme.surface,
                    borderColor: theme.border,
                  },
                ]}
              >
                <ActivityIndicator color={theme.textMuted} size="small" />
              </View>
            </View>
          ) : undefined
        }
      />

      {error ? (
        <View
          style={[
            styles.errorBanner,
            { backgroundColor: theme.surface2, borderColor: theme.danger },
          ]}
        >
          <Text style={[styles.errorText, { color: theme.text }]}>
            {error}
          </Text>
          {sessionExpired ? (
            <Link href="/auth/signin" asChild>
              <Pressable>
                <Text style={[styles.errorLink, { color: theme.info }]}>
                  {t.tutor.signInAgain}
                </Text>
              </Pressable>
            </Link>
          ) : null}
        </View>
      ) : null}

      <View
        style={[styles.inputArea, { borderTopColor: theme.border }]}
      >
        {showsCodeInput ? (
          <TextInput
            value={code}
            onChangeText={setCode}
            placeholder={t.tutor.codePlaceholder}
            placeholderTextColor={theme.textMuted}
            multiline
            numberOfLines={4}
            autoCapitalize="none"
            autoCorrect={false}
            style={[
              styles.codeInput,
              {
                color: theme.text,
                backgroundColor: theme.surface,
                borderColor: theme.border,
              },
            ]}
          />
        ) : null}
        <View style={styles.inputRow}>
          <TextInput
            value={question}
            onChangeText={setQuestion}
            placeholder={t.tutor.askPlaceholder}
            placeholderTextColor={theme.textMuted}
            multiline
            returnKeyType="send"
            onSubmitEditing={send}
            style={[
              styles.questionInput,
              {
                color: theme.text,
                backgroundColor: theme.surface,
                borderColor: theme.border,
              },
            ]}
          />
          <Pressable
            onPress={send}
            disabled={!question.trim() || sending}
            style={[
              styles.sendButton,
              {
                backgroundColor: theme.surface2,
                borderColor: theme.border,
                opacity: !question.trim() || sending ? 0.4 : 1,
              },
            ]}
          >
            <Text style={[styles.sendText, { color: theme.text }]}>{t.common.send}</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  gateTitle: { fontSize: 20, fontWeight: "600", textAlign: "center" },
  gateText: { fontSize: 14, marginTop: 8, textAlign: "center", lineHeight: 20 },
  signInButton: {
    marginTop: 20,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  signInText: { fontSize: 16, fontWeight: "600" },
  modeRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  modePill: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  modeText: { fontSize: 14, fontWeight: "600" },
  modeHint: { fontSize: 13, paddingHorizontal: 16, paddingTop: 8 },
  list: { flex: 1 },
  listContent: { padding: 16, gap: 12 },
  messageRow: { flexDirection: "row" },
  messageRowRight: { justifyContent: "flex-end" },
  messageRowLeft: { justifyContent: "flex-start" },
  bubble: { maxWidth: "85%", borderRadius: 12, padding: 12 },
  userBubble: { borderBottomRightRadius: 4 },
  assistantBubble: { borderWidth: 1, borderBottomLeftRadius: 4 },
  messageText: { fontSize: 15, lineHeight: 21 },
  groundedBadge: {
    alignSelf: "flex-start",
    marginTop: 8,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  groundedText: { fontSize: 12, fontWeight: "600" },
  citations: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  citation: { fontSize: 13, fontWeight: "600" },
  errorBanner: {
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 12,
    borderWidth: 1,
    borderRadius: 12,
    gap: 6,
  },
  errorText: { fontSize: 14, lineHeight: 19 },
  errorLink: { fontSize: 14, fontWeight: "600" },
  inputArea: { borderTopWidth: 1, padding: 12, gap: 8 },
  codeInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    minHeight: 72,
    maxHeight: 140,
    textAlignVertical: "top",
  },
  inputRow: { flexDirection: "row", gap: 8, alignItems: "flex-end" },
  questionInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    minHeight: 44,
    maxHeight: 110,
  },
  sendButton: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 12,
    justifyContent: "center",
  },
  sendText: { fontSize: 15, fontWeight: "600" },
});
