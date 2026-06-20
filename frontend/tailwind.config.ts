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
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "#ef4444", // Crimson Red
          dark: "#b91c1c", // Dark Red
          light: "#fee2e2", // Soft Red
        },
        dark: {
          900: "#ffffff", // Pure White cards
          800: "#f9fafb", // Soft off-white backdrops
          700: "#e5e7eb", // Sleek light-grey borders
          600: "#374151", // Dark charcoal text
        },
        success: "#10b981", // Emerald Green
        warning: "#f59e0b", // Amber Orange
        danger: "#ef4444", // Alert Red
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
