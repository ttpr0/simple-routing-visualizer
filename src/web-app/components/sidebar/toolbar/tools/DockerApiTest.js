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

const tool = {
    components: {  },
    props: [ 'obj' ],
    setup(props, ctx) {
      
        return { }
    },
    template: `
    <input type="range" id="range" v-model="obj.range" min="0" max="3600">
    <label for="range">{{ obj.range }}</label><br>
    <input type="range" id="rangecount" v-model="obj.count" min="1" max="10">
    <label for="rangecount">{{ obj.count }}</label><br>
    <input type="range" id="smoothing" v-model="obj.smoothing" min="1" max="100">
    <label for="smoothing">{{ obj.smoothing/10 }}</label><br>
    `,
} 

const param = [
  {name: "range", title: "Reichweite", info: "Reichweite", type: "range", values: [100,3600,100], text:"check?"},
  {name: "count", title: "Intervalle", info: "Intervalle", type: "range", values: [1,10,1], text:"check?"},
  {name: "smoothing", title: "Smoothing", info: "Smoothing", type: "range", values: [1,10,0.1], text:"check?"}
]

async function run(obj) 
{
    const layer = map.getLayerByName(state.layertree.focuslayer);
    if (layer == null || layer.type != "Point")
    {
      alert("pls select a pointlayer!");
      return;
    }
    if (layer.selectedfeatures.length > 100 || layer.selectedfeatures.length == 0)
    {
      alert("pls select less then 100 features!");
      return;
    }
    var ranges = randomRanges(obj.count, obj.range);
    var polygons = [];
    var start = new Date().getTime();
    await Promise.all(layer.selectedfeatures.map(async element => {
      var location = element.getGeometry().getCoordinates();
      var geojson = await getDockerPolygon([location], ranges, obj.smoothing/10);
      //geojson = calcDifferences(geojson);
      polygons.push(geojson);
    }));
    var end = new Date().getTime();
    var features = []
    polygons.forEach(polygon => {
      features = features.concat(new ol.format.GeoJSON().readFeatures(polygon));
    });
    let dockerlayer = new VectorLayer(features, 'Polygon', 'dockerlayer');
    dockerlayer.setStyle(ors_style);
    map.addLayer(dockerlayer);
    updateLayerTree();
}

export { run, param }