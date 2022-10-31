import { computed, ref, reactive, watch, toRef} from 'vue';
import { VectorLayer } from '/map/VectorLayer';
import { VectorImageLayer } from '/map/VectorImageLayer'
import { accessibilityStyleFunction, lineStyle, ors_style, mapbox_style, bing_style, targamo_style } from '/map/styles';
import { getDockerPolygon, getORSPolygon, getBingPolygon, getMapBoxPolygon, getTargamoPolygon, getIsoRaster } from '/external/api'
import { randomRanges, calcMean, calcStd, selectRandomPoints } from '/util/util'
import { getMapState } from '/state';
import { ITool } from '/tools/ITool';


const map = getMapState();

class TestRanges implements ITool
{
  name: string = "TestRanges";
  getParameterInfo(): object[] {
    throw new Error('Method not implemented.');
  }
  getOutputInfo(): object[] {
    throw new Error('Method not implemented.');
  }
  
  param = [
    {name: "layer", title: "Layer", info: "Punkt-Layer", type: "layer", layertype:'Point', text:"Layer:"},
    {name: "testmode", title: "Test-Mode", info: "Test-Modus", type: "select", values: ['Isochrone', 'IsoRaster'], text:"Test-Mode", default: 'Isochrone'},
  ]
  
  out = [
  ]
  
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
      if (param.testmode === "Isochrone")
          var alg = getDockerPolygon;
      else
          alg = getIsoRaster;
      var times = {};
      var ranges = [300, 600, 900, 1200, 1500, 1800, 2100, 2400, 2700, 3000, 3300, 3600, 3900, 4200, 4500, 4800, 5100, 5400];
      for (var j = 0; j < ranges.length; j++)
      {
        var range = ranges[j];
        addMessage(range);
        times[range] = [];
        for (var c=0; c<5; c++)
        {
          var points = [selectedfeatures[0]];
          var start = new Date().getTime();
          await Promise.all(points.map(async element => {
            let feature = layer.getFeature(element);
            var location = feature.geometry.coordinates;
            var geojson = await alg([location], [range]);
          }));
          var end = new Date().getTime();
          var time = end - start;
          times[range].push(time);
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

const tool = new TestRanges();

export { tool }