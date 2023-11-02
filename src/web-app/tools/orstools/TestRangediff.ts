import { computed, ref, reactive, watch, toRef} from 'vue';
import { VectorLayer } from '/map/VectorLayer';
import { VectorImageLayer } from '/map/VectorImageLayer';
import { getDockerPolygon } from '/util/external/api';
import { randomRanges, calcMean, calcStd, selectRandomPoints } from '/util/utils';
import { getMap } from '/map';
import { ITool } from '/components/sidebar/toolbar/ITool';


const map = getMap();

class TestRangediff implements ITool
{
  name: string = "TestRangediff";
  param = [
    {name: "layer", title: "Layer", info: "Punkt-Layer", type: "layer", layertype:'Point', text:"Layer:"},
  ]
  out = [
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
      return {};
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
      if (selectedfeatures.length != 1)
      {
          throw new Error("pls select only one feature");
      }
      var t = [1.5, 1.5, 1, 2, 3, 4, 5, 6, 8, 9, 10, 12, 20, 30, 45, 60];
      var times = {};
      for (var j = 0; j < t.length; j++)
      {
        var i = t[j];
        var range = randomRanges(i, 3600);
        addMessage(i);
        times[3600/i] = [];
        for (var c=0; c<5; c++)
        {
          var points = [selectedfeatures[0]];
          var start = new Date().getTime();
          await Promise.all(points.map(async element => {
            let feature = layer.getFeature(element);
            var location = feature.geometry.coordinates;
            var geojson = await getDockerPolygon([location], range);
          }));
          var end = new Date().getTime();
          var time = end - start;
          times[3600/i].push(time);
        }
      }
      var l = [];
      addMessage(times);
      for (var k in times)
      {
        var mean = calcMean(times[k]);
        var std = calcStd(times[k], mean);
        l.push(k+", "+mean+", "+std);
      }
      addMessage(l.join('\n'))
  }
}

const tool = new TestRangediff();

export { tool }