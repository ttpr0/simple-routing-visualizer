import { computed, ref, reactive, watch, toRef} from 'vue';
import { VectorLayer } from '/map/VectorLayer';
import { VectorImageLayer } from '/map/VectorImageLayer';
import { getORSPolygon } from '/external/api';
import { randomRanges } from '/util/util';
import { GeoJSON } from 'ol/format';
import { getMap } from '/map';
import { ITool } from '/tools/ITool';


const map = getMap();

class ORSApiTest implements ITool
{
  name: string = "ORSApiTest";

  param = [
    {name: "layer", title: "Layer", info: "Punkt-Layer", type: "layer", layertype:'Point', text:"Layer:"},
    {name: "range", title: "Reichweite", info: "Reichweite", type: "range", values: [100,3600,100], text:"check?", default: 900},
    {name: "count", title: "Intervalle", info: "Intervalle", type: "range", values: [1,10,1], text:"check?", default: 1}
  ]
  
  out = [
    {name: 'orslayer', type: 'layer'},
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
      if (selectedfeatures.length > 20 || selectedfeatures.length == 0)
      {
        throw new Error("pls select less then 20 features!");
      }
      var ranges = randomRanges(param.count, param.range);
      var polygons = [];
      var start = new Date().getTime();
      addMessage(ranges);
      await Promise.all(selectedfeatures.map(async element => {
        let feature = layer.getFeature(element);
        var location = feature.geometry.coordinates;
        var geojson = await getORSPolygon([location], ranges);
        //geojson = calcDifferences(geojson);
        for (let feat of geojson.features)
          polygons.push(feat);
      }));
      var end = new Date().getTime();
      out.orslayer = new VectorLayer(polygons, 'Polygon', 'orslayer');
  }
}

const tool = new ORSApiTest();

export { tool }