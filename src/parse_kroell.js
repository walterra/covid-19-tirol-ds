// cheerio is a jquery API inspired lib for nodejs
const cheerio = require('cheerio')
const fs = require('fs');
const hashCode = require('./hash');

const {
  PARSE_WRITE_DIR_NAME,
} = require('./lib');

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

// load CSV and split lines to array
const orteCSV = require(`../assets/orte.csv`).split('\n');

const orte = {};

for (let i = 0; i < orteCSV.length; i++) {
  // Bsp: abc,Lienz
  const row = orteCSV[i].split(',');
  if (row.length === 2) {
    const [ort, location] = orteCSV[i].split(',');
    orte[ort] = location;
  }
}

const unknownLocations = {};

// parse gets the file id and returns an array of csv rows
const parse = (id) => {
  const html = require(`.${dir}/${id}`);
  const $ = cheerio.load(html);

  const deceasedItem = $('.parte');

  const data = [];

  deceasedItem.each((i, e) => {
    const name = $(e).find('.partenname').text().trim();
    const hash = hashCode(name);
    const date = $(e).find('.partendatum').text().trim().split(' ')[1];
    const l = $(e).find('.partenort').text().trim();
    const texts = [date,l,name];
    if (l === '') {
      // console.log(`${name},${[date,l].join(',')}`);
    }

    const location = orte[l] !== undefined ? orte[l] : l;
    if (location !== 'SKIP' && location !== '' && location.includes(',') === false) {
      const district = gemeinden[location];
      if (district === undefined && unknownLocations[location] === undefined) {
        // console.error(`Unknown location in file ${id}: ${location}`);
        console.error(`${[location,l].join(',')}`);
        //console.error(`----`);
        unknownLocations[location] = texts.join(',');
        // process.exit();
      } else {
        data.push([date,location,district,hash].join(','));
      }
    }
  });

  return data;
}

fs.readdir(dir, (err, files) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(`Number of files: ${files.length}`);

  // first CSV row = headers
  let data = ['date,municipaly,district,hash'];

  // parse all files and add CSV rows
  files.forEach(f => data.push(...parse(f)));

  console.log(`Number of cases: ${data.length - 1}`);

  // write the CSV file, use the directory name as the filename
  fs.writeFile(`./${PARSE_WRITE_DIR_NAME}/${dirName}.csv`, data.join('\n'), 'utf8', (err) => {
    if (err) return console.log(err);
    console.log('Done.');
  })
});



