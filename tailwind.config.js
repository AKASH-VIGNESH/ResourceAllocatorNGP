/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",           // <--- Scans App.tsx and index.tsx in root
    "./pages/**/*.{js,ts,jsx,tsx}",  // <--- Scans your pages folder
    "./components/**/*.{js,ts,jsx,tsx}", // <--- Scans components
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        }
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}