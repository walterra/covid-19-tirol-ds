const d3 = require('d3-array');
const fs = require('fs');
const glob = require('glob');

const gemeinden_raw_filename = './assets/gemeinden_einwohner_2020.txt'
const gemeinden_out_filename = './assets/gemeinden_einwohner_2020.csv'
const rows = glob.sync(gemeinden_raw_filename).flatMap((filename) => fs.readFileSync(filename, 'utf8').split('\n'));

const cleanup = rows.map(row => {
  const [municipaly, population] = row.split('\t');
  return [municipaly, `${population}`.replace('.', '')];
})

const data = cleanup.map(d => d.join(',')).join('\n');

// write the CSV file
fs.writeFile(gemeinden_out_filename, data, 'utf8', (err) => {
  if (err) return console.log(err);
  console.log('Done.');
})
