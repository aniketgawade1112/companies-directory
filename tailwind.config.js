/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: { bg: "#0b1020", card: "#121830", border: "#1f2a4a" },
    },
  },
  darkMode: "class",
  plugins: [],
};
