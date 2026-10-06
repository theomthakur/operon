import type { Config } from "tailwindcss";
// Light theme sampled from operonsolutions.com: white page, near-black type, royal blue actions.
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        base: { DEFAULT: "#FFFFFF", raised: "#F6F6F8", sunk: "#EFEFF3", line: "#E4E5EA" },
        ink: { DEFAULT: "#1A1A1A", mid: "#55585F", dim: "#8A8D94" },
        accent: { DEFAULT: "#1F3ACB", deep: "#172C9C", soft: "#EEF1FD" },
        good: "#1E7F3A", warn: "#A86A06", bad: "#C8322B",
      },
      fontFamily: { sans: ["Inter", "system-ui", "sans-serif"], mono: ["IBM Plex Mono", "ui-monospace", "monospace"] },
      maxWidth: { canvas: "80rem" },
    },
  },
  plugins: [],
};
export default config;
