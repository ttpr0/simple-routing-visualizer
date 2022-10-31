import { computed, ref, reactive, watch, toRef, onMounted} from 'vue';
import { VectorLayer } from '/map/VectorLayer';
import { getAppState, getMapState } from '/state';
import { CONFIG, POPUPCOMPS, SIDEBARCOMPS } from "/config" 
import { NSpace, NTag, NSelect, NCheckbox, NButton } from 'naive-ui';
import './RoutingBar.css'
import { getRouting } from '/routing/api';
import { lineStyle } from '/map/styles';

const routingbar = {
    components: { NSpace, NTag, NSelect, NCheckbox, NButton },
    props: [ ],
    setup(props) {
        const state = getAppState();
        const map = getMapState();

        const layers = computed(() => map.layers);
        watch(layers, () => {
            const l = map.layers.find(layer => layer.name === "routing_points" )
            if (l === undefined) {
                CONFIG["app"]["sidebar"] = CONFIG["app"]["sidebar"].filter(elem => elem.comp !== "RoutingBar")
                state.sidebar.active = ""
            }
        })

        const runRouting = async () => {
            let startpoint = params["start"];
            let endpoint = params["finish"];
            let routing_type = params["type"];
            if (startpoint === undefined) {
                alert("pls select a valid start-point")
                return
            }
            if (endpoint === undefined) {
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
                    var key = -1;
                    var finished = false;
                    var geojson = null;
                    let routinglayer = new VectorLayer([], 'LineString', "routinglayer");
                    (routinglayer as VectorLayer).setStyleFunction((feature, resolution) => lineStyle(false));
                    map.addLayer(routinglayer);
                    var start = new Date().getTime();
                    do
                    {
                        geojson = await getRouting(startpoint, endpoint, key, true, 1000, routing_type);
                        key = geojson.key;
                        finished = geojson.finished;
                        for (let feature of geojson["features"]) {
                            routinglayer.addFeature(feature);
                        }
                    } while (!geojson.finished)
                    var end = new Date().getTime();
                    routinglayer = new VectorLayer(geojson["features"], 'LineString', 'routing_layer');
                    (routinglayer as VectorLayer).setStyleFunction((feature, resolution) => lineStyle(true));
                    map.addLayer(routinglayer);
                }
                else 
                {
                    var key = -1;
                    var start = new Date().getTime();
                    var geojson = await getRouting(startpoint, endpoint, key, false, 1, routing_type);
                    var end = new Date().getTime();
                    let routinglayer = new VectorLayer(geojson["features"], 'LineString', 'routing_layer');
                    (routinglayer as VectorLayer).setStyleFunction((feature, resolution) => lineStyle(true));
                    map.addLayer(routinglayer);
                }

                map.removeLayer("routing_points")
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
        function readFromLayer(layer: VectorLayer) {
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
            readFromLayer(layer as VectorLayer)
            layer.on("change", () => { readFromLayer(layer as VectorLayer) })
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
            <n-select v-model:value="params.type" :options="[{label:'Dijkstra',value:'Dijkstra'},{label:'AStar',value:'A*'},{label:'Bidirectional Dijkstra',value:'Bidirect-Dijkstra'},{label:'Bidirectional AStar',value:'Bidirectional-A*'}]" />
            <n-checkbox v-model:checked="params.draw">{{ 'draw?' }}</n-checkbox>
            <p>run routing:</p>
            <n-button @click="runRouting()">    Run    </n-button>
        </n-space>
    </div>
    `
} 

export { routingbar }