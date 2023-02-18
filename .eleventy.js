const eleventyGoogleFonts = require('eleventy-google-fonts');
const markdownIt = require('markdown-it');
const markdownItAttrs = require('markdown-it-attrs');
const excerpt = require('./src/plugins/excerpt');
const shortcodes = require('./src/utils/shortcodes');
const Image = require('@11ty/eleventy-img');
const path = require('path');
const outdent = require('outdent');
const { DateTime } = require('luxon');

const stringifyAttributes = (attributeMap) => {
  return Object.entries(attributeMap)
    .map(([attribute, value]) => {
      if (typeof value === 'undefined') return '';
      return `${attribute}="${value}"`;
    })
    .join(' ');
};

const imageShortcode = async (
  src,
  alt,
  className = undefined,
  widths = [400, 800, 1280],
  formats = ['webp', 'jpeg'],
  sizes = '100vw'
) => {
  const imageMetadata = await Image(src, {
    widths: [...widths, null],
    formats: [...formats, null],
    outputDir: '_site/assets/images',
    urlPath: '/assets/images',
  });

  const sourceHtmlString = Object.values(imageMetadata)
    // Map each format to the source HTML markup
    .map((images) => {
      // The first entry is representative of all the others
      // since they each have the same shape
      const { sourceType } = images[0];

      // Use our util from earlier to make our lives easier
      const sourceAttributes = stringifyAttributes({
        type: sourceType,
        // srcset needs to be a comma-separated attribute
        srcset: images.map((image) => image.srcset).join(', '),
        sizes,
      });

      // Return one <source> per format
      return `<source ${sourceAttributes}>`;
    })
    .join('\n');

  const getLargestImage = (format) => {
    const images = imageMetadata[format];
    return images[images.length - 1];
  };

  const largestUnoptimizedImg = getLargestImage(formats[0]);
  const imgAttributes = stringifyAttributes({
    src: largestUnoptimizedImg.url,
    width: largestUnoptimizedImg.width,
    height: largestUnoptimizedImg.height,
    alt,
    loading: 'lazy',
    decoding: 'async',
  });
  const imgHtmlString = `<img ${imgAttributes}>`;

  const pictureAttributes = stringifyAttributes({
    class: className,
  });
  const picture = `<picture ${pictureAttributes}>
    ${sourceHtmlString}
    ${imgHtmlString}
    <p class="mt-0 text-xs">${alt}</p>
  </picture>`;

  return outdent`${picture}`;
};

module.exports = (config) => {
  // Compress and combine JS files
  config.addFilter('jsmin', require('./src/utils/minify-js.js'));

  config.addPlugin(eleventyGoogleFonts);

  let options = {
    html: true,
  };

  let markdownLib = markdownIt(options).use(markdownItAttrs);

  config.setLibrary('md', markdownLib);

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

  config.addCollection('blog', (collection) => {
    return [...collection.getFilteredByGlob('./src/site/posts/*.md')].reverse();
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

  // Return the smallest number argument
  config.addFilter('min', (...numbers) => {
    return Math.min.apply(null, numbers);
  });

  function filterTagList(tags) {
    return (tags || []).filter((tag) => ['all', 'nav', 'post', 'posts'].indexOf(tag) === -1);
  }

  config.addFilter('filterTagList', filterTagList);

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

  config.setFrontMatterParsingOptions({
    excerpt: true,
    excerpt_separator: '<!-- excerpt -->',
  });

  config.addShortcode('excerpt', (article) => {
    return excerpt(article);
  });

  config.addAsyncShortcode('myImage', imageShortcode);

  config.addFilter('getReadingTime', (text) => {
    const wordsPerMinute = 200;
    const numberOfWords = text.split(/\s/g).length;
    return Math.ceil(numberOfWords / wordsPerMinute);
  });

  // Shortcodes
  config.addPairedShortcode('quote', shortcodes.quote);

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
