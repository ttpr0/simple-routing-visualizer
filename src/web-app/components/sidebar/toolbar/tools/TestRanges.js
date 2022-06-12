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
  {name: "testmode", title: "Test-Mode", info: "Test-Modus", type: "select", options: ['Isochrone', 'IsoRaster'], text:"Test-Mode"},
]

const out = [
]

async function run(param, out, addMessage)
{
    const layer = map.getLayerByName(state.layertree.focuslayer);
    if (layer == null || layer.type != "Point")
    {
      alert("pls select a pointlayer!");
      return;
    }
    if (layer.selectedfeatures.length != 1)
    {
        alert("pls select only one feature");
        return;
    }
    if (param.testmode === "Isochrone")
        var alg = getDockerPolygon;
    else
        alg = getIsoRaster;
    var times = {};
    var ranges = [300, 600, 900, 1200, 1500, 1800, 2100, 2400, 2700, 3000, 3300, 3600, 3900, 4200, 4500, 4800, 5100, 5400];
    for (var j = 0; j < ranges.length; j++)
    {
      var range = ranges[j];
      console.log(range);
      times[range] = [];
      for (var c=0; c<5; c++)
      {
        var points = [layer.selectedfeatures[0]];
        var start = new Date().getTime();
        await Promise.all(points.map(async element => {
          var location = element.getGeometry().getCoordinates();
          var geojson = await alg([location], [range]);
        }));
        var end = new Date().getTime();
        var time = end - start;
        times[range].push(time);
      }
    }
    var l = [];
    console.log(times);
    for (var k in times)
    {
      var mean = calcMean(times[k]);
      var std = calcStd(times[k], mean);
      l.push(k+", "+mean+", "+std);
    }
    console.log(l.join('\n'))
}

export { run, param, out }