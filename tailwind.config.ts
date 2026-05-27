import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: "#0c0c10",
          raised: "#14141c",
          card: "#1a1a24",
          border: "#2a2a38",
        },
        gold: {
          DEFAULT: "#d4af37",
          light: "#f0d78c",
          dim: "#9a7b2e",
        },
        ball: {
          red: "#e53935",
          blue: "#1e88e5",
          green: "#43a047",
        },
        text: {
          DEFAULT: "#e8e8ef",
          muted: "#9898a8",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        gold: "0 0 24px rgba(212, 175, 55, 0.15)",
      },
    },
  },
  plugins: [],
  safelist: [
    "bg-ball-red",
    "bg-ball-blue",
    "bg-ball-green",
  ],
};

export default config;
