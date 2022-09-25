import { computed, ref, reactive, watch, toRef} from 'vue';
import { VectorLayer } from '/map/VectorLayer';
import { VectorImageLayer } from '/map/VectorImageLayer'
import { accessibilityStyleFunction, lineStyle, ors_style, mapbox_style, bing_style, targamo_style } from '/map/styles';
import { getDockerPolygon, getORSPolygon, getBingPolygon, getMapBoxPolygon, getTargamoPolygon, getIsoRaster } from '/external/api'
import { randomRanges, calcMean, calcStd, selectRandomPoints } from '/util/util'
import { getMapState } from '/state';
import { ITool } from '/tools/ITool';


const map = getMapState();

class TestFeatureCount implements ITool
{
    name: string = "TestFeatureCount";
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
        if (layer == null || layer.type != "Point")
        {
          throw new Error("pls select a pointlayer!");
        }
        if (param.testmode === "Isochrone")
            var alg = getDockerPolygon;
        else
            alg = getIsoRaster;
        var ranges = randomRanges(1, 1800);
        //var counts = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,25,30,40,50];
        var counts = [1,2,3,4,5];
        var times = {};
        for (var i = 0; i < counts.length; i++)
        {
            var k = counts[i];
            times[k] = [];
            addMessage(k);
            for (var c=0; c<10; c++)
            {
                var points = selectRandomPoints(layer, k);
                var start = new Date().getTime();
                await Promise.all(points.map(async element => {
                    var location = element.getGeometry().getCoordinates();
                    var geojson = await alg([location], ranges);
                }));
                var end = new Date().getTime();
                var time = end - start;
                times[k].push(time);
            }
        }
        var l = [];
        addMessage(times);
        for (var j in times)
        {
            var mean = calcMean(times[j]);
            var std = calcStd(times[j], mean);
            l.push(j+", "+mean+", "+std);
        }
        addMessage(l.join('\n'));
    }
}

const tool = new TestFeatureCount();
  
export { tool }