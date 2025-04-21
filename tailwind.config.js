/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'safe-green': '#00FF00',
        'safe-orange': '#FFA500',
        'safe-red': '#FF0000',
        'primary': '#1a1a1a',
      },
    },
  },
  plugins: [],
} 