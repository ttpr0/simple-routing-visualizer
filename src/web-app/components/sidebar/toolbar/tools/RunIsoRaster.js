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
    <input type="range" id="range" v-model="obj.range" min="0" max="5400">
    <label for="range">{{ obj.range }}</label><br>
    <input type="range" id="rangecount" v-model="obj.count" min="1" max="100">
    <label for="rangecount">{{ obj.count*10 }}</label><br>
    <input type="checkbox" id="webmercator" v-model="obj.useWebMercator">
    <label for="webmercator">use Web-Mercator?</label>
    `,
} 

async function run(obj)
{
    const layer = map.getVectorLayerByName(state.layertree.focuslayer);
    if (layer == null || layer.type != "Point")
    {
      alert("pls select a pointlayer!");
      return;
    }
    if (layer.selectedfeatures.length > 100)
    {
      alert("pls mark less than 100 features!");
      return;
    }
    if (layer.selectedfeatures.length == 0)
    {
      alert("you have to mark at least one feature!");
      return;
    }
    if (obj.useWebMercator)
    {
        var precession = obj.count * 10;
        var crs = "3857";
    }
    else
    {
        var precession = 1 / (obj.count * 10);
        var crs = "4326";
    }
    var locations = [];
    layer.selectedfeatures.forEach(element => {
        locations.push(element.getGeometry().getCoordinates());
    })
    var start = new Date().getTime();
    var geojson = await getIsoRaster(locations, [obj.range], precession, crs);
    var end = new Date().getTime();
    var multigraphlayer = map.getVectorLayerByName("multigraphrasterlayer");
    if (multigraphlayer != null)
    {
        multigraphlayer.delete();
    }
    var features = new ol.format.GeoJSON().readFeatures(geojson);
    multigraphlayer = new VectorImageLayer(features, 'Polygon', 'multigraphrasterlayer');
    multigraphlayer.setStyle(accessibilityStyleFunction);
    map.addVectorLayer(multigraphlayer);
    updateLayerTree();
}

export { tool, run }