import { computed, ref, reactive, watch, toRef } from 'vue';
import { getDockerPolygon } from '/util/external/api';
import { randomRanges, calcMean, calcStd, selectRandomPoints } from '/util/utils';
import { getMap } from '/map';
import { ITool } from '/components/sidebar/toolbar/ITool';


const map = getMap();

class TestIsolines implements ITool {
  name: string = "TestIsolines";
  param = [
    { name: "layer", title: "Layer", info: "Punkt-Layer", type: "layer", layertype: 'Point', text: "Layer:" },
  ]
  out = []

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

  async run(param, out, addMessage) {
    const layer = map.getLayerByName(param.layer);
    if (layer == null || layer.getType() != "Point") {
      throw new Error("pls select a pointlayer!");
    }
    let selectedfeatures = layer.getSelectedFeatures();
    if (selectedfeatures.length != 1) {
      throw new Error("pls select only one feature");
    }
    var times = {};
    for (var i = 1; i < 11; i++) {
      var range = randomRanges(i, 3600);
      addMessage(i);
      times[i] = [];
      for (var c = 0; c < 5; c++) {
        var points = [selectedfeatures[0]];
        var start = new Date().getTime();
        await Promise.all(points.map(async element => {
          let feature = layer.getFeature(element);
          var location = feature.geometry.coordinates;
          var geojson = await getDockerPolygon([location], range);
        }));
        var end = new Date().getTime();
        var time = end - start;
        times[i].push(time);
      }
    }
    var l = [];
    addMessage(times);
    for (var k in times) {
      var mean = calcMean(times[k]);
      var std = calcStd(times[k], mean);
      l.push(k + ", " + mean + ", " + std);
    }
    addMessage(l.join('\n'))
  }
}

const tool = new TestIsolines();

export { tool }