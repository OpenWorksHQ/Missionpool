import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#07111f",
        ink: "#111827",
        muted: "#5f6b7a",
        line: "#e8edf3",
        poolBlue: "#075cff",
        softBlue: "#eef5ff",
        mint: "#eaf7ef"
      },
      boxShadow: {
        soft: "0 18px 60px rgba(7, 17, 31, 0.08)"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
