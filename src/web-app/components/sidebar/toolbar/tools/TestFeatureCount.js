import { computed, ref, reactive, watch, toRef} from 'vue';
import { VectorLayer } from '/map/VectorLayer.js';
import { VectorImageLayer } from '/map/VectorImageLayer.js'
import { getState } from '/store/state.js';
import { getMap } from '/map/maps.js';
import { accessibilityStyleFunction, lineStyle, ors_style, mapbox_style, bing_style, targamo_style } from '/map/styles.js';
import { getDockerPolygon, getORSPolygon, getBingPolygon, getMapBoxPolygon, getTargamoPolygon, getIsoRaster } from '/external/api.js'
import { randomRanges, calcMean, calcStd, selectRandomPoints } from '/util/util.js'

const map = getMap();
const state = getState();

const param = [
    {name: "layer", title: "Layer", info: "Punkt-Layer", type: "layer", layertype:'Point', text:"Layer:"},
    {name: "testmode", title: "Test-Mode", info: "Test-Modus", type: "select", options: ['Isochrone', 'IsoRaster'], text:"Test-Mode", default: 'Isochrone'},
]

const out = [
]

async function run(param, out, addMessage) 
{
    const layer = map.getLayerByName(param.layer);
    if (layer == null || layer.type != "Point")
    {
      throw new Error("pls select a pointlayer!");
    }
    if (param.testmode === "Isochrone")
        var alg = getDockerPolygon;
    else
        alg = getIsoRaster;
    var ranges = randomRanges(1, 1800);
    //var counts = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,25,30,40,50];
    var counts = [1,2,3,4,5];
    var times = {};
    for (var i = 0; i < counts.length; i++)
    {
        var k = counts[i];
        times[k] = [];
        addMessage(k);
        for (var c=0; c<10; c++)
        {
            var points = selectRandomPoints(layer, k);
            var start = new Date().getTime();
            await Promise.all(points.map(async element => {
                var location = element.getGeometry().getCoordinates();
                var geojson = await alg([location], ranges);
            }));
            var end = new Date().getTime();
            var time = end - start;
            times[k].push(time);
        }
    }
    var l = [];
    addMessage(times);
    for (var k in times)
    {
        var mean = calcMean(times[k]);
        var std = calcStd(times[k], mean);
        l.push(k+", "+mean+", "+std);
    }
    addMessage(l.join('\n'));
}

export { run, param, out }