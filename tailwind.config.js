/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        phi: '#6366f1', // Une couleur indigo pour l'identité de PHI
      },
      keyframes: {
        'phi-fade-up': {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'phi-fade-up': 'phi-fade-up 0.65s ease-out forwards',
      },
    },
  },
  plugins: [],
}