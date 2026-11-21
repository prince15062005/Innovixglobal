/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#05050A',
          light: '#17171D',
        },
        gold: {
          DEFAULT: '#C5A15A',
          light: '#E5C98D',
          dark: '#A68645',
        },
        white: '#FFFFFF',
        neutral: '#D5D0C7',
        charcoal: '#17171D',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-down': 'slideDown 0.4s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      backgroundImage: {
        'gradient-gold': 'linear-gradient(135deg, #C5A15A 0%, #E5C98D 50%, #C5A15A 100%)',
        'gradient-dark': 'linear-gradient(135deg, #05050A 0%, #17171D 100%)',
        'gradient-hero': 'linear-gradient(180deg, rgba(5,5,10,0.8) 0%, rgba(23,23,29,0.9) 100%)',
      },
    },
  },
  plugins: [],
}