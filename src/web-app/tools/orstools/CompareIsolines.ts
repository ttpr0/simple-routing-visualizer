import { computed, ref, reactive, watch, toRef} from 'vue';
import { VectorLayer } from '/map/VectorLayer';
import { VectorImageLayer } from '/map/VectorImageLayer';
import { getBingPolygon, getMapBoxPolygon, getTargamoPolygon } from '/external/api';
import { getMap } from '/map';
import { ITool } from '/tools/ITool';
import { PolygonStyle } from '/map/style';

const map = getMap();

class CompareIsolines implements ITool
{
  name: string = "CompareIsolines";

  param = [
    {name: "layer", title: "Layer", info: "Punkt-Layer", type: "layer", layertype:'Point', text:"Layer:"},
    {name: "range", title: "Reichweite", info: "Reichweite", type: "range", values: [100,5400,100], text:"check?", default: 900}
  ];

  out = [
    {name: 'binglayer', type: 'layer'},
    {name: 'mapboxlayer', type: 'layer'},
    {name: 'targamolayer', type: 'layer'},
  ];

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
      if (selectedfeatures.length != 1)
      {
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
      out.binglayer = new VectorLayer(bingfeature["features"], 'Polygon', 'binglayer');
      out.binglayer.setStyle(new PolygonStyle('blue', 2));
      out.mapboxlayer = new VectorLayer(mapboxfeature["features"], 'Polygon', 'mapboxlayer');
      out.mapboxlayer.setStyle(new PolygonStyle('red', 2));
      out.targamolayer = new VectorLayer(targamofeature["features"], 'Polygon', 'targamolayer');
      out.targamolayer.setStyle(new PolygonStyle('green', 2));
  }
}

const tool = new CompareIsolines();

export { tool }