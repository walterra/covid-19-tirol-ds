// cheerio is a jquery API inspired lib for nodejs
const d3 = require('d3-array');
const fs = require('fs');
const glob = require('glob');
const moment = require('moment');

const deduped_filename = './data/tirol_obituaries_deduped.csv';
const deduped_filename_weekly = './data/tirol_obituaries_deduped_weekly.csv';

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

const years = ['2017', '2018', '2019', '2020'];
const weeks = Array.apply(0, Array(52)).map((d, i) => i + 1);
const columns = ['district','municipaly','year','week','count'];

const filled = [];

const grouped = d3.groups(dedupedWithYearWeek, d => d[4], d => d[3], d => d[1], d => d[2]);
grouped.forEach(g1 => {
  console.log(g1[0]);
  const district = g1[0];
  g1[1].forEach(g2 => {
    console.log(`  ${g2[0]}`);
    const municipaly = g2[0];
    years.forEach(year => {
      const g3 = g2[1].find(d => d[0] === year);

      if (g3 === undefined) {
        weeks.forEach(week => {
          const row = [district, municipaly, year, week, 0];
          filled.push(row.join(','));
        });
        return;
      }


    console.log(`    ${year}`);
      weeks.forEach(week => {
        const g4 = g3[1].find(d => d[0] === week);

        if (g4 === undefined) {
          const row = [district, municipaly, year, week, 0];
          filled.push(row.join(','));
          return;
        }

        const weekValue = g4[1].length;
        const row = [district, municipaly, year, week, weekValue];
        filled.push(row.join(','));
      })
    });
  })
});

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

const data_weekly = `${columns.join(',')}\n${filled.join('\n')}`;

// write the CSV file
fs.writeFile(deduped_filename_weekly, data_weekly, 'utf8', (err) => {
  if (err) return console.log(err);
  console.log('Done.');
})



