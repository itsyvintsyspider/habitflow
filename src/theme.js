export const lightTheme = {
  background: "#f1f5f9",
  card: "#ffffff",
  text: "#0f172a",
  subtext: "#64748b",
  accent: "#2563eb",
  success: "#16a34a",
  danger: "#dc2626",
  border: "#e2e8f0",
  tabBackground: "#ffffff",
  tabInactive: "#94a3b8",
  checkboxEmpty: "#e2e8f0",
};

export const darkTheme = {
  background: "#0f172a",
  card: "#1e293b",
  text: "#f1f5f9",
  subtext: "#94a3b8",
  accent: "#60a5fa",
  success: "#4ade80",
  danger: "#f87171",
  border: "#334155",
  tabBackground: "#1e293b",
  tabInactive: "#64748b",
  checkboxEmpty: "#334155",
};

export function getTheme(isDark) {
  return isDark ? darkTheme : lightTheme;
}

// Preset colors users can pick when creating a habit, so each one is
// visually distinct without needing a full color picker UI.
export const HABIT_COLORS = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#06b6d4",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
];

export const HABIT_ICONS = [
  "💧",
  "🏃",
  "📚",
  "🧘",
  "🥗",
  "😴",
  "✍️",
  "🎯",
];
