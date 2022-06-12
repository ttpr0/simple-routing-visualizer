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

function updateLayerTree() {
  state.layertree.update = !state.layertree.update;
}

const param = [
]

async function run(obj)
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
    var t = [1.5, 1.5, 1, 2, 3, 4, 5, 6, 8, 9, 10, 12, 20, 30, 45, 60];
    var times = {};
    for (var j = 0; j < t.length; j++)
    {
      var i = t[j];
      var range = randomRanges(i, 3600);
      console.log(i);
      times[3600/i] = [];
      for (var c=0; c<5; c++)
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
    for (var k in times)
    {
      var mean = calcMean(times[k]);
      var std = calcStd(times[k], mean);
      l.push(k+", "+mean+", "+std);
    }
    console.log(l.join('\n'))
}

export { run, param }