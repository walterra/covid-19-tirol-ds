// cheerio is a jquery API inspired lib for nodejs
const cheerio = require('cheerio')
const fs = require('fs');
const glob = require("glob")
 
const rows = glob.sync("./data/scrape*.csv").flatMap((filename) => fs.readFileSync(filename, 'utf8').split('\n'));

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



