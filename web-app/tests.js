/**
 * fetches isochrones for selected locations and draws to map (ORS-Server),
 * basic visual testing of api
 */
async function ors_api_test()
{
  if (selectedpoints.length > 10)
  {
    alert("pls mark less than 10 features!");
    return;
  }
  if (selectedpoints.length == 0)
  {
    alert("you have to mark at least one feature!");
    return;
  }
  range = randomRanges(countslider.value, rangeslider.value);
  var polygons = [];
  var start = new Date().getTime();
  await Promise.all(selectedpoints.map(async element => {
    var location = element.getGeometry().getCoordinates();
    var geojson = await getORSPolygon([location], range);
    geojson = calcDifferences(geojson)
    polygons.push(geojson);
  }));
  var end = new Date().getTime();
  var time = end - start;
  txttime.innerHTML = "Zeit (Millisekunden): " + time;
  try
  {
    map.removeLayer(orslayer);
    orslayer = drawPolygonsToLayer(ors_style, polygons);
    if (cbxors.checked)
    {
      map.addLayer(orslayer);
    }
  }
  catch (Exception)
  {}
}

/**
 * fetches isochrones for selected locations and draws to map (Docker-Server),
 * visual testing of api
 */
async function docker_api_test()
{
  if (selectedpoints.length > 100)
  {
    alert("pls mark less than 10 features!");
    return;
  }
  if (selectedpoints.length == 0)
  {
    alert("you have to mark at least one feature!");
    return;
  }
  range = randomRanges(countslider.value, rangeslider.value);
  var polygons = [];
  var start = new Date().getTime();
  await Promise.all(selectedpoints.map(async element => {
    var location = element.getGeometry().getCoordinates();
    var geojson = await getDockerPolygon([location], range);
    polygons.push(geojson);
  }));
  console.log(JSON.stringify(polygons[0]))
  var end = new Date().getTime();
  var time = end - start;
  txttime.innerHTML = "Zeit (Millisekunden): " + time;
  try
  {
    map.removeLayer(orslayer);
    orslayer = drawPolygonsToLayer(ors_style, polygons);
    if (cbxors.checked)
    {
      map.addLayer(orslayer);
    }
  }
  catch (Exception)
  {}
}

/**
 * selects 10 random locations and fetches isochrones + draws to map,
 * ranges from sliders
 */
async function random_points_test()
{
  range = randomRanges(countslider.value, rangeslider.value);
  var points = selectRandomPoints(map, 10);
  var polygons = [];
  var start = new Date().getTime();
  await Promise.all(points.map(async element => {
    var location = element.getGeometry().getCoordinates();
    var geojson = await getDockerPolygon([location], range);
    polygons.push(geojson);
  }));
  var end = new Date().getTime();
  var time = end - start;
  console.log(time);
  txttime.innerHTML = "Zeit (Millisekunden): " + time;
  try
  {
    map.removeLayer(orslayer);
    orslayer = drawPolygonsToLayer(ors_style, polygons);
    if (cbxors.checked)
    {
      map.addLayer(orslayer);
    }
  }
  catch (Exception)
  {}
}

/**
 * time to number of features test (Docker-Api)
 */
async function featurecount_test()
{
  range = randomRanges(1, 1800);
  var counts = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,25,30,40,50];
  var times = {};
  for (var i = 0; i < counts.length; i++)
  {
    var k = counts[i];
    times[k] = [];
    console.log(k);
    for (c=0; c<10; c++)
    {
      var points = selectRandomPoints(map, k);
      var start = new Date().getTime();
      await Promise.all(points.map(async element => {
        var location = element.getGeometry().getCoordinates();
        var geojson = await getMultiGraph([location], range);
      }));
      var end = new Date().getTime();
      var time = end - start;
      times[k].push(time);
    }
  }
  var l = [];
  console.log(times);
  for (k in times)
  {
    var mean = calcMean(times[k]);
    var std = calcStd(times[k], mean);
    l.push(k+", "+mean+", "+std);
  }
  console.log(l.join('\n'))
}

/**
 * time to number of features test (ORS-Api)
 */
async function test5()
{
  range = randomRanges(10, 1800);
  var times = {};
  var counter = 0;
  for (i=1; i<11; i++)
  {
    console.log(i)
    times[i] = [];
    for (c=0; c<5; c++)
    {
      if (counter >= 20-i)
      {
        await new Promise(r => setTimeout(r, 60000));
        counter = 0;
      }
      var points = selectRandomPoints(map, i);
      var start = new Date().getTime();
      await Promise.all(points.map(async element => {
        var location = element.getGeometry().getCoordinates();
        var geojson = await getORSPolygon([location], range);
      }));
      var end = new Date().getTime();
      var time = end - start;
      times[i].push(time);
      counter += i;
    }
  }
  var l = [];
  console.log(times);
  for (k in times)
  {
    var mean = calcMean(times[k]);
    var std = calcStd(times[k], mean);
    l.push(k+", "+mean+", "+std);
  }
  console.log(l.join('\n'))
}

/**
 * time to number of isolines test (Docker-Api)
 */
async function isolines_test()
{
  if (selectedpoints.length != 1)
  {
    alert("pls select only one feature");
    return;
  }
  var times = {};
  for (i=1; i<11; i++)
  {
    range = randomRanges(i, 3600);
    console.log(i);
    times[i] = [];
    for (c=0; c<5; c++)
    {
      var points = [selectedpoints[0]];
      var start = new Date().getTime();
      await Promise.all(points.map(async element => {
        var location = element.getGeometry().getCoordinates();
        var geojson = await getDockerPolygon([location], range);
      }));
      var end = new Date().getTime();
      var time = end - start;
      times[i].push(time);
    }
  }
  var l = [];
  console.log(times);
  for (k in times)
  {
    var mean = calcMean(times[k]);
    var std = calcStd(times[k], mean);
    l.push(k+", "+mean+", "+std);
  }
  console.log(l.join('\n'))
}

/**
 * multiple locations test (Docker-Api)
 */
async function test7()
{
  if (selectedpoints.length > 100)
  {
    alert("pls mark less than 10 features!");
    return;
  }
  if (selectedpoints.length == 0)
  {
    alert("you have to mark at least one feature!");
    return;
  }
  range = randomRanges(countslider.value, rangeslider.value);
  var locations = [];
  selectedpoints.forEach(element => {
    locations.push(element.getGeometry().getCoordinates());
  })
  var start = new Date().getTime();
  var geojson = await getDockerPolygon(locations, range);
  var end = new Date().getTime();
  var time = end - start;
  txttime.innerHTML = "Zeit (Millisekunden): " + time;
  console.log(geojson);
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
 
 /**
  * time to ranges
  */
async function ranges_test()
{
  if (selectedpoints.length != 1)
  {
    alert("pls select only one feature");
    return;
  }
  var times = {};
  var ranges = [300, 600, 900, 1200, 1500, 1800, 2100, 2400, 2700, 3000, 3300, 3600, 3900, 4200, 4500, 4800, 5100, 5400];
  for (var j = 0; j < ranges.length; j++)
  {
    element = ranges[j];
    range = [element];
    console.log(element);
    times[element] = [];
    for (c=0; c<5; c++)
    {
      var points = [selectedpoints[0]];
      var start = new Date().getTime();
      await Promise.all(points.map(async element => {
        var location = element.getGeometry().getCoordinates();
        var geojson = await getMultiGraph([location], range);
      }));
      var end = new Date().getTime();
      var time = end - start;
      times[element].push(time);
    }
  }
  var l = [];
  console.log(times);
  for (k in times)
  {
    var mean = calcMean(times[k]);
    var std = calcStd(times[k], mean);
    l.push(k+", "+mean+", "+std);
  }
  console.log(l.join('\n'))
}

/**
 * time to number of isolines test (Docker-Api)
 */
 async function rangediff_test()
 {
   if (selectedpoints.length != 1)
   {
     alert("pls select only one feature");
     return;
   }
   var t = [1.5, 1.5, 1, 2, 3, 4, 5, 6, 8, 9, 10, 12, 20, 30, 45, 60];
   var times = {};
   for (var j = 0; j < t.length; j++)
   {
     var i = t[j];
     range = randomRanges(i, 3600);
     console.log(i);
     times[3600/i] = [];
     for (c=0; c<5; c++)
     {
       var points = [selectedpoints[0]];
       var start = new Date().getTime();
       await Promise.all(points.map(async element => {
         var location = element.getGeometry().getCoordinates();
         var geojson = await getDockerPolygon([location], range);
       }));
       var end = new Date().getTime();
       var time = end - start;
       times[3600/i].push(time);
     }
   }
   var l = [];
   console.log(times);
   for (k in times)
   {
     var mean = calcMean(times[k]);
     var std = calcStd(times[k], mean);
     l.push(k+", "+mean+", "+std);
   }
   console.log(l.join('\n'))
 }