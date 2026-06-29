import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core brand — firstroundcoin.com blue palette, one shade darker
        navy: "#152E74",        // darker than firstroundcoin's #1E3A8A — nav, footer, buttons
        "navy-deep": "#0C1D4E", // for dark section overlays
        ink: "#0D1324",         // darkest body text
        slate: "#475569",       // muted body text (darker than default gray-500)
        paper: "#EEF4FF",       // page background (darker blue tint vs #EFF6FF)
        cream: "#E4EDFF",       // hero/section tint
        line: "#BFCFED",        // borders
        // Accents
        gold: "#C89B00",        // darker than firstroundcoin's #FFD641
        "gold-soft": "#FFF3C2", // light gold tint for card icons
        "gold-dark": "#A07A00", // hover/click — noticeably darker
        settle: "#15803D",      // darker success green
        "settle-soft": "#BBF7D0",
        // Legacy aliases (keep so existing classes don't break)
        token: "#C89B00",
        "token-soft": "#FFF3C2",
        void: "#0C1D4E",
        ink2: "#060C1F",
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
        glow: "0 0 40px rgba(200,155,0,0.22)",
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
