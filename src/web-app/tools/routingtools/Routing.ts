import { VisualRoutingLayer } from '/map/layers/ol/VisualRoutingLayer';
import { LineStringLayer } from '/map/layers';
import { LineStyle } from '/map/styles';
import { getMap } from '/map';
import { getToolbarState } from '/state';
import { ITool } from '/components/sidebar/toolbar/ITool';
import { getRouting, getRoutingDrawContext, getRoutingStep } from '/util/routing/api';


const map = getMap();
const toolbar = getToolbarState();

const handleClose = (type: string) => {
    const layer = map.getOLLayer("routing_points");
    if (layer !== undefined) {
        for (let feat of layer.getSource().getFeatures()) {
            const t = feat.get("type")
            if (t === type) {
                layer.getSource().removeFeature(feat);
                if (type === "start")
                    toolbar.toolview.params["startpoint"] = undefined;
                if (type === "finish")
                    toolbar.toolview.params["endpoint"] = undefined;
            }
        }
    }
    else {
        if (type === "start")
            toolbar.toolview.params["startpoint"] = undefined;
        if (type === "finish")
            toolbar.toolview.params["endpoint"] = undefined;
    }
}

class Routing implements ITool {
    name: string = "Routing";
    param = [
        { name: "startpoint", title: "Start", info: "", type: "closeable_tag", values: [], onClose: () => handleClose('start') },
        { name: "endpoint", title: "Finish", info: "", type: "closeable_tag", values: [], onClose: () => handleClose('finish') },
        { name: "draw", title: "Draw Routing", info: "", type: "check", values: [], text: "draw?" },
        { name: "routingtype", title: "Routing Algorithm", info: "", type: "select", values: ['Dijkstra', 'A*', 'Bidirect-Dijkstra', 'Bidirect-A*', 'Distributed-Dijkstra', 'BODijkstra'], text: "Routing-Alg" },
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
        const layer = map.getOLLayer("routing_points");
        if (layer !== undefined) {
            for (let feat of layer.getSource().getFeatures()) {
                let type = feat.get("type");
                if (type === "start")
                    start = feat.getGeometry().getCoordinates();
                if (type === "finish")
                    end = feat.getGeometry().getCoordinates();
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
                let visualroutinglayer = new VisualRoutingLayer(null, null);
                map.addOLLayer("routing_layer", visualroutinglayer);
                let start = new Date().getTime();
                let steps = 1000;
                if (routing_type === 'Distributed-Dijkstra') {
                    steps = 10000;
                }
                while (true) {
                    geojson = await getRoutingStep(key, steps);
                    if (geojson.finished) {
                        break;
                    }
                    visualroutinglayer.addFeatures(geojson["features"]);
                }
                let end = new Date().getTime();
                map.removeOLLayer("routing_layer");
                let routinglayer = new LineStringLayer(geojson["features"], param.outname, new LineStyle([138, 43, 226, 200], 100));
                out.outlayer = routinglayer;
            }
            else {
                var key = -1;
                var start = new Date().getTime();
                var geojson = await getRouting(startpoint, endpoint, key, false, 1, routing_type);
                var end = new Date().getTime();
                let routinglayer = new LineStringLayer(geojson["features"], param.outname, new LineStyle([138, 43, 226, 200], 100));
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