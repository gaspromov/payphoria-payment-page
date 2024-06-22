/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: "tw-",
  mode: "jit",
  important: "body #root",
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0863EC",
          hover: "#0756CC",
          disabled: "#B5D0F9",
          light: "#3083FF",
        },
        accent: {
          DEFAULT: "#1F1F1F",
        },
        secondary: {
          DEFAULT: "#8C8C8C",
          light: "#F2F2F2",
          hover: "#E8E8E8",
        },
      }
    }
  },
  content: ["./src/**/*.{html,ts}"],
  plugins: [],
}

