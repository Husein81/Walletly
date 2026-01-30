import { DarkTheme, DefaultTheme, type Theme } from "@react-navigation/native";

/**
 * FINANCE THEME (Teal-based)
 * Matches dashboard, cards, and bottom tabs
 */
export const THEME = {
  light: {
    /* Core */
    background: "hsl(210 40% 98%)", // slate-50
    foreground: "hsl(222 47% 11%)", // slate-900

    card: "hsl(0 0% 100%)",
    cardForeground: "hsl(222 47% 11%)",

    popover: "hsl(0 0% 100%)",
    popoverForeground: "hsl(222 47% 11%)",

    /* PRIMARY – Teal */
    primary: "hsl(173 80% 40%)", // teal-500
    primaryForeground: "hsl(0 0% 100%)",

    /* Secondary / Muted */
    secondary: "hsl(210 40% 96%)", // slate-100
    secondaryForeground: "hsl(222 47% 11%)",

    muted: "hsl(210 40% 96%)",
    mutedForeground: "hsl(215 16% 47%)", // slate-500

    accent: "hsl(173 80% 95%)",
    accentForeground: "hsl(173 80% 25%)",

    /* States */
    destructive: "hsl(0 84% 60%)", // red-500
    success: "hsl(142 71% 45%)", // green-500

    /* Borders & Inputs */
    border: "hsl(214 32% 91%)", // slate-200
    input: "hsl(214 32% 91%)",
    ring: "hsl(173 80% 40%)",

    radius: "0.75rem",

    /* Charts */
    chart1: "hsl(173 80% 40%)",
    chart2: "hsl(142 71% 45%)",
    chart3: "hsl(0 84% 60%)",
    chart4: "hsl(43 74% 66%)",
    chart5: "hsl(220 70% 50%)",
  },

  dark: {
    /* Core */
    background: "hsl(222 47% 6%)", // very dark slate
    foreground: "hsl(210 40% 98%)",

    card: "hsl(222 47% 10%)",
    cardForeground: "hsl(210 40% 98%)",

    popover: "hsl(222 47% 10%)",
    popoverForeground: "hsl(210 40% 98%)",

    /* PRIMARY – Teal (muted for dark) */
    primary: "hsl(173 80% 45%)",
    primaryForeground: "hsl(222 47% 6%)",

    secondary: "hsl(222 47% 14%)",
    secondaryForeground: "hsl(210 40% 98%)",

    muted: "hsl(222 47% 14%)",
    mutedForeground: "hsl(215 20% 65%)",

    accent: "hsl(222 47% 14%)",
    accentForeground: "hsl(210 40% 98%)",

    destructive: "hsl(0 72% 51%)",
    success: "hsl(142 71% 45%)",

    border: "hsl(222 47% 18%)",
    input: "hsl(222 47% 18%)",
    ring: "hsl(173 80% 45%)",

    radius: "0.75rem",

    chart1: "hsl(173 80% 45%)",
    chart2: "hsl(142 71% 45%)",
    chart3: "hsl(0 72% 51%)",
    chart4: "hsl(43 74% 66%)",
    chart5: "hsl(220 70% 60%)",
  },
};

export const NAV_THEME: Record<"light" | "dark", Theme> = {
  light: {
    ...DefaultTheme,
    colors: {
      background: THEME.light.background,
      border: THEME.light.border,
      card: THEME.light.card,
      notification: THEME.light.destructive,
      primary: THEME.light.primary,
      text: THEME.light.foreground,
    },
  },
  dark: {
    ...DarkTheme,
    colors: {
      background: THEME.dark.background,
      border: THEME.dark.border,
      card: THEME.dark.card,
      notification: THEME.dark.destructive,
      primary: THEME.dark.primary,
      text: THEME.dark.foreground,
    },
  },
};
