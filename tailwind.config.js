/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef8ff',
          100: '#d9efff',
          500: '#0f9fce',
          600: '#0b7da7',
          700: '#0a6388',
        },
        ink: '#172033',
      },
      boxShadow: {
        soft: '0 18px 45px -28px rgba(15, 23, 42, 0.45)',
      },
    },
  },
  plugins: [],
};
