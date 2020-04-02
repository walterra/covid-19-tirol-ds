districts = {
  'imst': 'Imst',
  'innsbruck-land': 'Innsbruck-Land',
  'innsbruck-stadt': 'Innsbruck-Stadt',
  'kitzbuehel': 'Kitzbühel',
  'kufstein': 'Kufstein',
  'landeck': 'Landeck',
  'lienz': 'Lienz',
  'reutte': 'Reutte',
  'schwaz': 'Schwaz'
};

var supportedKeys = Object.keys(districts);
supportedKeys.push('districts');

var params={};
window.location.search
  .replace(/[?&]+([^=&]+)=([^&]*)/gi, function(str,key,value) {
    params[key] = value;
  }
);

const defaultDistrict = (params.district !== undefined) ?params.district : 'landeck';

function loadVega(f, id) {
  if (!supportedKeys.includes(f)) {
    console.error('unsupported key:', f);
    return;
  }

  $.get('charts/vega_'+f+'.json', function( spec ) {
    var opt = {"renderer": "canvas", "actions": false};
    vegaEmbed("#"+id, spec, opt);
  });
}

$(document).ready(function(){
  loadVega('districts', 'vega_districts');
  loadVega(defaultDistrict, 'vega_drilldown');

  var $dropdown = $("#select_district");
  var options = [];
  Object.keys(districts).forEach(function(d) {
    options.push("<option value=\"" + d + "\" " + ((d === defaultDistrict) ? 'selected' : '') + ">" + districts[d] + "</option>");
  })
  $dropdown.html(options.join(''));

  $dropdown.change(function(){
      var selectedDistrict = $(this).children("option:selected").val();
      loadVega(selectedDistrict, 'vega_drilldown');
  });
});
