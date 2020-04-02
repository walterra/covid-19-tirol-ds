// cheerio is a jquery API inspired lib for nodejs
const cheerio = require('cheerio')
const fs = require('fs');

// setup csv extension so we can simply require it
require.extensions['.csv'] = function (module, filename) {
  module.exports = fs.readFileSync(filename, 'utf8');
};

// load CSV and split lines to array
const rows1 = require(`../data/scrape_kuratorium_bestattung_20200327_180153.csv`).split('\n');
const rows2 = require(`../data/scrape_trauerhilfe_20200327_174811.csv`).split('\n');
const rows3 = require(`../data/scrape_dellemann.csv`).split('\n');
const rows4 = require(`../data/scrape_kroell.csv`).split('\n');

const rows = [];
rows.push(...rows1);
rows.push(...rows2);
rows.push(...rows3);
rows.push(...rows4);

console.log(`Running deduplication ...`);
console.log(`rows: ${rows.length}`);

const dedupe = [...new Set(rows)].filter(d => {
  // 27.03.2020,Jenbach,Schwaz
  const row = d.split(',');
  const date = row[0].split('.');
  // skip rows before June 2016
  if (parseInt(date[2]) > 2016) return true;
  if (parseInt(date[2]) === 2016 && parseInt(date[1]) > 5) return true;
  return false;
});

console.log(`dedu: ${dedupe.length}`);

const data = `date,municipaly,district,hash\n${dedupe.join('\n')}`;

// write the CSV file
fs.writeFile(`./data/tirol_obituaries.csv`, data, 'utf8', (err) => {
  if (err) return console.log(err);
  console.log('Done.');
})



