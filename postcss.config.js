const purgecss = require('@fullhuman/postcss-purgecss')({
  content: ['./src/site/**/*.njk'],
});

module.exports = {
  plugins: [
    require('tailwindcss'),
    require('postcss-advanced-variables'),
    require('postcss-import'),
    require('postcss-custom-properties'),
    require('postcss-nested'),
    require('postcss-media-minmax'),
    require('postcss-custom-media'),
    require('autoprefixer'),
    ...(process.env.NODE_ENV === 'production' ? [purgecss, require('cssnano')] : []),
  ],
};
