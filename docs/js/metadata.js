// References:
// http://www.statistik.at/web_de/statistiken/menschen_und_gesellschaft/bevoelkerung/gestorbene/023634.html
// https://www.data.gv.at/katalog/dataset/land-tirol_sterbefllenachgeschlechtundaltersgruppenintirol/resource/2caca8d5-51b0-495e-8948-50959e4e26a8

// http://www.tirolmultimedial.at/tmm/themen/1501.html
// https://www.tirol.gv.at/fileadmin/themen/statistik-budget/statistik/downloads/vz-2001.pdf
const catholics = 0.834;

const countByYearReference = {
  '2017': 5930,
  '2018': 6137,
};

$(document).ready(function(){
  $.get('data/metadata.json', function( metadata ) {
    const { countByYear, latestDate } = metadata;

    $('#latestDate').html(latestDate);

    console.log('countByYear', countByYear);

    const p2017 = Math.round(countByYear['2017'] / countByYearReference['2017'] * 10000) / 100;
    const p2018 = Math.round(countByYear['2018'] / countByYearReference['2018'] * 10000) / 100;

    $('#integrity').html(`
      <tr>
        <th>Jahr</th>
        <th>Referenz Statistik Austria</th>
        <th>Crawling</th>
        <th>Crawling/Referenz %</th>
        <th>Anteil römisch-katholisch 83,4%</th>
        <th>Crawling/römisch-katholisch %</th>
      </tr>
      <tr>
        <td>2017</td>
        <td>${countByYearReference['2017']}</td>
        <td>${countByYear['2017']}</td>
        <td>${p2017}%</td>
        <td>${Math.round(countByYearReference['2017'] * catholics)}
        <td>${Math.round(countByYear['2017'] / (countByYearReference['2017'] * catholics) * 10000) / 100}%</td>
      </tr>
      <tr>
        <td>2018</td>
        <td>${countByYearReference['2018']}</td>
        <td>${countByYear['2018']}</td>
        <td>${p2018}%</td>
        <td>${Math.round(countByYearReference['2018'] * catholics)}
        <td>${Math.round(countByYear['2018'] / (countByYearReference['2018'] * catholics) * 10000) / 100}%</td>
      </tr>
    `)
  });
});
