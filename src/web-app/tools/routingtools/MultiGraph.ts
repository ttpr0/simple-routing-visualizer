import { VectorLayer } from '/map/VectorLayer';
import { VectorImageLayer } from '/map/VectorImageLayer'
import { AccessibilityStyle } from '/map/styles';
import { getDockerPolygon, getORSPolygon, getBingPolygon, getMapBoxPolygon, getTargamoPolygon, getIsoRaster } from '/external/api'
import { randomRanges, calcMean, calcStd, selectRandomPoints } from '/util/util'
import { GeoJSON } from 'ol/format';
import { getMap } from '/map';
import { ITool } from '/components/sidebar/toolbar/ITool';
import { getMultiGraph, getRouting } from '/routing/api';


const map = getMap();

class MultiGraph implements ITool 
{
  name: string = "MultiGraph";
  param = [
    { name: "layer", title: "Layer", info: "Punkt-Layer", type: "layer", layertype: 'Point', text: "Layer:" },
    { name: "range", title: "Reichweite", info: "Reichweite", type: "range", values: [100, 3600, 100], text: "check?" },
    { name: "count", title: "Intervalle", info: "Intervalle", type: "range", values: [100, 1000, 100], text: "check?" }
  ]
  out = [
    { name: 'multigraphlayer', type: 'layer' },
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
    return { range: 900, count: 1 };
  }

  async run(param, out, addMessage) {
    const layer = map.getLayerByName(param.layer);
    if (layer == null || layer.getType() != "Point") {
      throw new Error("pls select a pointlayer!");
    }
    let selectedfeatures = layer.getSelectedFeatures();
    if (selectedfeatures.length > 100 || selectedfeatures.length == 0) {
      throw new Error("pls select less then 100 features!");
    }
    var locations = [];
    selectedfeatures.forEach(element => {
      let feature = layer.getFeature(element);
      var location = feature.geometry.coordinates;
      locations.push(location);
    })
    var start = new Date().getTime();
    var geojson = await getMultiGraph(locations, param.range, param.count);
    var end = new Date().getTime();
    addMessage(start - end);
    out.multigraphlayer = new VectorImageLayer(geojson["features"], 'Polygon', 'multigraphlayer');
    out.multigraphlayer.setStyle(new AccessibilityStyle());
  }
}

const tool = new MultiGraph();

export { tool }