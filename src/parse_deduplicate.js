// cheerio is a jquery API inspired lib for nodejs
const cheerio = require('cheerio')
const fs = require('fs');
const glob = require('glob');
const moment = require('moment');

const deduped_filename = './data/tirol_obituaries_deduped.csv';

const rows_existing = glob.sync(deduped_filename).flatMap((filename) => fs.readFileSync(filename, 'utf8').split('\n'));
// remove the CSV header row
rows_existing.shift();
// remove year and week, we'll add them again after deduplication
const rows_existing_dedupe_format = rows_existing.map(row => {
  const d = row.split(',');
  d.splice(1,2);
  return d.join(',');
})

const rows_new = glob.sync("./parse/scrape*.csv").flatMap((filename) => fs.readFileSync(filename, 'utf8').split('\n'));

const rows = [...rows_existing_dedupe_format, ...rows_new];

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

moment.locale('at')

// adds year and week columns
const dedupedWithYearWeek = dedupe.map(line => {
  // date format: 26.03.2020
  const row = line.split(',');
  const year = row[0].split('.').pop();
  const week = moment(row[0], 'DD.MM.YYYY').isoWeek();
  const date = row.shift();
  return [
    date,
    year,
    week,
    ...row
  ];
});

const latestDate = dedupedWithYearWeek[0][0];

const metadata = {
  countByYear,
  latestDate
};


// write count by year as JSON
fs.writeFile(`./docs/data/metadata.json`, JSON.stringify(metadata, null, 2), 'utf8', (err) => {
  if (err) return console.log(err);
});


const data = `date,year,week,municipaly,district,hash\n${dedupedWithYearWeek.join('\n')}`;

// write the CSV file
fs.writeFile(deduped_filename, data, 'utf8', (err) => {
  if (err) return console.log(err);
  console.log('Done.');
})



