import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0B1F3A",
          50:  "#eef2f7",
          100: "#d5e0ed",
          200: "#adc0da",
          300: "#7d9dc3",
          400: "#5580af",
          500: "#3a659a",
          600: "#2d5082",
          700: "#243f68",
          800: "#172d4f",
          900: "#0B1F3A",
          950: "#060f1d",
        },
        red: {
          DEFAULT: "#FF2D4A",
          50:  "#fff0f2",
          100: "#ffdde2",
          200: "#ffb3bc",
          300: "#ff8091",
          400: "#ff4d65",
          500: "#FF2D4A",
          600: "#e0193a",
          700: "#bc0e2d",
          800: "#990b24",
          900: "#7a0c1e",
        },
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "ui-sans-serif", "system-ui"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      boxShadow: {
        "glow-red":   "0 0 40px -8px rgba(255, 45, 74, 0.5)",
        "glow-navy":  "0 0 40px -8px rgba(11, 31, 58, 0.5)",
        "card":       "0 4px 24px -4px rgba(11, 31, 58, 0.08), 0 1px 4px rgba(11, 31, 58, 0.04)",
        "card-hover": "0 16px 48px -8px rgba(11, 31, 58, 0.16), 0 4px 12px rgba(11, 31, 58, 0.06)",
        "inner-glow": "inset 0 1px 0 rgba(255,255,255,0.1)",
      },
      animation: {
        "spin-slow":   "spin 3s linear infinite",
        "slide-up":    "slideUp 0.35s cubic-bezier(0.16,1,0.3,1) forwards",
      },
      keyframes: {
        slideUp: {
          "0%":   { opacity: "0", transform: "translateY(24px) scale(0.97)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
