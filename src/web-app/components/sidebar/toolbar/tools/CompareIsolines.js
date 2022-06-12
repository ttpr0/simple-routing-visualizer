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
  {name: "range", title: "Reichweite", info: "Reichweite", type: "range", values: [100,5400,100], text:"check?"}
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
      alert("pls select exactly one feature!");
      return;
    }
    var location = layer.selectedfeatures[0].getGeometry().getCoordinates();
    var ranges = [obj.range];
    var mapbox = getMapBoxPolygon(location, ranges);
    var targamo = getTargamoPolygon(location, ranges);
    var bing = getBingPolygon(location, ranges);
    var mapboxfeature = new ol.format.GeoJSON().readFeatures(await mapbox);
    var targamofeature = new ol.format.GeoJSON().readFeatures(await targamo);
    var bingfeature = new ol.format.GeoJSON().readFeatures(await bing);
    let binglayer = new VectorLayer(bingfeature, 'Polygon', 'binglayer');
    binglayer.setStyle(bing_style);
    map.addVectorLayer(binglayer);
    let mapboxlayer = new VectorLayer(mapboxfeature, 'Polygon', 'mapboxlayer');
    mapboxlayer.setStyle(mapbox_style);
    map.addVectorLayer(mapboxlayer);
    let targamolayer = new VectorLayer(targamofeature, 'Polygon', 'targamolayer');
    targamolayer.setStyle(targamo_style);
    map.addLayer(targamolayer);
    updateLayerTree();
}

export { run, param }