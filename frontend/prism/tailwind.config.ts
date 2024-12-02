/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'scan': ['Sixtyfour', 'sans-serif'],  // Changed to 'scan'
        'pixel': ['"Press Start 2P"', 'monospace'], // Changed to 'pixel'
        'digital': ['VT323', 'monospace'], // Changed to 'digital'
      },
      colors: {
        'vapor-pink': '#FF00D6',
        'vapor-purple': '#D500F9',
        'vapor-blue': '#90CAF9',        
        'vapor-green': '#69F0AE',
        'vapor-yellow': '#FFF176',
        'vapor-dark': '#282c34',  // Darker background for contrast
        'vapor-light': '#f8f8f2', // Light text for contrast
        'vapor-grid': '#333333',
      },
      backgroundImage: {
        'digital-sun': 'radial-gradient(circle, #FF00D6 30%, transparent 70%), linear-gradient(to bottom, #D500F9, transparent)',
        'grid': 'linear-gradient(to right, #333333 1px, transparent 1px), linear-gradient(to bottom, #333333 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid': '20px 20px',
      },
      animation: {
        'glow': 'glow 5s linear infinite',
        'scanlines': 'scanlines 0.5s linear infinite',
      },
      keyframes: {
        glow: {
          '0%, 100%': {  textShadow: '0 0 10px #FF00D6, 0 0 20px #D500F9, 0 0 30px #FF00D6' },
          '50%': {  textShadow: '0 0 20px #FF00D6, 0 0 30px #D500F9, 0 0 40px #FF00D6' },
        },
         scanlines: {
          '0%': {  backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '0 10px' },
        },
      },
    },
  },
  plugins: [],
}