import { computed, ref, reactive, watch, toRef} from 'vue';
import { VectorLayer } from '/map/VectorLayer';
import { VectorImageLayer } from '/map/VectorImageLayer';
import { AccessibilityStyle } from '/map/styles';
import { getIsoRaster } from '/external/api';
import { getMap } from '/map';
import { ITool } from '/tools/ITool';


const map = getMap();

class IsoRaster implements ITool
{
  name: string = "Isoraster";

  param = [
    {name: 'url', title: 'URL', info: 'URL zum ORS-Server (bis zum API-Endpoint, z.B. localhost:5000/v2)', type: 'text', text: 'API-URL', default: 'http://172.26.62.41:8080/ors/v2'},
    {name: "layer", title: "Layer", info: "Punkt-Layer", type: "layer", layertype:'Point', text:"Layer:"},
    {name: "range", title: "Reichweite", info: "Reichweite", type: "range", values: [60,3600,60], text:"check?", default: 900},
    {name: "crs", title: "Spatial Reference System", info: "CRS", type: "select", values: ['3857', '32632'], text:"CRS", default: '3857'},
    {name: "profile", title: "Profile", info: "Zu verwendendes Routing-Profile/Routing-Graphen", type: "select", values: ['driving-car'], text:"Profile", default: 'driving-car'},
    {name: "rastersize", title: "Raster-Size", info: "", type: "range", values: [100,1000,10], default: 1000},
    {name: "travelmode", title: "Travel Mode", info: "Gibt Einheit der Reichweiten an (time=[s], distance=[m])", type: "select", values: ['time', 'distance'], text:"Travel-Mode", default: 'time'},
    {name: "locationtype", title: "Location Type", info: "Gibt an ob Routing an locations starten (Routing vorwärts) oder enden (Routing rückwärts) soll", type: "select", values: ['start', 'destination'], text:"Location-Type", default: 'destination'},
    {name: "outputtype", title: "Output Type", info: "", type: "select", values: ['joined'], text:'Output-Type', default: 'joined'},
    {name: "consumertype", title: "Consumer Type", info: "", type: "select", values: ['node_based', 'edge_based'], text:'Consumer-Type', default: 'node_based'},
    {name: 'outname', title: 'Output Name', info: 'Name des Output-Layers', type: 'text', text: 'Name', default: 'isorasterlayer'},
  ]
  
  out = [
    {name: 'multigraphlayer', type: 'layer'},
  ]

  getParameterInfo(): object[] {
    throw new Error('Method not implemented.');
  }
  getOutputInfo(): object[] {
    throw new Error('Method not implemented.');
  }
  
  async run(param, out, addMessage)
  {
      const layer = map.getLayerByName(param.layer);
      if (layer == null || layer.getType() != "Point")
      {
        throw new Error("pls select a pointlayer!");
      }
      let selectedfeatures = layer.getSelectedFeatures();
      if (selectedfeatures.length > 300)
      {
        throw new Error("pls mark less than 100 features!");
      }
      if (selectedfeatures.length == 0)
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
      selectedfeatures.forEach(element => {
          let feature = layer.getFeature(element);
          locations.push(feature.geometry.coordinates);
      })
      var start = new Date().getTime();
      var geojson = await getIsoRaster(locations, [range], rastersize, crs, url, consumertype, locationtype, travelmode);
      var end = new Date().getTime();
      addMessage(start - end);
      out.multigraphlayer = new VectorImageLayer(geojson['features'], 'Polygon', outname);
      out.multigraphlayer.setStyle(new AccessibilityStyle());
  }
}

const tool = new IsoRaster();

export { tool }