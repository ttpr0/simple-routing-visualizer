import turf from '@turf/turf'

function randomRanges(count, maxValue) {
    let range = [];
    let factor = maxValue / count;
    for (let c = 1; c <= count; c++) {
        range.push(Math.round(c * factor));
    }
    return range;
}

function calcStd(array, mean) {
    var std = 0;
    array.forEach(element => {
        std += (element - mean) ** 2;
    })
    return Math.sqrt(std / (array.length - 1));
}

function calcMean(array) {
    var mean = 0;
    array.forEach(element => {
        mean += element;
    })
    return mean / array.length;
}

function selectRandomPoints(map, number) {
    var features = map.getLayers().getArray().find(layer => layer.get('name') == "pointlayer").getSource().getFeatures();
    var randoms = [];
    var length = features.length;
    var random;
    for (let i = 0; i < number; i++) {
        random = Math.floor(Math.random() * length);
        while (randoms.includes(random)) {
            random = Math.floor(Math.random() * length);
        }
        randoms.push(random);
    }
    var points = [];
    randoms.forEach(random => {
        points.push(features[random])
    })
    return points;
}

function calcDifferences(geojson) {
    var difference = [];
    for (let i = 0; i < (geojson.features.length - 1); i++) {
        difference.push(turf.difference(geojson.features[i + 1], geojson.features[i]));
    }
    difference.push(geojson.features[0]);
    geojson.features = difference;
    return geojson
}

function mergePolygons(polygons) {
    var five = []
    var ten = [];
    var fifteen = [];
    var twenty = [];
    var thirty = [];
    for (let i = 0; i < polygons.length; i++) {
        polygons[i].features.forEach(feature => {
            if (feature.properties.value == 300) {
                five.push(feature);
            }
            if (feature.properties.value == 600) {
                ten.push(feature);
            }
            if (feature.properties.value == 900) {
                fifteen.push(feature);
            }
            if (feature.properties.value == 1200) {
                twenty.push(feature);
            }
            if (feature.properties.value == 1800) {
                thirty.push(feature);
            }
        });
    }
    var merged = [];
    var feature = five[0];
    for (let i = 1; i < five.length; i++) {
        feature = turf.union(feature, five[i]);
    }
    feature.properties.value = 300;
    merged.push(feature);
    var feature = ten[0];
    for (let i = 1; i < ten.length; i++) {
        feature = turf.union(feature, ten[i]);
    }
    feature.properties.value = 600;
    merged.push(feature);
    var feature = fifteen[0];
    for (let i = 1; i < fifteen.length; i++) {
        feature = turf.union(feature, fifteen[i]);
    }
    feature.properties.value = 900;
    merged.push(feature);
    var feature = twenty[0];
    for (let i = 1; i < twenty.length; i++) {
        feature = turf.union(feature, twenty[i]);
    }
    feature.properties.value = 1200;
    merged.push(feature);
    var feature = thirty[0];
    for (let i = 1; i < thirty.length; i++) {
        feature = turf.union(feature, thirty[i]);
    }
    feature.properties.value = 1800;
    merged.push(feature);
    var geojson = {}
    geojson['type'] = "FeatureCollection";
    geojson['features'] = merged;
    return calcDifferences(geojson)
}