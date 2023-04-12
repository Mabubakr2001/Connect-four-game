/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        main: "#7945FF",
        "main-hover": "#6036c9",
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
      width: {
        45: "45%",
        90: "89.7%",
      },
      gridTemplateColumns: {
        main: "repeat(7, 70px)",
      },
      gap: {
        main: "1.8rem",
      },
      padding: {
        main: "1.7rem",
      },
      height: {
        main: "534px",
        90: "89.75%",
      },
      gap: {
        4: "18px",
      },
      borderRadius: {
        circle: "50%",
      },
    },
  },
  plugins: [],
};
