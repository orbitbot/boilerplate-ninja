// based on Twitter's Hogan.js
// https://github.com/twitter/hogan.js

var ampersand     = /&/g,
    lessThan      = /</g,
    greaterThan   = />/g,
    aphostrophe   = /\'/g,
    quotation     = /\"/g,
    leadingSpaces = /^\s+/,
    singleSpace   = /\s/g,
    lineBreak     = /\r\n|\n|\r/g,
    escChars      = /[&<>\"\']/;

var isEscapedBlock = /^(\s*\/\*\s*.*\s*\*\/\s*[\r\n|\n|\r])/m;

function coerceToString(val) {
  return String((val === null || val === undefined) ? '' : val);
}

function escape(str) {
  return escChars.test(str) ?
    str
      .replace(ampersand,   '&amp;')
      .replace(lessThan,    '&lt;')
      .replace(greaterThan, '&gt;')
      .replace(aphostrophe, '&#39;')
      .replace(quotation,   '&quot;') :
    str;
}

function lineFormat(str) {
  var lines = str.split(lineBreak);
  lines = lines.map(function(elem) {
    return '\n<span>' + elem.replace(leadingSpaces, function(spaces) {
                          return spaces.replace(singleSpace, '&nbsp;');
                        }) +
           '<br></span>';
  });

  return lines.join('');
}

module.exports = function(str) {
  str = coerceToString(str);
  var substrings = str.split(isEscapedBlock);

  substrings = substrings.map(function(elem) {
    if (isEscapedBlock.test(elem))
      return elem.trim().slice(2, -2);
    else
      return lineFormat(escape(elem));
  });

  return substrings.join('');
};