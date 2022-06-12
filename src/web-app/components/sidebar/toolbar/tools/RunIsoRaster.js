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
  {name: "range", title: "Reichweite", info: "Reichweite", type: "range", values: [1,3600,1], text:"check?"},
  {name: "count", title: "Intervalle", info: "Intervalle", type: "range", values: [1,10,1], text:"check?"},
  {name: "useWebMercator", title: "WebMercator", info: "CRS", type: "check", values: [1,10], text:"Web-Mercator?"}
]

const out = [
  {name: 'multigraphlayer', type: 'layer'},
]

async function run(param, out, addMessage)
{
    const layer = map.getLayerByName(state.layertree.focuslayer);
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
    if (param.useWebMercator)
    {
        var precession = obj.count * 10;
        var crs = "3857";
    }
    else
    {
        var precession = 1 / (param.count * 10);
        var crs = "4326";
    }
    var locations = [];
    layer.selectedfeatures.forEach(element => {
        locations.push(element.getGeometry().getCoordinates());
    })
    var start = new Date().getTime();
    var geojson = await getIsoRaster(locations, [param.range], precession, crs);
    var end = new Date().getTime();
    var features = new ol.format.GeoJSON().readFeatures(geojson);
    out.multigraphlayer = new VectorImageLayer(features, 'Polygon', 'multigraphrasterlayer');
    out.multigraphlayer.setStyle(accessibilityStyleFunction);
}

export { run, param, out }