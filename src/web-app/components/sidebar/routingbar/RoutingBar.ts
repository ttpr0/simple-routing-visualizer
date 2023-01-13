import { computed, ref, reactive, watch, toRef, onMounted} from 'vue';
import { VectorImageLayer } from '/map/VectorImageLayer';
import { getAppState, getMapState } from '/state';
import { getMap } from '/map';
import { CONFIG, POPUPCOMPS, SIDEBARCOMPS } from "/config" 
import { NSpace, NTag, NSelect, NCheckbox, NButton } from 'naive-ui';
import './RoutingBar.css'
import { getRouting, getRoutingDrawContext, getRoutingStep } from '/routing/api';
import { LineStyle } from '/map/style/LineStyle';

const routingbar = {
    components: { NSpace, NTag, NSelect, NCheckbox, NButton },
    props: [ ],
    setup(props) {
        const state = getAppState();
        const map = getMap();
        const map_state = getMapState();

        const layers = computed(() => map_state.layers);
        watch(layers, () => {
            const l = map_state.layers.find(layer => layer.name === "routing_points" )
            if (l === undefined) {
                CONFIG["app"]["sidebar"] = CONFIG["app"]["sidebar"].filter(elem => elem.comp !== "RoutingBar")
                state.sidebar.active = ""
            }
        })

        const runRouting = async () => {
            let startpoint = params["start"];
            let endpoint = params["finish"];
            let routing_type = params["type"];
            if (startpoint === null) {
                alert("pls select a valid start-point")
                return
            }
            if (endpoint === null) {
                alert("pls select a valid end-point")
                return
            }
            if (routing_type === undefined) {
                alert("pls select a valid routing type")
                return
            }

            try {
                if (params["draw"]) 
                {
                    let context = await getRoutingDrawContext(startpoint, endpoint, routing_type);
                    let key = context["key"];
                    var finished = false;
                    var geojson = null;
                    let routinglayer = new VectorImageLayer([], 'LineString', "routing_layer");
                    routinglayer.setStyle(new LineStyle('green', 2));
                    map.addLayer(routinglayer);
                    var start = new Date().getTime();
                    while (true) {
                        geojson = await getRoutingStep(key, 1000);
                        if (geojson.finished) {
                            break;
                        }
                        routinglayer.addFeatures(geojson["features"]);
                        // for (let feature of geojson["features"]) {
                        //     routinglayer.addFeature(feature);
                        // }
                        console.log(routinglayer.ol_layer.getSource().getFeatures().length)
                    }
                    var end = new Date().getTime();
                    routinglayer = new VectorImageLayer(geojson["features"], 'LineString', 'routing_layer');
                    routinglayer.setStyle(new LineStyle('#ffcc33', 10));
                    map.addLayer(routinglayer);
                }
                else 
                {
                    var key = -1;
                    var start = new Date().getTime();
                    var geojson = await getRouting(startpoint, endpoint, key, false, 1, routing_type);
                    var end = new Date().getTime();
                    let routinglayer = new VectorImageLayer(geojson["features"], 'LineString', 'routing_layer');
                    routinglayer.setStyle(new LineStyle('#ffcc33', 10));
                    map.addLayer(routinglayer);
                }

                //map.removeLayer("routing_points")
            }
            catch (e) {
                alert("An Exception has occured: " + e)
            }
        }

        const handleClose = (type: string) => {
            const layer = map.getLayerByName("routing_points");
            for (let id of layer.getAllFeatures()) {
                const t = layer.getProperty(id, "type")
                if (t === type) {
                  layer.removeFeature(id)
                }
            }
        }

        const params = reactive({});
        function readFromLayer(layer: VectorImageLayer) {
            params["start"] = null
            params["finish"] = null
            for (let id of layer.getAllFeatures()) {
                let type = layer.getProperty(id, "type")
                if (type === "start")
                    params["start"] = layer.getGeometry(id)["coordinates"]
                if (type === "finish")
                    params["finish"] = layer.getGeometry(id)["coordinates"]
            }
        }

        onMounted(() => {
            const layer = map.getLayerByName("routing_points");
            readFromLayer(layer as VectorImageLayer)
            layer.on("change", () => { readFromLayer(layer as VectorImageLayer) })
        })

        return { params, handleClose, runRouting }
    },
    template: `
    <div class="layerbar">
        <n-space vertical>
            <p>from:</p>
            <n-tag closable @close="handleClose('start')">
                {{ params.start }}
            </n-tag>
            <p>to:</p>
            <n-tag closable @close="handleClose('finish')">
                {{ params.finish }}
            </n-tag>
            <p>routing type:</p>
            <n-select v-model:value="params.type" :options="[{label:'Dijkstra',value:'Dijkstra'},{label:'AStar',value:'A*'},{label:'Bidirectional Dijkstra',value:'Bidirect-Dijkstra'},{label:'Bidirectional AStar',value:'Bidirect-A*'}]" />
            <n-checkbox v-model:checked="params.draw">{{ 'draw?' }}</n-checkbox>
            <p>run routing:</p>
            <n-button @click="runRouting()">    Run    </n-button>
        </n-space>
    </div>
    `
} 

export { routingbar }