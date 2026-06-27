/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#A30D0D',
          light: '#D62828',
        },
        accent: '#F4B400',
        brown: '#8B5E3C',
        charcoal: '#2B2B2B',
      },
      fontFamily: {
        heading: ['"League Spartan"', 'sans-serif'],
        body: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
