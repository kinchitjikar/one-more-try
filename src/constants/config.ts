import app from "app.json";
export const COLORS = {
  background: "#0B0F19",
  surface: "#151D30",
  surfaceBorder: "#23304E",
  surfaceHighlight: "#1E2943",
  primary: "#38BDF8", // Cyan neon
  primaryGlow: "rgba(56, 189, 248, 0.35)",
  accent: "#F43F5E", // Vivid crimson for target
  accentGlow: "rgba(244, 63, 94, 0.45)",
  accentSecondary: "#FB923C", // Decoy / warm alert
  success: "#10B981", // Emerald
  warning: "#F59E0B", // Amber
  textPrimary: "#F8FAFC",
  textSecondary: "#94A3B8",
  textMuted: "#64748B",
  gold: "#FBBF24",
};

export const APP_CONFIG = {
  appName: "PulseTap: One More Try",
  version: app.expo.version,
  buildNumber: app.expo.android.versionCode,
  feedbackEmail: "kinchitkjikar@gmail.com",
  privacyPolicyUrl:
    "https://docs.google.com/document/d/1Tg6yTCyg4RAsTsVAJigMKNI5GX9chlu3nwLF-psiaMs/edit?usp=sharing",
};
