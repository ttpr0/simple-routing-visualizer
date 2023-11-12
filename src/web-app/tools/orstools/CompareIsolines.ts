import { computed, ref, reactive, watch, toRef } from 'vue';
import { PolygonLayer } from '/map/layers';
import { getBingPolygon, getMapBoxPolygon, getTargamoPolygon } from '/util/external/api';
import { getMap } from '/map';
import { ITool } from '/components/sidebar/toolbar/ITool';
import { PolygonStyle } from '/map/styles';

const map = getMap();

class CompareIsolines implements ITool {
  name: string = "CompareIsolines";
  param = [
    { name: "layer", title: "Layer", info: "Punkt-Layer", type: "layer", layertype: 'Point', text: "Layer:" },
    { name: "range", title: "Reichweite", info: "Reichweite", type: "range", values: [100, 5400, 100], text: "check?" }
  ];
  out = [
    { name: 'binglayer', type: 'layer' },
    { name: 'mapboxlayer', type: 'layer' },
    { name: 'targamolayer', type: 'layer' },
  ];

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
    return { "range": 900 };
  }
  updateParameterInfo(param: object, param_info: object[], changed: string): [object[], object] {
    return [null, param];
  }

  async run(param, out, addMessage) {
    const layer = map.getLayerByName(param.layer);
    if (layer == null || layer.getType() != "Point") {
      throw new Error("pls select a pointlayer!");
    }
    let selectedfeatures = layer.getSelectedFeatures();
    if (selectedfeatures.length != 1) {
      throw new Error("pls select exactly one feature!");
    }
    let feature = layer.getFeature(selectedfeatures[0]);
    var location = feature.geometry.coordinates;
    var ranges = [param.range];
    var mapbox = getMapBoxPolygon(location, ranges);
    var targamo = getTargamoPolygon(location, ranges);
    var bing = getBingPolygon(location, ranges);
    var mapboxfeature = await mapbox;
    var targamofeature = await targamo;
    var bingfeature = await bing;
    out.binglayer = new PolygonLayer(bingfeature["features"], 'binglayer');
    out.binglayer.setStyle(new PolygonStyle([0, 0, 0, 0], [0, 0, 255, 200]));
    out.mapboxlayer = new PolygonLayer(mapboxfeature["features"], 'mapboxlayer');
    out.mapboxlayer.setStyle(new PolygonStyle([0, 0, 0, 0], [255, 0, 0, 200]));
    out.targamolayer = new PolygonLayer(targamofeature["features"], 'targamolayer');
    out.targamolayer.setStyle(new PolygonStyle([0, 0, 0, 0], [0, 255, 0, 200]));
  }
}

const tool = new CompareIsolines();

export { tool }