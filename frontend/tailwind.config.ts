import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "media",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#071B2D",
          900: "#0B263D",
          800: "#123B52",
        },
        teal: {
          700: "#087F8C",
          500: "#12B8B0",
        },
        cyan: {
          400: "#29C5D8",
        },
        emerald: {
          500: "#17A673",
        },
        amber: {
          500: "#E6A52D",
        },
        redrisk: {
          500: "#D84A4A",
        },
        slate: {
          900: "#172033",
          600: "#5E697D",
          200: "#DCE3EA",
        },
        offwhite: "#F7FAFC",
      },
      fontFamily: {
        heading: ["var(--font-heading)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(11,38,61,0.06), 0 8px 24px rgba(11,38,61,0.08)",
        glow: "0 0 40px rgba(41,197,216,0.25)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};

export default config;
