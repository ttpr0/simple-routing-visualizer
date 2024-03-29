import { computed, ref, reactive, watch, toRef } from 'vue';
import { PolygonLayer } from '/map/layers';
import { getDockerPolygon } from '/util/external/api';
import { randomRanges } from '/util/utils';
import { getMap } from '/map';
import { ITool } from '/components/sidebar/toolbar/ITool';
import { PolygonStyle } from '/map/styles';


const map = getMap();

class Isochrones implements ITool {
  name: string = "Isochrones";
  param: object[] = [
    { name: 'url', title: 'URL', info: 'URL zum ORS-Server (bis zum API-Endpoint, z.B. localhost:5000/v2)', type: 'text', text: 'API-URL' },
    { name: "layer", title: "Layer", info: "Input-Standorte für Isochronen-Berechnung als Point-Features", type: "layer", layertype: 'Point', text: "Layer:" },
    { name: "range", title: "Reichweite", info: "Reichweite", type: "range", values: [100, 3600, 10], text: "check?" },
    { name: "count", title: "Intervalle", info: "Anzahl an Intervallen", type: "range", values: [1, 10, 1], text: "check?" },
    { name: "profile", title: "Profile", info: "Zu verwendendes Routing-Profile/Routing-Graphen", type: "select", values: ['driving-car'], text: "Profile" },
    { name: "smoothing", title: "Smoothing", info: "Smoothing-Faktor zur Isochronen-Berechnung (je höher desto stärker vereinfacht, je niedriger desto mehr Details)", type: "range", values: [1, 10, 0.1] },
    { name: "travelmode", title: "Travel Mode", info: "Gibt Einheit der Reichweiten an (time=[s], distance=[m])", type: "select", values: ['time', 'distance'], text: "Travel-Mode" },
    { name: "locationtype", title: "Location Type", info: "Gibt an ob Routing an locations starten (Routing vorwärts) oder enden (Routing rückwärts) soll", type: "select", values: ['start', 'destination'], text: "Location-Type" },
    { name: "outputtype", title: "Output Type", info: "Gibt an ob Polygone vollständig oder als Ringe (kleinere Polygone von größeren abgezogen) zurückgegeben werden sollen", type: "select", values: ['polygon ring', 'full polygon'], text: 'Output-Type' },
    { name: 'outname', title: 'Output Name', info: 'Name des Output-Layers', type: 'text', text: 'Name' },
  ]
  out: object[] = [
    { name: 'dockerlayer', type: 'layer' },
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
      "count": 1,
      "profile": 'driving-car',
      "smoothing": 5,
      "travelmode": "time",
      "locationtype": "destination",
      "outputtype": "polygon ring",
      "outname": "docker_layer"
    };
  }
  updateParameterInfo(param: object, param_info: object[], changed: string): [object[], object] {
    return [null, param];
  }

  async run(param: any, out: any, addMessage: any): Promise<void> {
    const layer = map.getLayerByName(param.layer);
    if (layer == null || layer.getType() != "Point") {
      throw new Error("pls select a pointlayer!");
    }
    let selectedfeatures = layer.getSelectedFeatures();
    if (selectedfeatures.length > 100 || selectedfeatures.length == 0) {
      throw new Error("pls select less then 100 features!");
    }
    let url = param.url + "/isochrones/" + param.profile;
    let ranges = randomRanges(param.count, param.range);
    let smoothing = param.smoothing;
    let travelmode = param.travelmode;
    let locationtype = param.locationtype;
    let outname = param.outname;
    var polygons = [];
    var start = new Date().getTime();
    await Promise.all(selectedfeatures.map(async element => {
      let feature = layer.getFeature(element);
      var location = feature.geometry.coordinates;
      var geojson = await getDockerPolygon([location], ranges, smoothing, url, locationtype, travelmode);
      //geojson = calcDifferences(geojson);
      for (let feat of geojson.features)
        polygons.push(feat);
    }));
    var end = new Date().getTime();
    addMessage(start - end);
    out.dockerlayer = new PolygonLayer(polygons, outname, new PolygonStyle([0, 0, 0, 0], [0, 0, 0, 200]));
  }
}

const tool = new Isochrones();

export { tool }