import { computed, ref, reactive, watch, toRef} from 'vue';
import { VectorLayer } from '/map/VectorLayer';
import { VectorImageLayer } from '/map/VectorImageLayer'
import { accessibilityStyleFunction, lineStyle, ors_style, mapbox_style, bing_style, targamo_style } from '/map/styles';
import { getDockerPolygon, getORSPolygon, getBingPolygon, getMapBoxPolygon, getTargamoPolygon, getIsoRaster } from '/external/api'
import { randomRanges, calcMean, calcStd, selectRandomPoints } from '/util/util'
import { getMapState } from '/state';
import { ITool } from '/tools/ITool';


const map = getMapState();

class TestIsolines implements ITool
{
  name: string = "TestIsolines";
  getParameterInfo(): object[] {
    throw new Error('Method not implemented.');
  }
  getOutputInfo(): object[] {
    throw new Error('Method not implemented.');
  }
  param = [
    {name: "layer", title: "Layer", info: "Punkt-Layer", type: "layer", layertype:'Point', text:"Layer:"},
  ]

  out = []

  async run(param, out, addMessage) {
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
    var times = {};
    for (var i=1; i<11; i++)
    {
      var range = randomRanges(i, 3600);
      addMessage(i);
      times[i] = [];
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
        times[i].push(time);
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

const tool = new TestIsolines();

export { tool }