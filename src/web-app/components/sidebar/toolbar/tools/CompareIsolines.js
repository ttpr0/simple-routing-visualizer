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
  {name: "range", title: "Reichweite", info: "Reichweite", type: "range", values: [100,5400,100], text:"check?", default: 900}
]

const out = [
  {name: 'binglayer', type: 'layer'},
  {name: 'mapboxlayer', type: 'layer'},
  {name: 'targamolayer', type: 'layer'},
]

async function run(param, out, addMessage)
{
    const layer = map.getLayerByName(param.layer);
    if (layer == null || layer.type != "Point")
    {
      throw new Error("pls select a pointlayer!");
    }
    if (layer.selectedfeatures.length != 1)
    {
      throw new Error("pls select exactly one feature!");
    }
    var location = layer.selectedfeatures[0].getGeometry().getCoordinates();
    var ranges = [param.range];
    var mapbox = getMapBoxPolygon(location, ranges);
    var targamo = getTargamoPolygon(location, ranges);
    var bing = getBingPolygon(location, ranges);
    var mapboxfeature = new ol.format.GeoJSON().readFeatures(await mapbox);
    var targamofeature = new ol.format.GeoJSON().readFeatures(await targamo);
    var bingfeature = new ol.format.GeoJSON().readFeatures(await bing);
    out.binglayer = new VectorLayer(bingfeature, 'Polygon', 'binglayer');
    out.binglayer.setStyle(bing_style);
    out.mapboxlayer = new VectorLayer(mapboxfeature, 'Polygon', 'mapboxlayer');
    out.mapboxlayer.setStyle(mapbox_style);
    out.targamolayer = new VectorLayer(targamofeature, 'Polygon', 'targamolayer');
    out.targamolayer.setStyle(targamo_style);
}

export { run, param, out }