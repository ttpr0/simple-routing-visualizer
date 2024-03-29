import { computed, ref, reactive, watch, toRef } from 'vue';
import { PolygonLayer } from '/map/layers';
import { getORSPolygon } from '/util/external/api';
import { randomRanges } from '/util/utils';
import { GeoJSON } from 'ol/format';
import { getMap } from '/map';
import { ITool } from '/components/sidebar/toolbar/ITool';


const map = getMap();

class ORSApiTest implements ITool {
    name: string = "ORSApiTest";

    param = [
        { name: "layer", title: "Layer", info: "Punkt-Layer", type: "layer", layertype: 'Point', text: "Layer:" },
        { name: "range", title: "Reichweite", info: "Reichweite", type: "range", values: [100, 3600, 100], text: "check?" },
        { name: "count", title: "Intervalle", info: "Intervalle", type: "range", values: [1, 10, 1], text: "check?" }
    ]

    out = [
        { name: 'orslayer', type: 'layer' },
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
        return { range: 900, count: 1 };
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
        if (selectedfeatures.length > 20 || selectedfeatures.length == 0) {
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
        out.orslayer = new PolygonLayer(polygons, 'orslayer');
    }
}

const tool = new ORSApiTest();

export { tool }