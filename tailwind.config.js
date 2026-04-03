/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#fff8eb",
          100: "#ffedc2",
          200: "#ffd980",
          300: "#ffc040",
          400: "#f5a800",
          500: "#db8300", // Web app primary - amber/orange
          600: "#b86600",
          700: "#924d00",
          800: "#703800",
          900: "#542800",
        },
      },
      padding: {
        "safe-top": "env(safe-area-inset-top)",
        "safe-bottom": "env(safe-area-inset-bottom)",
      },
      margin: {
        "safe-bottom": "env(safe-area-inset-bottom)",
      },
      height: {
        "tab-bar": "calc(60px + env(safe-area-inset-bottom))",
      },
    },
  },
  plugins: [],
};
