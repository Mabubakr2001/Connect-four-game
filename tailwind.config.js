/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        main: "#7945FF",
        main2: "#FD6687",
        main3: "#FFCE67",
      },
      transitionDuration: {
        main: "0.3s",
        600: "600ms",
      },
      fontFamily: {
        sans: ["Space Grotesk", "sans-serif"],
      },
      borderWidth: {
        3: "3px",
      },
    },
  },
  plugins: [],
};
