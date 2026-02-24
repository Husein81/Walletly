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
    background: "hsl(222 47% 5%)", // darker slate for better OLED
    foreground: "hsl(210 40% 98%)",

    card: "hsl(222 40% 12%)", // improved visibility
    cardForeground: "hsl(210 40% 98%)",

    popover: "hsl(222 47% 13%)",
    popoverForeground: "hsl(210 40% 98%)",

    /* PRIMARY – Teal (brighter for dark) */
    primary: "hsl(173 85% 50%)", // brighter teal
    primaryForeground: "hsl(222 47% 5%)",

    secondary: "hsl(222 47% 18%)", // better contrast
    secondaryForeground: "hsl(210 40% 98%)",

    muted: "hsl(222 47% 18%)",
    mutedForeground: "hsl(215 20% 55%)", // improved gray for dark mode

    accent: "hsl(222 47% 18%)",
    accentForeground: "hsl(173 85% 50%)",

    destructive: "hsl(0 84% 60%)",
    success: "hsl(142 76% 55%)", // brighter green

    border: "hsl(222 47% 22%)", // more visible borders
    input: "hsl(222 47% 22%)",
    ring: "hsl(173 85% 50%)",

    radius: "0.75rem",

    chart1: "hsl(173 85% 50%)",
    chart2: "hsl(142 76% 55%)",
    chart3: "hsl(0 84% 60%)",
    chart4: "hsl(43 74% 66%)",
    chart5: "hsl(220 75% 60%)",
  },
};
type NavTheme = Theme & {
  colors: Theme["colors"] & {
    mutedForeground: string;
  };
};

export const NAV_THEME: Record<"light" | "dark", NavTheme> = {
  light: {
    ...DefaultTheme,
    colors: {
      background: THEME.light.background,
      border: THEME.light.border,
      card: THEME.light.card,
      notification: THEME.light.destructive,
      primary: THEME.light.primary,
      text: THEME.light.foreground,
      mutedForeground: THEME.light.mutedForeground,
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
      mutedForeground: THEME.dark.mutedForeground,
    },
  },
};
