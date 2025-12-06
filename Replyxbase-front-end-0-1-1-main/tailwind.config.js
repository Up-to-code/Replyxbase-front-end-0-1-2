/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        primary: {
          blue: "#005bbc",
          dark: "#004a9f",
          light: "rgba(0, 91, 188, 0.10)",
          border: "rgba(0, 91, 188, 0.20)",
        },
        // Accent Colors
        accent: {
          yellow: "#ffd600",
          light: "rgba(255, 214, 0, 0.10)",
          border: "rgba(255, 214, 0, 0.20)",
        },
        // Voice UI Colors
        voice: {
          pulseBlue: "#1D75FF",
          activeYellow: "#ffd600",
          idle: "#CBD5E1",
        },
      },
      boxShadow: {
        glow: "0 0 30px rgba(0, 91, 188, 0.15), 0 0 60px rgba(0, 91, 188, 0.08)",
        "accent-glow": "0 0 20px rgba(255, 214, 0, 0.3)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};


