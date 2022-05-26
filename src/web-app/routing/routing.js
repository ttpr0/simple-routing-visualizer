import { getMultiGraph, getRouting} from '/routing/api.js'

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

export {routing, multigraph}