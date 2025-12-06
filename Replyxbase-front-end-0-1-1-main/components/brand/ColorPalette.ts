/**
 * Replyxbase Brand Color Palette
 * Complete color system for the SaaS platform
 */

export const Colors = {
  // Primary Colors
  primary: {
    blue: "#005bbc",
    dark: "#004a9f",
    light: "rgba(0, 91, 188, 0.10)",
    border: "rgba(0, 91, 188, 0.20)",
  },

  // Accent Colors
  accent: {
    yellow: "#ffd600",
    light: "rgba(255, 214, 0, 0.10)",
    border: "rgba(255, 214, 0, 0.20)",
  },

  // Neutrals (Zinc / Slate)
  neutral: {
    zinc900: "#18181B",
    slate900: "#0F172A",
    slate800: "#1E293B",
    slate600: "#475569",
    slate400: "#94A3B8",
    slate50: "#F8FAFC",
  },

  // Status Colors
  status: {
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
  },

  // Voice UI Colors
  voice: {
    pulseBlue: "#1D75FF",
    activeYellow: "#ffd600",
    idle: "#CBD5E1",
  },
} as const;

export type ColorKey = keyof typeof Colors;


