/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#a8e063',
          400: '#4ade80',
          500: '#2db87a',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        ink: '#0f2d1a',
      },
      boxShadow: {
        soft: '0 18px 45px -28px rgba(15, 23, 42, 0.45)',
      },
    },
  },
  plugins: [],
};
