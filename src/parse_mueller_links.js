// cheerio is a jquery API inspired lib for nodejs
const cheerio = require('cheerio')
const fs = require('fs');
const request = require('request');

// remove node and command from args list
var cliArgs = process.argv.slice(2);

// quit if no directory name was supplied as arg
if (cliArgs.length !== 1) {
  console.error('Missing command line argument.');
  process.exit();
}

const dirName = cliArgs[0];
console.log(`Parsing directory: ${dirName}`);

const dir = `./scrape/${dirName}`;

// setup html extension so we can simply require it
require.extensions['.html'] = function (module, filename) {
  module.exports = fs.readFileSync(filename, 'utf8');
};

// setup csv extension so we can simply require it
require.extensions['.csv'] = function (module, filename) {
  module.exports = fs.readFileSync(filename, 'utf8');
};

// load CSV and split lines to array
const gemeindenCSV = require(`../assets/gemeinden.csv`).split('\n');

const gemeinden = {};

for (let i = 0; i < gemeindenCSV.length; i++) {
  // Bsp: Abfaltersbach,Gemeinde,Lienz
  const row = gemeindenCSV[i].split(',');
  if (row.length === 3) {
    const [municipaly, municipalyType, district] = gemeindenCSV[i].split(',');
    gemeinden[municipaly] = district;
  }
}

// parse gets the file id and returns an array of links
const parse = (id) => {
  const html = require(`.${dir}/${id}`);
  const $ = cheerio.load(html);

  const deceasedItem = $('.ghost-white');

  const data = [];

  deceasedItem.each((i, e) => {
    const link = $(e).attr('href');
    if (link !== undefined && link !== '') {
      data.push(link);
    }
  });

  return data;
}

function fetchAndSave(url) {
  console.log(`url: ${url}`);
  const s = url.split('/');
  s.pop();
  const name = s.pop();
  request(url).pipe(fs.createWriteStream(`./scrape/scrape_mueller_parten/${name}.html`));
}

fs.readdir(dir, (err, files) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(`Number of files: ${files.length}`);

  // first CSV row = headers
  const data = [];

  // parse all files and add CSV rows
  files.forEach(f => data.push(...parse(f)));

  console.log(`Number of links: ${data.length - 1}`);

  function popAndFetch() {
    const url = data.pop();
    fetchAndSave(url);
    if (data.length > 0) {
      setTimeout(popAndFetch, 250);
    }
  }

  popAndFetch();
});


