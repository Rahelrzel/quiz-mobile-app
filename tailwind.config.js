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
