// Theme provider — dark by default (like the website), light in Settings.
// Persisted on device; the website's theme key is reused in spirit only.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  darkTheme,
  lightTheme,
  type AppTheme,
  type AppThemeName,
} from "./theme";

const KEY = "lp_theme";

interface ThemeContextValue {
  theme: AppTheme;
  name: AppThemeName;
  toggle: () => void;
  setName: (name: AppThemeName) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: darkTheme,
  name: "dark",
  toggle: () => {},
  setName: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [name, setNameState] = useState<AppThemeName>("dark");

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((v) => {
        if (v === "light" || v === "dark") setNameState(v);
      })
      .catch(() => {});
  }, []);

  const setName = useCallback((next: AppThemeName) => {
    setNameState(next);
    AsyncStorage.setItem(KEY, next).catch(() => {});
  }, []);

  const toggle = useCallback(() => {
    setName(name === "dark" ? "light" : "dark");
  }, [name, setName]);

  const theme = name === "dark" ? darkTheme : lightTheme;
  const value = useMemo(
    () => ({ theme, name, toggle, setName }),
    [theme, name, toggle, setName]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
