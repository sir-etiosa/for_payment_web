import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand backgrounds — darkest to lightest
        void: "#06080D",       // hero / near-black
        ink: "#0A0D14",        // dark section backgrounds
        navy: "#111827",       // dark card surfaces
        slate: "#6B7899",      // muted text on dark
        paper: "#F4F5F7",      // light section background
        line: "#E0E4ED",       // light hairline borders
        "line-dark": "#1A2030", // dark hairline borders
        // Settlement accent — "cleared / money in" (vivid green)
        settle: "#22C55E",
        "settle-soft": "#DCFCE7",
        // $FOR token — dark warm gold
        token: "#C9A84C",
        "token-soft": "#FEF3C7",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        xl: "14px",
        "2xl": "20px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(6,8,13,0.06), 0 8px 30px rgba(6,8,13,0.10)",
        lift: "0 24px 80px rgba(6,8,13,0.50)",
        "glow-green": "0 0 40px rgba(34,197,94,0.15)",
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
