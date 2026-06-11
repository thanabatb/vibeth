import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // VibeTH brand palette
        brand: {
          primary: "#6366f1",   // indigo-500
          success: "#22c55e",   // green-500
          warning: "#f59e0b",   // amber-500
          danger: "#ef4444",    // red-500
          info: "#3b82f6",      // blue-500
          muted: "#6b7280",     // gray-500
        },
      },
      screens: {
        // Mobile-first: grid only above 640px
        sm: "640px",
      },
    },
  },
  plugins: [],
};
export default config;
