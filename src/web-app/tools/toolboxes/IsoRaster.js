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
  {name: "layer", title: "Layer", info: "Punkt-Layer", type: "layer", layertype:'Point', text:"Layer:"},
  {name: "range", title: "Reichweite", info: "Reichweite", type: "range", values: [100,3600,10], text:"check?", default: 900},
  {name: "crs", title: "Spatial Reference System", info: "CRS", type: "select", values: ['3857', '32632'], text:"CRS", default: '3857'},
  {name: "profile", title: "Profile", info: "Zu verwendendes Routing-Profile/Routing-Graphen", type: "select", values: ['driving-car'], text:"Profile", default: 'driving-car'},
  {name: "rastersize", title: "Raster-Size", info: "", type: "range", values: [100,1000,10], default: 1000},
  {name: "travelmode", title: "Travel Mode", info: "Gibt Einheit der Reichweiten an (time=[s], distance=[m])", type: "select", values: ['time', 'distance'], text:"Travel-Mode", default: 'time'},
  {name: "locationtype", title: "Location Type", info: "Gibt an ob Routing an locations starten (Routing vorwärts) oder enden (Routing rückwärts) soll", type: "select", values: ['start', 'destination'], text:"Location-Type", default: 'destination'},
  {name: "outputtype", title: "Output Type", info: "", type: "select", values: ['joined'], text:'Output-Type', default: 'joined'},
  {name: "consumertype", title: "Consumer Type", info: "", type: "select", values: ['node_based', 'edge_based'], text:'Consumer-Type', default: 'node_based'},
  {name: 'outname', title: 'Output Name', info: 'Name des Output-Layers', type: 'text', text: 'Name', default: 'isorasterlayer'},
]

const out = [
  {name: 'multigraphlayer', type: 'layer'},
]

async function run(param, out, addMessage)
{
    const layer = map.getLayerByName(param.layer);
    if (layer == null || layer.type != "Point")
    {
      throw new Error("pls select a pointlayer!");
    }
    if (layer.selectedfeatures.length > 300)
    {
      throw new Error("pls mark less than 100 features!");
    }
    if (layer.selectedfeatures.length == 0)
    {
      throw new Error("you have to mark at least one feature!");
    }
    let url = param.url + "/isoraster/" + param.profile;
    let range = param.range;
    let crs = param.crs;
    let rastersize = param.rastersize;
    let travelmode = param.travelmode;
    let locationtype = param.locationtype;
    let consumertype = param.consumertype;
    let outname = param.outname;
    let locations = [];
    layer.selectedfeatures.forEach(element => {
        locations.push(element.getGeometry().getCoordinates());
    })
    var start = new Date().getTime();
    var geojson = await getIsoRaster(locations, [range], rastersize, crs, url, consumertype, locationtype, travelmode);
    var end = new Date().getTime();
    addMessage(start - end);
    var features = new ol.format.GeoJSON().readFeatures(geojson);
    out.multigraphlayer = new VectorImageLayer(features, 'Polygon', outname);
    out.multigraphlayer.setStyle(accessibilityStyleFunction);
}

const tool = {
  param: param,
  out: out,
  run
}

export { tool }