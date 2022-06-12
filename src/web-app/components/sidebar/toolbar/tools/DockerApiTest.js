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
  {name: 'url', title: 'URL', info: 'URL zum ORS-Server (bis zum API-Endpoint, z.B. localhost:5000/v2)', type: 'text', text: 'API-URL', default: 'http://localhost:8082/v2'},
  {name: "layer", title: "Layer", info: "Input-Standorte für Isochronen-Berechnung als Point-Features", type: "layer", layertype:'Point', text:"Layer:"},
  {name: "range", title: "Reichweite", info: "Reichweite", type: "range", values: [100,3600,100], text:"check?", default: 900},
  {name: "count", title: "Intervalle", info: "Anzahl an Intervallen", type: "range", values: [1,10,1], text:"check?", default: 1},
  {name: "profile", title: "Profile", info: "Zu verwendendes Routing-Profile/Routing-Graphen", type: "select", options: ['driving-car'], text:"Profile", default: 'driving-car'},
  {name: "smoothing", title: "Smoothing", info: "Smoothing-Faktor zur Isochronen-Berechnung (je höher desto stärker vereinfacht, je niedriger desto mehr Details)", type: "range", values: [1,10,0.1], default: 5},
  {name: "travelmode", title: "Travel Mode", info: "Gibt Einheit der Reichweiten an (time=[s], distance=[m])", type: "select", options: ['time', 'distance'], text:"Travel-Mode", default: 'time'},
  {name: "locationtype", title: "Location Type", info: "Gibt an ob Routing an locations starten (Routing vorwärts) oder enden (Routing rückwärts) soll", type: "select", options: ['start', 'destination'], text:"Location-Type", default: 'destination'},
  {name: "outputtype", title: "Output Type", info: "Gibt an ob Polygone vollständig oder als Ringe (kleinere Polygone von größeren abgezogen) zurückgegeben werden sollen", type: "select", options: ['polygon ring', 'full polygon'], text:'Output-Type', default: 'polygon ring'},
  {name: 'outname', title: 'Output Name', info: 'Name des Output-Layers', type: 'text', text: 'Name', default: 'dockerlayer'},
]

const out = [
  {name: 'dockerlayer', type: 'layer'},
]

async function run(param, out, addMessage) 
{
    const layer = map.getLayerByName(param.layer);
    if (layer == null || layer.type != "Point")
    {
      throw new Error("pls select a pointlayer!");
    }
    if (layer.selectedfeatures.length > 100 || layer.selectedfeatures.length == 0)
    {
      throw new Error("pls select less then 100 features!");
    }
    var ranges = randomRanges(param.count, param.range);
    var polygons = [];
    var start = new Date().getTime();
    await Promise.all(layer.selectedfeatures.map(async element => {
      var location = element.getGeometry().getCoordinates();
      var geojson = await getDockerPolygon([location], ranges, param.smoothing/10);
      //geojson = calcDifferences(geojson);
      polygons.push(geojson);
    }));
    var end = new Date().getTime();
    var features = []
    polygons.forEach(polygon => {
      features = features.concat(new ol.format.GeoJSON().readFeatures(polygon));
    });
    out.dockerlayer = new VectorLayer(features, 'Polygon', 'dockerlayer');
    out.dockerlayer.setStyle(ors_style);
}

export { run, param, out }