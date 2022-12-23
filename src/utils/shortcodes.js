const outdent = require('outdent');

const { escape } = require('lodash');
const markdownLib = require('markdown-it')();

const quote = (children, source, cite) => {
  if (!/https?:\/\//.test(cite)) {
    throw new Error(`Quote citation is not a recognized url: ${cite}.`);
  }
  if (!source) {
    throw new Error('Quotes must attribute a source.');
  }
  if (!children) {
    throw new Error('Quotes must have non-empty content.');
  }

  const html = outdent`
    <blockquote class="p-4 my-4 border-l-4 border-gray-300">
      <div class="text-italic font-medium leading-relaxed">${children}</div>
      <cite class="text-normal">
        <a href="${escape(cite)}" target="_blank" rel="noreferrer noopener">${source}</a>
      </cite>
    </blockquote>
    `;

  return html;
};

module.exports = { quote };
