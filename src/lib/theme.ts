// Learn Python — native app theme.
//
// Matches the website: dark by default, muted neutrals, no saturated
// gradients, no AI-generated look. Black surfaces, white text, restrained
// accents (green for success/complete, blue for info, amber for warnings,
// red for errors). A light theme exists in Settings; dark is the default.

export type AppThemeName = "dark" | "light";

export interface AppTheme {
  name: AppThemeName;
  background: string;
  surface: string;
  surface2: string;
  border: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
  success: string;
  info: string;
  warning: string;
  danger: string;
  tabBar: string;
}

export const darkTheme: AppTheme = {
  name: "dark",
  background: "#000000",
  surface: "#0a0a0a",
  surface2: "#171717",
  border: "#262626",
  text: "#ffffff",
  textSecondary: "#d4d4d4",
  textMuted: "#a3a3a3",
  accent: "#ffffff",
  success: "#16a34a",
  info: "#0284c7",
  warning: "#d97706",
  danger: "#dc2626",
  tabBar: "#0a0a0a",
};

export const lightTheme: AppTheme = {
  name: "light",
  background: "#ffffff",
  surface: "#ffffff",
  surface2: "#f5f5f5",
  border: "#e5e5e5",
  text: "#000000",
  textSecondary: "#404040",
  textMuted: "#737373",
  accent: "#000000",
  success: "#16a34a",
  info: "#0284c7",
  warning: "#d97706",
  danger: "#dc2626",
  tabBar: "#ffffff",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  pill: 999,
};

export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
};
