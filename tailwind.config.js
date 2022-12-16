const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['src/**/*.njk'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Source Serif Pro', ...defaultTheme.fontFamily.serif],
        sans: ['Inter VF', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};
