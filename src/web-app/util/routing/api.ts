async function getMultiGraph(locations, ranges, precession) {
  var url = "http://localhost:5002/v0/isoraster";
  var response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    //credentials: 'same-origin', 
    headers: {
      'Content-Type': 'application/json',
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body: JSON.stringify({
      locations: locations,
      range: ranges,
      precession: precession,
      range_type: 'time',
      location_type: "destination",
      smoothing: "10"
    })
  });
  var json = await response.json();
  console.log(json);
  return json;
}

async function getRouting(start, end, key, draw, stepcount, algorithm) {
  var url = "http://localhost:5002/v0/routing";
  var response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    //credentials: 'same-origin', 
    headers: {
      'Content-Type': 'application/json',
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body: JSON.stringify({
      start: start,
      end: end,
      key: key,
      drawRouting: draw,
      stepcount: stepcount,
      algorithm: algorithm,
      range_type: 'time',
      location_type: "destination",
      smoothing: "10"
    })
  });
  var json = await response.json();
  console.log(json);
  return json;
}

async function getRoutingDrawContext(start, end, algorithm) {
  var url = "http://localhost:5002/v0/routing/draw/create";
  var response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    //credentials: 'same-origin', 
    headers: {
      'Content-Type': 'application/json',
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body: JSON.stringify({
      start: start,
      end: end,
      algorithm: algorithm,
    })
  });
  var json = await response.json();
  return json;
}

async function getRoutingStep(key, stepcount) {
  var url = "http://localhost:5002/v0/routing/draw/step";
  var response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    //credentials: 'same-origin', 
    headers: {
      'Content-Type': 'application/json',
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body: JSON.stringify({
      key: key,
      stepcount: stepcount,
    })
  });
  var json = await response.json();
  //console.log(json);
  return json;
}

export { getMultiGraph, getRouting, getRoutingDrawContext, getRoutingStep }