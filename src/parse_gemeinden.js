// http://www.gemeinden.at/tirol


const cheerio = require('cheerio')
const fs = require('fs');

const filename = '../assets/gemeinden-utf8.html';

require.extensions['.html'] = function (module, filename) {
  module.exports = fs.readFileSync(filename, 'utf8');
};

const html = require(filename);
const $ = cheerio.load(html);

const gemeinden = $('#walterra-gemeinden').find('tr');

const data = {};

gemeinden.each((i, e) => {
  const spans = $(e).find('a');

  const texts = spans.map((i, e) => { return $(e).text() }).get();

  texts[2] = texts[2].replace('Bezirk ', '');
  console.log(texts.join(','));
})


