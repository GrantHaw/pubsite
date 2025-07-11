/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          light: "#f5f5f5",
          DEFAULT: "#334155",
          dark: "#1e293b"
        }
      }
    },
  },
  darkMode: "media",
  plugins: [],
};
