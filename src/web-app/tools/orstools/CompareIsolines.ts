import { computed, ref, reactive, watch, toRef} from 'vue';
import { VectorLayer } from '/map/VectorLayer';
import { VectorImageLayer } from '/map/VectorImageLayer'
import { accessibilityStyleFunction, lineStyle, ors_style, mapbox_style, bing_style, targamo_style } from '/map/styles';
import { getDockerPolygon, getORSPolygon, getBingPolygon, getMapBoxPolygon, getTargamoPolygon, getIsoRaster } from '/external/api'
import { randomRanges, calcMean, calcStd, selectRandomPoints } from '/util/util'
import { GeoJSON } from "ol/format"
import { getMapState } from '/state';
import { ITool } from '/tools/ITool';

const map = getMapState();

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
      var mapboxfeature = new GeoJSON().readFeatures(await mapbox);
      var targamofeature = new GeoJSON().readFeatures(await targamo);
      var bingfeature = new GeoJSON().readFeatures(await bing);
      out.binglayer = new VectorLayer(bingfeature, 'Polygon', 'binglayer');
      out.binglayer.setStyle(bing_style);
      out.mapboxlayer = new VectorLayer(mapboxfeature, 'Polygon', 'mapboxlayer');
      out.mapboxlayer.setStyle(mapbox_style);
      out.targamolayer = new VectorLayer(targamofeature, 'Polygon', 'targamolayer');
      out.targamolayer.setStyle(targamo_style);
  }
}

const tool = new CompareIsolines();

export { tool }