// http://www.statistik.at/web_de/statistiken/menschen_und_gesellschaft/bevoelkerung/gestorbene/023634.html

const countByYearReference = {
  '2017': 5930,
  '2018': 6137,
};

$(document).ready(function(){
  $.get('data/count_by_year.json', function( countByYear ) {
    console.log('countByYear', countByYear);

    const p2017 = Math.round(countByYear['2017'] / countByYearReference['2017'] * 10000) / 100;
    const p2018 = Math.round(countByYear['2018'] / countByYearReference['2018'] * 10000) / 100;

    const table = $('#integrity').html(`
      <tr><th>Jahr</th><th>Referenz</th><th>Crawling</th><th>Anteil Crawling/Referenz</th></tr>
      <tr><td>2017</td><td>${countByYearReference['2017']}</td><td>${countByYear['2017']}</td><td>${p2017}%</td></tr>
      <tr><td>2018</td><td>${countByYearReference['2018']}</td><td>${countByYear['2018']}</td><td>${p2018}%</td></tr>
    `)
  });
});
