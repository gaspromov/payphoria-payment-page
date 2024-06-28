/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: "tw-",
  important: "body #root",
  corePlugins: {
    preflight: false,
  },
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#289CFF",
          hover: "#0756CC",
        },
        accent: {
          DEFAULT: "#222222",
        },
        secondary: {
          DEFAULT: "#2E2E2E",
          hover: "#E8E8E8",
        },
        error: {
          DEFAULT: "#FF4A4A",
        },
        warn: {
          DEFAULT: "#FFD850",
        },
        success: {
          DEFAULT: "#61E134",
        },
        white: "#F4F4F4",
      },
    },
  },
  plugins: [],
};
