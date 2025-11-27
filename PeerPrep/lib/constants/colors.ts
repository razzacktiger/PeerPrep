/**
 * Color Constants
 * Centralized color definitions for the app
 */

// Gradient color combinations
export const GRADIENTS = {
  PRIMARY: ["#8B5CF6", "#6366F1"] as const,
  SECONDARY: ["#9333EA", "#2563EB"] as const,
  HEADER: ["#9333ea", "#3b82f6", "#4f46e5"] as const,
  
  // Topic-specific gradients
  BLUE: ["#3b82f6", "#06b6d4"] as const,
  PURPLE: ["#a855f7", "#ec4899"] as const,
  GREEN: ["#22c55e", "#10b981"] as const,
  ORANGE: ["#f97316", "#ef4444"] as const,
  TEAL: ["#14b8a6", "#06b6d4"] as const,
  VIOLET: ["#8b5cf6", "#a855f7"] as const,
  PINK: ["#ec4899", "#f43f5e"] as const,
} as const;

// Solid colors
export const COLORS = {
  // Text colors
  TEXT_PRIMARY: "#1E293B",
  TEXT_SECONDARY: "#475569",
  TEXT_TERTIARY: "#64748B",
  TEXT_PLACEHOLDER: "#9CA3AF",
  
  // Background colors
  BG_PRIMARY: "#F8FAFC",
  BG_SECONDARY: "#FFFFFF",
  BG_INPUT: "#F8FAFC",
  
  // Border colors
  BORDER_LIGHT: "#E2E8F0",
  BORDER_DEFAULT: "#CBD5E1",
  
  // Status colors
  SUCCESS: "#22c55e",
  WARNING: "#f59e0b",
  ERROR: "#DC2626",
  INFO: "#3b82f6",
  
  // Purple theme
  PURPLE_500: "#8B5CF6",
  PURPLE_600: "#6366F1",
  PURPLE_700: "#9333EA",
} as const;
