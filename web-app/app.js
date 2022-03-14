var rangeslider = document.getElementById("range");
var lblslider = document.getElementById("lblslider");
rangeslider.value = 900;
lblslider.innerHTML = rangeslider.value;
rangeslider.oninput = function() {
  lblslider.innerHTML = rangeslider.value;
}

var countslider = document.getElementById("rangecount");
var lblslider2 = document.getElementById("lblslider2");
countslider.value = 300;
lblslider2.innerHTML = countslider.value;
countslider.oninput = function() {
  lblslider2.innerHTML = countslider.value;
}

var txttime = document.getElementById("txttime");
var cbxors = document.getElementById("ors");
var cbxmg = document.getElementById("mg");
var cbxrouting = document.getElementById("routing");
var cbxdrawrouting = document.getElementById("drawrouting");

var selectalg = document.getElementById("algselect")

var orslayer = new ol.layer.Vector({source: new ol.source.Vector()})
var multigraphlayer = new ol.layer.Vector({source: new ol.source.Vector()});
var routinglayer = new ol.layer.Vector({source: new ol.source.Vector()});

cbxors.addEventListener('change', (event) => {
  if (cbxors.checked)
  {
    map.addLayer(orslayer);
  }
  else
  {
    map.removeLayer(orslayer);
  }
});
cbxmg.addEventListener('change', (event) => {
  if (cbxmg.checked)
  {
    map.addLayer(multigraphlayer);
  }
  else
  {
    map.removeLayer(multigraphlayer);
  }
});
cbxrouting.addEventListener('change', (event) => {
  if (cbxrouting.checked)
  {
    map.addLayer(routinglayer);
  }
  else
  {
    map.removeLayer(routinglayer);
  }
});

ol.proj.useGeographic();
var selectedpoints = [];
var map = new ol.Map({
    target: 'map',
    layers: [
    new ol.layer.Tile({
        source: new ol.source.OSM()
    }),
    ],
    view: new ol.View({
    center: [9.7320104,52.3758916],
    zoom: 12
    })
});

fetch("http://localhost:5000/data/hospitals.geojson")
  .then(response => response.json() )
  .then(response => {
    console.log(response)
    var points = new ol.format.GeoJSON().readFeatures(response);
    points.forEach(element => {
      element.setStyle(pointstyle);
    });
    var pointsource = new ol.source.Vector({
      features: points
    });
    pointlayer = new ol.layer.Vector({
      source: pointsource
    });
    pointlayer.set('name', 'pointlayer');
    map.addLayer(pointlayer);
});

map.on("click", function(e) 
{
  var count = 0;
  map.forEachFeatureAtPixel(e.pixel, function (feature, layer) 
  {
    if (layer.get('name') == 'pointlayer')
    {
      feature.setStyle(highlightpointstyle);
      selectedpoints.push(feature);
      count++;
    }
  });
  if (count == 0)
  {
    selectedpoints.forEach(element => {
      element.setStyle(pointstyle);
    });
    selectedpoints = [];
  }
});

const dragBox = new ol.interaction.DragBox();
dragBox.on(['boxend'], function(e) {
  selectedpoints.forEach(element => {
    element.setStyle(pointstyle);
  });
  selectedpoints = [];
  var box = dragBox.getGeometry().getExtent();
  var ll = ol.proj.toLonLat([box[0], box[1]]);
  var ur = ol.proj.toLonLat([box[2], box[3]]);
  box = [ll[0], ll[1], ur[0], ur[1]];
  pointlayer.getSource().forEachFeatureInExtent(box, function(feature) {
    feature.setStyle(highlightpointstyle);
    selectedpoints.push(feature);
  });
});

var currstate = false;
function activate_interaction()
{
  if (!currstate)
  {
    map.addInteraction(dragBox);
    currstate = true;
    return;
  }
  if (currstate)
  {
    map.removeInteraction(dragBox);
    currstate = false;
  }
}

async function drawMergedIsolines()
{
  if (selectedpoints.length == 0)
  {
    alert("you have to mark at least one feature!");
    return;
  }
  range = [300, 600, 900, 1200, 1800];
  var polygons = [];
  await Promise.all(selectedpoints.map(async element => {
    var location = element.getGeometry().getCoordinates();
    var geojson = await getDockerPolygon([location],range);
    polygons.push(geojson);
  }));
  console.log("start merging")
  geojson = mergePolygons(polygons)
  console.log(JSON.stringify(geojson))
  try
  {
    map.removeLayer(orslayer);
    orslayer = drawPolygonsToLayer(ors_style, [geojson]);
    if (cbxors.checked)
    {
      map.addLayer(orslayer);
    }
  }
  catch (Exception)
  {}
}

async function multigraph()
{
  if (selectedpoints.length > 1000)
  {
    alert("pls mark less than 10 features!");
    return;
  }
  if (selectedpoints.length == 0)
  {
    alert("you have to mark at least one feature!");
    return;
  }
  range = rangeslider.value;
  precession = countslider.value;
  locations = [];
  selectedpoints.forEach(element => {
    locations.push(element.getGeometry().getCoordinates());
  })
  var start = new Date().getTime();
  var geojson = await getMultiGraph(locations, range, precession);
  var end = new Date().getTime();
  var time = end - start;
  txttime.innerHTML = "Zeit (Millisekunden): " + time;
  try
  {
    map.removeLayer(multigraphlayer);
    multigraphlayer = drawValuePointsToLayer(geojson);
    if (cbxmg.checked)
    {
      map.addLayer(multigraphlayer);
    }
  }
  catch (Exception)
  {}
}

async function routing()
{
  var alg = selectalg.value
  if (cbxdrawrouting.checked)
  {
    draw_routing(alg, 1000)
  }
  else
  {
    run_routing(alg)
  }
}

async function run_routing(alg)
{
  if (selectedpoints.length != 2)
  {
    alert("you have to mark at two feature!");
    return;
  }
  startpoint = selectedpoints[0].getGeometry().getCoordinates();
  endpoint = selectedpoints[1].getGeometry().getCoordinates();
  key = -1;
  var start = new Date().getTime();
  var geojson = await getRouting(startpoint, endpoint, key, false, 1, alg);
  var end = new Date().getTime();
  var time = end - start;
  txttime.innerHTML = "Zeit (Millisekunden): " + time;
  try
  {
    map.removeLayer(routinglayer);
    routinglayer = drawLinesToLayer(geojson, true);
    if (cbxrouting.checked)
    {
      map.addLayer(routinglayer);
    }
  }
  catch (Exception)
  {}
}

async function draw_routing(alg, stepcount)
{
  if (selectedpoints.length != 2)
  {
    alert("you have to mark at two feature!");
    return;
  }
  startpoint = selectedpoints[0].getGeometry().getCoordinates();
  endpoint = selectedpoints[1].getGeometry().getCoordinates();
  key = -1;
  finished = false;
  var geojson = null
  var start = new Date().getTime();
  do
  {
    geojson = await getRouting(startpoint, endpoint, key, true, stepcount, alg);
    key = geojson.key;
    finished = geojson.finished;
    var features = new ol.format.GeoJSON().readFeatures(geojson);
    features.forEach((element) => { element.setStyle(lineStyle(false))})
    routinglayer.getSource().addFeatures(features);
  } while (!geojson.finished)
  var end = new Date().getTime();
  var time = end - start;
  txttime.innerHTML = "Zeit (Millisekunden): " + time;
  try
  {
    map.removeLayer(routinglayer);
    routinglayer = drawLinesToLayer(geojson, true);
    if (cbxrouting.checked)
    {
      map.addLayer(routinglayer);
    }
  }
  catch (Exception)
  {}
}