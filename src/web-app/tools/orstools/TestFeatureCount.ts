import { computed, ref, reactive, watch, toRef } from 'vue';
import { getDockerPolygon, getIsoRaster } from '/util/external/api';
import { randomRanges, calcMean, calcStd, selectRandomPoints } from '/util/utils';
import { getMap } from '/map';
import { ITool } from '/components/sidebar/toolbar/ITool';


const map = getMap();

class TestFeatureCount implements ITool {
    name: string = "TestFeatureCount";
    param = [
        { name: "layer", title: "Layer", info: "Punkt-Layer", type: "layer", layertype: 'Point', text: "Layer:" },
        { name: "testmode", title: "Test-Mode", info: "Test-Modus", type: "select", values: ['Isochrone', 'IsoRaster'], text: "Test-Mode" },
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
        return { testmode: 'Isochrone' };
    }
    updateParameterInfo(param: object, param_info: object[], changed: string): [object[], object] {
        return [null, param];
    }

    async run(param, out, addMessage) {
        const layer = map.getLayerByName(param.layer);
        if (layer == null || layer.getType() != "Point") {
            throw new Error("pls select a pointlayer!");
        }
        if (param.testmode === "Isochrone")
            var alg = getDockerPolygon;
        else
            alg = getIsoRaster;
        var ranges = randomRanges(1, 1800);
        //var counts = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,25,30,40,50];
        var counts = [1, 2, 3, 4, 5];
        var times = {};
        for (var i = 0; i < counts.length; i++) {
            var k = counts[i];
            times[k] = [];
            addMessage(k);
            for (var c = 0; c < 10; c++) {
                var points = selectRandomPoints(layer, k);
                var start = new Date().getTime();
                await Promise.all(points.map(async element => {
                    let feature = layer.getFeature(element);
                    var location = feature.geometry.coordinates;
                    var geojson = await alg([location], ranges);
                }));
                var end = new Date().getTime();
                var time = end - start;
                times[k].push(time);
            }
        }
        var l = [];
        addMessage(times);
        for (var j in times) {
            var mean = calcMean(times[j]);
            var std = calcStd(times[j], mean);
            l.push(j + ", " + mean + ", " + std);
        }
        addMessage(l.join('\n'));
    }
}

const tool = new TestFeatureCount();

export { tool }