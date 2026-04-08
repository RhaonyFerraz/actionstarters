/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sap: {
          blue: '#005D9E',
          gold: '#F0AB00',
          dark: '#1D2A3A',
          gray: '#EAEAEC'
        },
        neon: {
          green: '#38D31A',
          cyan: '#00FFFF',
          purple: '#ffffff',
          border: '#1A1A1A',
          deep: '#121212',
          glow: 'rgba(56, 211, 26, 0.4)',
          'glow-purple': 'rgba(255, 255, 255, 0.4)',
          'glow-cyan': 'rgba(0, 255, 255, 0.4)'
        }
      }
    },
  },
  plugins: [],
}
