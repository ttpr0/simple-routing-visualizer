import { ITool } from "/components/sidebar/toolbar/ITool";
import { getMap } from '/map';
import { ILayer } from "/map/ILayer";
import { GeoJSON } from "ol/format";
import { VectorLayer } from "/map/VectorLayer";

const map = getMap();

class TestTool implements ITool
{
    name: string = "Test";
    param = [
        {name: "layer", title: "Layer", info: "", type: "layer", layertype:'Point', text:"Layer:"},
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
    
    async run(param, out, addMessage) {
        const layer: ILayer = map.getLayerByName(param.layer);
        if (layer == null || layer.getType() != "Point") {
            throw new Error("pls select a pointlayer!");
        }
        const id = (layer as VectorLayer).selected_features[0];
        const feature = layer.getFeature(id);

        console.log(feature);
    }
}

const tool = new TestTool();

export { tool }