import { VectorLayer } from '/map/VectorLayer';
import { VectorImageLayer } from '/map/VectorImageLayer';
import { VisualRoutingLayer } from '/map/layer/VisualRoutingLayer';
import { getMap } from '/map';
import { getToolbarState } from '/state';
import { ITool } from '/components/sidebar/toolbar/ITool';
import { getRouting, getRoutingDrawContext, getRoutingStep } from '/routing/api';
import { LineStyle } from '/map/style';


const map = getMap();
const toolbar = getToolbarState();

const handleClose = (type: string) => {
    const layer = map.getLayerByName("routing_points");
    if (layer !== undefined) {
        for (let id of layer.getAllFeatures()) {
            const t = layer.getProperty(id, "type")
            if (t === type) {
                layer.removeFeature(id)
                if (type === "start")
                    toolbar.currtool.params["startpoint"] = undefined;
                if (type === "finish")
                    toolbar.currtool.params["endpoint"] = undefined;
            }
        }
    }
    else {
        if (type === "start")
            toolbar.currtool.params["startpoint"] = undefined;
        if (type === "finish")
            toolbar.currtool.params["endpoint"] = undefined;
    }
}

class Routing implements ITool 
{
    name: string = "Routing";
    param = [
        { name: "startpoint", title: "Start", info: "", type: "closeable_tag", values: [], onClose: () => handleClose('start') },
        { name: "endpoint", title: "Finish", info: "", type: "closeable_tag", values: [], onClose: () => handleClose('finish') },
        { name: "draw", title: "Draw Routing", info: "", type: "check", values: [], text: "draw?" },
        { name: "routingtype", title: "Routing Algorithm", info: "", type: "select", values: ['Dijktra', 'A*', 'Bidirect-Dijkstra', 'Bidirect-A*'], text: "Routing-Alg" },
        { name: 'outname', title: 'Output Name', info: 'Name des Output-Layers', type: 'text', text: 'Name' },
    ]
    out = [
        { name: 'outlayer', type: 'layer' },
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
        let start = undefined;
        let end = undefined;
        const layer = map.getLayerByName("routing_points");
        if (layer !== undefined) {
            for (let id of layer.getAllFeatures()) {
                let type = layer.getProperty(id, "type")
                if (type === "start")
                    start = layer.getGeometry(id)["coordinates"]
                if (type === "finish")
                    end = layer.getGeometry(id)["coordinates"]
            }
        }
        return {
            startpoint: start,
            endpoint: end,
            draw: false,
            routingtype: "Djkstra",
            outname: "routing_layer"
        };
    }
    updateParameterInfo(param: object, param_info: object[], changed: string): [object[], object] {
        return [null, param];
    }

    async run(param, out, addMessage) {
        let startpoint = param["startpoint"];
        let endpoint = param["endpoint"];
        let routing_type = param["routingtype"];
        if (startpoint === undefined) {
            throw new Error("pls select a valid start-point");
        }
        if (endpoint === undefined) {
            throw new Error("pls select a valid end-point");
        }
        if (routing_type === undefined) {
            throw new Error("pls select a valid routing type");
        }

        try {
            if (param["draw"]) {
                let context = await getRoutingDrawContext(startpoint, endpoint, routing_type);
                let key = context["key"];
                var finished = false;
                var geojson = null;
                let visualroutinglayer = new VisualRoutingLayer(null, null, "routing_layer");
                map.addLayer(visualroutinglayer);
                var start = new Date().getTime();
                while (true) {
                    geojson = await getRoutingStep(key, 1000);
                    if (geojson.finished) {
                        break;
                    }
                    visualroutinglayer.addFeatures(geojson["features"]);
                }
                var end = new Date().getTime();
                let routinglayer = new VectorImageLayer(geojson["features"], 'LineString', param.outname);
                routinglayer.setStyle(new LineStyle('#ffcc33', 10));
                out.outlayer = routinglayer;
            }
            else {
                var key = -1;
                var start = new Date().getTime();
                var geojson = await getRouting(startpoint, endpoint, key, false, 1, routing_type);
                var end = new Date().getTime();
                let routinglayer = new VectorImageLayer(geojson["features"], 'LineString', param.outname);
                routinglayer.setStyle(new LineStyle('#ffcc33', 10));
                out.outlayer = routinglayer;
            }
        }
        catch (e) {
            alert("An Exception has occured: " + e)
        }
    }
}

const tool = new Routing();

export { tool }