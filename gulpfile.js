const { parallel, watch } = require('gulp');

// Pull in each task
const fonts = require('./gulp-tasks/fonts.js');

// The default (if someone just runs `gulp`) is to run each task in parrallel
exports.default = parallel(fonts);
