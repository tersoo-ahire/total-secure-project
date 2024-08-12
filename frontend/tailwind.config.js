/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "dark-green": "#005828",
        "light-green": "#03A62F",
        "color-dark-red": "#D6236A",
        oxblood: "#7F1D1D",
        "color-bright-red": "#ED0027",
      },
      borderColor: (theme) => ({
        ...theme("colors"),
        "test-border": "red",
      }),
    },
  },
  plugins: [],
};
