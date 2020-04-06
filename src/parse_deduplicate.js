// cheerio is a jquery API inspired lib for nodejs
const cheerio = require('cheerio')
const fs = require('fs');
const glob = require("glob")

const rows = glob.sync("./data/scrape*.csv").flatMap((filename) => fs.readFileSync(filename, 'utf8').split('\n'));

console.log(`Running deduplication ...`);
console.log(`rows: ${rows.length}`);

function reformatDate(row) {
  const d = row.split(',');
  const d2 = d[0].split('.');
  return `${d2[2]}${d2[1]}${d2[0]}`;
}

const dedupe = [...new Set(rows)]
  .filter(d => {
    // 27.03.2020,Jenbach,Schwaz
    const row = d.split(',');
    const date = row[0].split('.');
    // skip rows before June 2016
    if (parseInt(date[2]) > 2016) return true;
    if (parseInt(date[2]) === 2016 && parseInt(date[1]) > 5) return true;
    return false;
  })
  .sort((a, b) => {
    return reformatDate(b).localeCompare(reformatDate(a));
  });

console.log(`dedu: ${dedupe.length}`);

var countByYear = dedupe.reduce((p, c) => {
  const d = c.split(',')[0];
  const year = d.split('.')[2];
  if (!p.hasOwnProperty(year)) {
    p[year] = 0;
  }
  p[year]++;
  return p;
}, {});

console.log('count by year:');

Object.keys(countByYear).forEach(y => {
  console.log(`${y}: ${countByYear[y]}`);
})

// write count by year as JSON
fs.writeFile(`./data/count_by_year.json`, JSON.stringify(countByYear, null, 2), 'utf8', (err) => {
  if (err) return console.log(err);
})

const data = `date,municipaly,district,hash\n${dedupe.join('\n')}`;

// write the CSV file
fs.writeFile(`./data/tirol_obituaries_deduped.csv`, data, 'utf8', (err) => {
  if (err) return console.log(err);
  console.log('Done.');
})



