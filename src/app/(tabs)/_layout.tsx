// Bottom tabs — Learn, Courses, Editor, Profile.
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../lib/theme-context";
import { useLanguage } from "../../lib/i18n";

export default function TabsLayout() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.text,
        tabBarInactiveTintColor: theme.textMuted,
        tabBarStyle: {
          backgroundColor: theme.tabBar,
          borderTopColor: theme.border,
        },
        headerStyle: { backgroundColor: theme.surface },
        headerTintColor: theme.text,
        headerTitleStyle: { color: theme.text },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t.tabs.learn,
          tabBarIcon: ({ focused, size }) => (
            <Ionicons
              name="book-outline"
              size={size}
              color={focused ? theme.text : theme.textMuted}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="courses"
        options={{
          title: t.tabs.courses,
          tabBarIcon: ({ focused, size }) => (
            <Ionicons
              name="play-circle-outline"
              size={size}
              color={focused ? theme.text : theme.textMuted}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="editor"
        options={{
          title: t.tabs.editor,
          tabBarIcon: ({ focused, size }) => (
            <Ionicons
              name="code-slash-outline"
              size={size}
              color={focused ? theme.text : theme.textMuted}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t.tabs.profile,
          tabBarIcon: ({ focused, size }) => (
            <Ionicons
              name="person-outline"
              size={size}
              color={focused ? theme.text : theme.textMuted}
            />
          ),
        }}
      />
    </Tabs>
  );
}
