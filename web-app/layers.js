async function getDockerPolygon(location, ranges)
{
    url = "http://172.26.62.41:8080/ors/v2/isochrones/driving-car";
    var response = await fetch(url, {
        method: 'POST', 
        mode: 'cors',
        cache: 'no-cache', 
        credentials: 'same-origin', 
        headers: {
          'Content-Type': 'application/json',
        },
        redirect: 'follow', 
        referrerPolicy: 'no-referrer', 
        body: JSON.stringify({
            "locations": location, 
            "range": ranges,
            "range_type": 'time',
            "location_type": "destination",
            "smoothing": "5"
        }) 
      });
    return await response.json()
}

async function getMultiGraph(locations, ranges, precession)
{
    url = "http://localhost:5000/v0/shortestpathtree/driving-car";
    var response = await fetch(url, {
        method: 'POST', 
        mode: 'cors',
        cache: 'no-cache', 
        credentials: 'same-origin', 
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
    json = await response.json();
    //console.log(json);
    return json;
}

async function getRouting(start, end, key, draw, stepcount, algorithm)
{
    url = "http://localhost:5000/v0/routing/driving-car";
    var response = await fetch(url, {
        method: 'POST', 
        mode: 'cors',
        cache: 'no-cache', 
        credentials: 'same-origin', 
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
    json = await response.json();
    console.log(json);
    return json;
}


async function getORSPolygon(location, range)
{
    var apiKey = "5b3ce3597851110001cf6248801b894756b44ffc85713f47019a1f45";
    var Isochrones = new Openrouteservice.Isochrones({
        api_key: apiKey
    });
    var json = Isochrones.calculate({
        profile: 'driving-car',
        locations: location,
        range: range,
        range_type: 'time',
        format: "geojson",
        location_type: "destination",
    });
    var geojson = await json;
    return geojson;
}