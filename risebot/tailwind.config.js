/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/elements/UglyDogGameWrapper.js",
    "./components/elements/UglyDogGameIntegration.js",
    "./public/uglydog-game/**/*.{js,html}",
    "./app/home-03/page.js",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#6c63ff',
        'primary-dark': '#5046e5',
        'secondary': '#3b32cc',
        'dark-bg': 'rgba(8, 19, 34, 0.7)',
        'game-border': 'rgba(108, 99, 255, 0.2)',
      },
      animation: {
        'float': 'float 2s infinite ease-in-out',
        'glowing': 'glowing 4s infinite ease-in-out',
        'popIn': 'popIn 0.5s ease-out',
      },
      boxShadow: {
        'game': '0 0 15px rgba(108, 99, 255, 0.6)',
        'button': '0 6px 20px rgba(108, 99, 255, 0.4)',
      }
    },
  },
  plugins: [],
  // Prefix untuk menghindari konflik dengan CSS yang sudah ada
  prefix: 'tw-',
  // Important untuk override CSS yang sudah ada
  important: '.uglydog-game-container',
}
