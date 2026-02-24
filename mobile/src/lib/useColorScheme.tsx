import { useColorScheme as useNativewindColorScheme } from "nativewind";
import { useEffect } from "react";
import { useColorScheme as useSystemColorScheme } from "react-native";

export function useColorScheme() {
  const { colorScheme, setColorScheme, toggleColorScheme } =
    useNativewindColorScheme();
  const systemColorScheme = useSystemColorScheme();

  // Set initial color scheme from system if not already set
  useEffect(() => {
    if (colorScheme === null && systemColorScheme) {
      setColorScheme(systemColorScheme);
    }
  }, [colorScheme, systemColorScheme, setColorScheme]);

  return {
    colorScheme: colorScheme ?? systemColorScheme ?? "light",
    isDarkColorScheme: (colorScheme ?? systemColorScheme) === "dark",
    setColorScheme,
    toggleColorScheme,
  };
}
