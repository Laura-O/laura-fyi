module.exports = (config) => {
  // Compress and combine JS files
  config.addFilter('jsmin', require('./src/utils/minify-js.js'));

  // Minify the HTML in production
  if (process.env.NODE_ENV == 'production') {
    config.addTransform('htmlmin', require('./src/utils/minify-html.js'));
  }

  // Watch for changes and reload
  config.addWatchTarget('src/postcss');

  // Copy assets to dist
  config.addPassthroughCopy({ 'src/assets/image': 'assets/images' });
  config.addPassthroughCopy({ 'src/assets/js': 'assets/js' });

  config.addPassthroughCopy({
    'node_modules/@fortawesome/fontawesome-free/css/all.min.css': 'css/fontawesome.css',
  });
  config.addPassthroughCopy({ 'node_modules/@fortawesome/fontawesome-free/webfonts': 'webfonts' });

  config.addCollection('blog', (collection) => {
    return [...collection.getFilteredByGlob('./src/site/posts/*.md')].reverse();
  });

  return {
    templateFormats: ['njk', 'md', '11ty.js'],
    markdownTemplateEngine: 'njk',
    dataTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    passthroughFileCopy: true,
    dir: {
      input: 'src/site',
      data: '../_data',
      images: '../assets/images',
      includes: '../includes',
      layouts: '../layouts',
      output: 'dist',
    },
  };
};
