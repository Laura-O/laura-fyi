const eleventyGoogleFonts = require('eleventy-google-fonts');
const markdownIt = require('markdown-it');
const excerpt = require('./src/plugins/excerpt');
const shortcodes = require('./src/utils/shortcodes');
const { DateTime } = require('luxon');
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');

const { imageShortcode } = require('./config/shortcodes');

module.exports = (config) => {
  config.addPlugin(eleventyGoogleFonts);
  config.addPlugin(syntaxHighlight);

  let options = {
    html: true,
  };

  let markdownLib = markdownIt(options);

  // Minify the HTML in production
  if (process.env.NODE_ENV == 'production') {
    config.addTransform('htmlmin', require('./src/utils/minify-html.js'));
  }

  // Watch for changes and reload
  config.addWatchTarget('src/postcss');

  // Copy assets to dist
  config.addPassthroughCopy({ 'src/assets/images': 'assets/images' });
  config.addPassthroughCopy({ 'src/assets/js': 'assets/js' });

  config.addPassthroughCopy({
    'node_modules/@fortawesome/fontawesome-free/css/all.min.css': 'css/fontawesome.css',
  });
  config.addPassthroughCopy({ 'node_modules/@fortawesome/fontawesome-free/webfonts': 'webfonts' });

  config.setFrontMatterParsingOptions({
    excerpt: true,
    excerpt_separator: '<!-- excerpt -->',
  });

  // Collections
  config.addCollection('blog', (collection) => {
    return [...collection.getFilteredByGlob('./src/site/posts/*.md')].reverse();
  });

  config.addCollection('postsByYear', (collection) => {
    const posts = collection.getFilteredByTag('posts').reverse();
    const years = posts.map((post) => post.date.getFullYear());
    const uniqueYears = [...new Set(years)];

    const postsByYear = uniqueYears.reduce((prev, year) => {
      const filteredPosts = posts.filter((post) => post.date.getFullYear() === year);

      return [...prev, [year, filteredPosts]];
    }, []);

    return postsByYear;
  });

  // Filter
  // Compress and combine JS files
  config.addFilter('jsmin', require('./src/utils/minify-js.js'));
  config.addFilter('filterTagList', filterTagList);
  config.addFilter('getReadingTime', (text) => {
    const wordsPerMinute = 200;
    const numberOfWords = text.split(/\s/g).length;
    return Math.ceil(numberOfWords / wordsPerMinute);
  });
  // Return the smallest number argument
  config.addFilter('min', (...numbers) => {
    return Math.min.apply(null, numbers);
  });

  // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
  config.addFilter('htmlDateString', (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat('yyyy-LL-dd');
  });

  config.addFilter('readableDate', (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat('dd LLL yyyy');
  });

  // Get the first `n` elements of a collection.
  config.addFilter('head', (array, n) => {
    if (!Array.isArray(array) || array.length === 0) {
      return [];
    }
    if (n < 0) {
      return array.slice(n);
    }

    return array.slice(0, n);
  });

  function filterTagList(tags) {
    return (tags || []).filter((tag) => ['all', 'nav', 'post', 'posts'].indexOf(tag) === -1);
  }

  // Shortcodes
  config.addPairedShortcode('quote', shortcodes.quote);
  config.addShortcode('excerpt', (article) => {
    return excerpt(article);
  });
  config.addAsyncShortcode('myImage', imageShortcode);

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
