// based on Twitter's Hogan.js
// https://github.com/twitter/hogan.js

var extract = require('extract-comments');

var rAmp = /&/g,
    rLt = /</g,
    rGt = />/g,
    rApos =/\'/g,
    rQuot = /\"/g,
    hChars =/[&<>\"\']/;

var isEscapedBlock = /(\/\*.*\s+\*\/)/g;

function coerceToString(val) {
  return String((val === null || val === undefined) ? '' : val);
}

function escape(str) {
  return hChars.test(str) ?
    str
      .replace(rAmp,'&amp;')
      .replace(rLt,'&lt;')
      .replace(rGt,'&gt;')
      .replace(rApos,'&#39;')
      .replace(rQuot, '&quot;') :
    str;
}

module.exports = function(str) {
  str = coerceToString(str);
  var substrings = str.split(isEscapedBlock);

  substrings = substrings.map(function(elem) {
    if (isEscapedBlock.test(elem))
      return elem.slice(3, -3);
    else
      return escape(elem);
  });

  return substrings.join('');
};