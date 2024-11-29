/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Include all your source files
    "node_modules/@material-tailwind/react/**/*.{js,ts,jsx,tsx}", // Include Material Tailwind
    "./node_modules/react-tailwindcss-datepicker/dist/index.esm.{js,ts}", // Include Datepicker
  ],
  theme: {
    extend: {
      colors: {
        "dark-purple": "#081A51",
        "light-white": "rgba(255,255,255,0.17)",
      },
    },
  },
  plugins: [],
};
