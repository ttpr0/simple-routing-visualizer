import { computed, ref, reactive, watch, toRef} from 'vue';
import { VectorLayer } from '/map/VectorLayer';
import { VectorImageLayer } from '/map/VectorImageLayer';
import { AccessibilityStyle } from '/map/styles';
import { getIsoRaster } from '/util/external/api';
import { getMap } from '/map';
import { ITool } from '/components/sidebar/toolbar/ITool';


const map = getMap();

class IsoRaster implements ITool
{
  name: string = "Isoraster";
  param = [
    {name: 'url', title: 'URL', info: 'URL zum ORS-Server (bis zum API-Endpoint, z.B. localhost:5000/v2)', type: 'text', text: 'API-URL'},
    {name: "layer", title: "Layer", info: "Punkt-Layer", type: "layer", layertype:'Point', text:"Layer:"},
    {name: "range", title: "Reichweite", info: "Reichweite", type: "range", values: [60,3600,60], text:"check?"},
    {name: "crs", title: "Spatial Reference System", info: "CRS", type: "select", values: ['3857', '32632'], text:"CRS"},
    {name: "profile", title: "Profile", info: "Zu verwendendes Routing-Profile/Routing-Graphen", type: "select", values: ['driving-car'], text:"Profile"},
    {name: "rastersize", title: "Raster-Size", info: "", type: "range", values: [100,1000,10]},
    {name: "travelmode", title: "Travel Mode", info: "Gibt Einheit der Reichweiten an (time=[s], distance=[m])", type: "select", values: ['time', 'distance'], text:"Travel-Mode"},
    {name: "locationtype", title: "Location Type", info: "Gibt an ob Routing an locations starten (Routing vorwärts) oder enden (Routing rückwärts) soll", type: "select", values: ['start', 'destination'], text:"Location-Type"},
    {name: "outputtype", title: "Output Type", info: "", type: "select", values: ['joined'], text:'Output-Type'},
    {name: "consumertype", title: "Consumer Type", info: "", type: "select", values: ['node_based', 'edge_based'], text:'Consumer-Type'},
    {name: 'outname', title: 'Output Name', info: 'Name des Output-Layers', type: 'text', text: 'Name'},
  ]
  out = [
    {name: 'multigraphlayer', type: 'layer'},
  ]
  
  getToolName(): string {
    return this.name;
  }
  getParameterInfo(): object[] {
      return this.param;
  }
  getOutputInfo(): object[] {
      return this.out;
  }
  getDefaultParameters(): object {
    return {
      "url": 'http://localhost:8082/v2',
      "range": 900,
      "crs": "3857",
      "rastersize": 1000,
      "profile": 'driving-car',
      "travelmode": "time",
      "outputtype": "joined",
      "consumertype": "node_based",
      "outname": "isoraster_layer"
    };
  }
  updateParameterInfo(param: object, param_info: object[], changed: string): [object[], object] {
    return [null, param];
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