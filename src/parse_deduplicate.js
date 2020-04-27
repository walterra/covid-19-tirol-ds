const d3 = require('d3-array');
const fs = require('fs');
const glob = require('glob');
const moment = require('moment');

const filename_municipaly_population = './assets/gemeinden_einwohner_2020.csv';
const deduped_filename = './data/tirol_obituaries_deduped.csv';
const deduped_filename_weekly = './data/tirol_obituaries_deduped_weekly.csv';
const deduped_filename_weekly_outlier_detection_features = './data/tirol_obituaries_deduped_weekly_outlier_detection_features.csv';

const municipaly_population_arr = glob.sync(filename_municipaly_population).flatMap((filename) => fs.readFileSync(filename, 'utf8').split('\n'));
const municipaly_population_map = {};
municipaly_population_arr.forEach(row => {
  const [municipaly, population] = row.split(',');
  municipaly_population_map[municipaly] = population;
})

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
const filled = [];

const grouped = d3.groups(dedupedWithYearWeek, d => d[4], d => d[3], d => d[1], d => d[2]);
grouped.forEach(g1 => {
  const district = g1[0];
  g1[1].forEach(g2 => {
    const municipaly = g2[0];
    years.forEach(year => {
      const g3 = g2[1].find(d => d[0] === year);

      if (g3 === undefined) {
        weeks.forEach(week => {
          const row = [district, municipaly, year, week, 0];
          filled.push(row);
        });
        return;
      }

      weeks.forEach(week => {
        const g4 = g3[1].find(d => d[0] === week);

        if (g4 === undefined) {
          const row = [district, municipaly, year, week, 0];
          filled.push(row);
          return;
        }

        const weekValue = g4[1].length;
        const row = [district, municipaly, year, week, weekValue];
        filled.push(row);
      })
    });
  })
});

yearly_stats = {};
weekly_stats = [];

const groupedOutlierYears = d3.groups(filled, d => d[1], d => d[2], d => d[3]);
groupedOutlierYears.forEach(g1 => {
  const municipaly = g1[0];

  g1[1].forEach(g2 => {
    const year = g2[0];
    if (year !== '2020') {
      counts = g2[1].map(d => d[1][0]).map(d => d[4]);
      const yearly_mean = d3.mean(counts);
      const yearly_min = d3.min(counts);
      const yearly_min_count = counts.filter(d => d === yearly_min).length;
      const yearly_max = d3.max(counts);
      const yearly_max_count = counts.filter(d => d === yearly_max).length;
      yearly_stats[municipaly] = {
        yearly_mean,
        yearly_min,
        yearly_min_count,
        yearly_min_count,
        yearly_max,
        yearly_max_count
      };
    }
  });
});

const groupedOutlierWeeks = d3.groups(filled, d => d[1], d => d[3], d => d[2]);
groupedOutlierWeeks.forEach(g1 => {
  const municipaly = g1[0];

  g1[1].forEach(g2 => {
    const week = g2[0];
    // get the weekly counts and remove 2020
    counts = g2[1].map(d => d[1][0]).map(d => d[4]).splice(0,3);
    const weekly_mean = d3.mean(counts);
    const weekly_min = d3.min(counts);
    const weekly_min_count = counts.filter(d => d === weekly_min).length;
    const weekly_max = d3.max(counts);
    const weekly_max_count = counts.filter(d => d === weekly_max).length;
    weekly_stats.push({
      municipaly,
      week,
      weekly_mean,
      weekly_min,
      weekly_min_count,
      weekly_max,
      weekly_max_count
    });
  });
});

const filled_weekly = filled.filter(row => {
  const year = row[2];
  const week = row[3];
  return year === '2020' && week < 18;

}).map(row => {
  const municipaly = row[1];
  const week = row[3];
  const count = row[4];

  const { yearly_mean, yearly_mean_count, yearly_max, yearly_max_count } = yearly_stats[municipaly];
  const { weekly_mean, weekly_mean_count, weekly_max, weekly_max_count } = weekly_stats.find(w => w.municipaly === municipaly && w.week === week);

  if (municipaly_population_map[municipaly] === undefined) {
    console.error(`Municipaly "${municipaly}" not found.`);
    process.exit()
  }

  function adjust(num) {
    return Math.round( num * 10000000000 + Number.EPSILON ) / 10000000000;
  }

  const yearly_max_adjust = adjust(Math.max(0, count - yearly_max) / Math.max(yearly_max_count,1) / 52);
  const weekly_max_adjust = adjust(Math.max(0, count - weekly_max) / Math.max(weekly_max_count,1));
  const yearly_mean_adjust = adjust(Math.max(0, count - yearly_mean) / Math.max(yearly_max,1) / 52);
  const weekly_mean_adjust = adjust(Math.max(0, count - weekly_mean) / Math.max(weekly_max,1));

  return [
    ...row,
    yearly_max_adjust,
    yearly_mean_adjust,
    weekly_max_adjust,
    weekly_mean_adjust,
  ];
});

// write count by year as JSON
fs.writeFile(`./docs/data/metadata.json`, JSON.stringify(metadata, null, 2), 'utf8', (err) => {
  if (err) return console.log(err);
});

const columns = ['date','year','week','municipaly','district','hash'];
const data = `${columns.join(',')}\n${dedupedWithYearWeek.join('\n')}`;

// write the CSV file
fs.writeFile(deduped_filename, data, 'utf8', (err) => {
  if (err) return console.log(err);
  console.log(`Saved: ${deduped_filename}`);
})

const columns_weekly = ['district','municipaly','year','week','count'];
const data_weekly = `${columns_weekly.join(',')}\n${filled.map(d => d.join(',')).join('\n')}`;

// write the CSV file
fs.writeFile(deduped_filename_weekly, data_weekly, 'utf8', (err) => {
  if (err) return console.log(err);
  console.log(`Saved: ${deduped_filename_weekly}`);
})

const columns_outlier_detection = [
  'district',
  'municipaly',
  'year',
  'week',
  'count',
  'yearly_max_diff',
  'yearly_mean_diff',
  'weekly_max_diff',
  'weekly_mean_diff',
];
const data_outlier_detection = `${columns_outlier_detection.join(',')}\n${filled_weekly.map(d => d.join(',')).join('\n')}`;

// write the CSV file
fs.writeFile(deduped_filename_weekly_outlier_detection_features, data_outlier_detection, 'utf8', (err) => {
  if (err) return console.log(err);
  console.log(`Saved: ${deduped_filename_weekly_outlier_detection_features}`);
})






