/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#dc2626',
        dark: '#0f0f0f',
        dark2: '#1a1a1a',
      },
    },
  },
  plugins: [],
}
