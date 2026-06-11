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
        sm: "640px",
      },
      animation: {
        'slide-up': 'slideUp 0.28s cubic-bezier(0.32,0.72,0,1)',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
