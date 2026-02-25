import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme as useNativewindColorScheme } from "nativewind";
import { useEffect, useCallback } from "react";
import { useColorScheme as useSystemColorScheme } from "react-native";

const THEME_KEY = "user-theme-preference";

export function useColorScheme() {
  const {
    colorScheme,
    setColorScheme: setNativewindColorScheme,
    toggleColorScheme: toggleNativewindColorScheme,
  } = useNativewindColorScheme();
  const systemColorScheme = useSystemColorScheme();

  // Set initial color scheme from storage if available, otherwise use system
  useEffect(() => {
    async function loadTheme() {
      try {
        const storedTheme = await AsyncStorage.getItem(THEME_KEY);
        if (storedTheme === "light" || storedTheme === "dark") {
          setNativewindColorScheme(storedTheme);
        } else if (systemColorScheme) {
          setNativewindColorScheme(systemColorScheme);
        }
      } catch (error) {
        console.error("Failed to load theme from storage:", error);
      }
    }
    loadTheme();
  }, [setNativewindColorScheme, systemColorScheme]);

  const setColorScheme = useCallback(
    async (theme: "light" | "dark") => {
      setNativewindColorScheme(theme);
      try {
        await AsyncStorage.setItem(THEME_KEY, theme);
      } catch (error) {
        console.error("Failed to save theme to storage:", error);
      }
    },
    [setNativewindColorScheme],
  );

  const toggleColorScheme = useCallback(async () => {
    const nextTheme =
      (colorScheme ?? systemColorScheme) === "dark" ? "light" : "dark";
    setNativewindColorScheme(nextTheme);
    try {
      await AsyncStorage.setItem(THEME_KEY, nextTheme);
    } catch (error) {
      console.error("Failed to save theme to storage:", error);
    }
  }, [colorScheme, systemColorScheme, setNativewindColorScheme]);

  return {
    colorScheme: colorScheme ?? systemColorScheme ?? "light",
    isDarkColorScheme: (colorScheme ?? systemColorScheme) === "dark",
    setColorScheme,
    toggleColorScheme,
  };
}
