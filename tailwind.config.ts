import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        base: { DEFAULT: "#0B0C12", raised: "#12141C", line: "#1F2430" },
        ink: { DEFAULT: "#E8EAF0", mid: "#9BA3B4", dim: "#6B7280" },
        accent: { DEFAULT: "#FB651E", deep: "#C64A12" },
        good: "#2F9E44", warn: "#D6A51F", bad: "#E5484D",
      },
      fontFamily: { sans: ["Inter", "system-ui", "sans-serif"], mono: ["IBM Plex Mono", "ui-monospace", "monospace"] },
      maxWidth: { canvas: "78rem" },
    },
  },
  plugins: [],
};
export default config;
