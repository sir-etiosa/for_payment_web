import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core brand
        navy: "#222A44",        // primary dark — nav, footer, dark sections, primary buttons
        "navy-deep": "#141B2D", // deeper navy for overlays
        ink: "#111827",         // body text (dark)
        slate: "#6B7280",       // muted body text
        paper: "#F9FAFB",       // page background
        cream: "#FFFBF0",       // warm hero tint
        line: "#E5E7EB",        // borders
        // Accents
        gold: "#D4AF37",        // warm classic gold — THE primary accent
        "gold-soft": "#FEF9E7", // light gold tint for card icons
        "gold-dark": "#B8941C", // hover/pressed gold
        settle: "#16A34A",      // muted green — success/settled states ONLY
        "settle-soft": "#DCFCE7",
        // Legacy aliases (keep so existing classes don't break)
        token: "#D4AF37",
        "token-soft": "#FEF9E7",
        void: "#141B2D",
        ink2: "#0A0D14",
      },
      fontFamily: {
        display: ["var(--font-display)", "Lato", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        xl: "14px",
        "2xl": "20px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(6,8,13,0.06), 0 8px 30px rgba(6,8,13,0.10)",
        lift: "0 24px 80px rgba(6,8,13,0.50)",
        glow: "0 0 40px rgba(212,175,55,0.15)",
      },
      keyframes: {
        "rail-flow": {
          "0%": { transform: "translateX(-120%)" },
          "100%": { transform: "translateX(420%)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-dot": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.35" },
        },
        "count-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "rail-flow": "rail-flow 2.6s linear infinite",
        "fade-up": "fade-up 0.7s ease-out both",
        "pulse-dot": "pulse-dot 1.6s ease-in-out infinite",
        "count-up": "count-up 0.5s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
