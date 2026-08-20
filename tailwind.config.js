/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Bungee', 'system-ui', 'sans-serif'],
        sans: ['Manrope', 'system-ui', 'sans-serif'],
      },
      colors: {
        lavo: {
          blue: '#2f6fed',
          aqua: '#0aa8c4',
          cyan: '#5eead4',
          ink: '#0b2340',
          paper: '#eef7fb',
          muted: '#5c7a94',
          red: '#e63946',
          green: '#06a77d',
        },
      },
      boxShadow: {
        hard: '4px 4px 0 #0b2340',
        'hard-lg': '7px 7px 0 #0b2340',
        'hard-aqua': '6px 6px 0 #0aa8c4',
        'hard-sm': '3px 3px 0 rgba(11,35,64,0.35)',
      },
      backgroundImage: {
        halftone:
          'radial-gradient(circle, rgba(255,255,255,0.6) 1.5px, transparent 1.6px)',
      },
    },
  },
  plugins: [],
}
