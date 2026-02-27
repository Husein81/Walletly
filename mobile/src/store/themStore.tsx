import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Appearance } from "react-native";

type Theme = "light" | "dark";

type ThemeState = {
  theme: Theme;
  isDark: boolean;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

// Get system theme safely
const getSystemTheme = (): Theme =>
  Appearance.getColorScheme() === "dark" ? "dark" : "light";

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: getSystemTheme(),
      isDark: getSystemTheme() === "dark",

      setTheme: (theme) => {
        const parsed =
          theme === "dark" || theme === "light" ? theme : getSystemTheme();
        set({
          theme: parsed,
          isDark: parsed === "dark",
        });
        Appearance.setColorScheme(parsed);
      },

      toggleTheme: () => {
        const current = get().theme;
        const next = current === "dark" ? "light" : "dark";

        set({
          theme: next,
          isDark: next === "dark",
        });
        Appearance.setColorScheme(next);
      },
    }),
    {
      name: "user-theme-preference",
      storage: createJSONStorage(() => AsyncStorage),

      // Validate persisted state with Zod
      merge: (persistedState: any, currentState) => {
        if (!persistedState) return currentState;

        const parsed =
          persistedState.theme === "dark" || persistedState.theme === "light"
            ? persistedState.theme
            : getSystemTheme();

        if (parsed !== "dark" && parsed !== "light") return currentState;

        return {
          ...currentState,
          theme: parsed,
          isDark: parsed === "dark",
        };
      },
    },
  ),
);
