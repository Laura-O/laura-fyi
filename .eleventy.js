const eleventyGoogleFonts = require('eleventy-google-fonts');
const excerpt = require('./src/plugins/excerpt');

module.exports = (config) => {
  // Compress and combine JS files
  config.addFilter('jsmin', require('./src/utils/minify-js.js'));

  config.addPlugin(eleventyGoogleFonts);

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

  config.addCollection('postsByYear', (collection) => {
    const posts = collection.getFilteredByTag('post').reverse();
    const years = posts.map((post) => post.date.getFullYear());
    const uniqueYears = [...new Set(years)];

    const postsByYear = uniqueYears.reduce((prev, year) => {
      const filteredPosts = posts.filter((post) => post.date.getFullYear() === year);

      return [...prev, [year, filteredPosts]];
    }, []);

    return postsByYear;
  });

  config.setFrontMatterParsingOptions({
    excerpt: true,
    excerpt_separator: '<!-- excerpt -->',
  });

  config.addShortcode('excerpt', (article) => {
    return excerpt(article);
  });

  config.addFilter('getReadingTime', (text) => {
    const wordsPerMinute = 200;
    const numberOfWords = text.split(/\s/g).length;
    return Math.ceil(numberOfWords / wordsPerMinute);
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
