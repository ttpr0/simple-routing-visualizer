import { computed, ref, reactive, watch, toRef} from '/lib/vue.js'
import { layercheckbox } from '/components/LayerCheckBox.js'
import { pointstyle } from '/map/styles.js'
import { VectorLayer } from '/map/VectorLayer.js'
import { useStore } from '/lib/vuex.js';
import { getMap } from '../app.js'
import { getMultiGraph, getRouting } from '../routing/api.js';
import { accessibilityStyleFunction, lineStyle } from '../map/styles.js';

const analysisbar = {
    components: { layercheckbox },
    props: [ ],
    setup(props) {
        const store = useStore();
        const map  = getMap();

        function updateLayerTree() {
            store.commit('updateLayerTree');
        }

        const routingtype = ref("Dijktra");
        const draw = ref(false);

        const range = ref(900);
        const count = ref(1);
        
        const precession = computed(() => { return count.value*100; });

        const time = ref(0);

        async function multigraph()
        {
            const layer = map.getVectorLayerByName(store.state.layertree.focuslayer);
            if (layer == null || layer.type != "Point")
            {
              alert("pls select a pointlayer!");
              return;
            }
            if (layer.selectedfeatures.length > 100)
            {
              alert("pls mark less than 100 features!");
              return;
            }
            if (layer.selectedfeatures.length == 0)
            {
              alert("you have to mark at least one feature!");
              return;
            }
            var locations = [];
            layer.selectedfeatures.forEach(element => {
              locations.push(element.getGeometry().getCoordinates());
            })
            var start = new Date().getTime();
            var geojson = await getMultiGraph(locations, range.value, precession.value);
            var end = new Date().getTime();
            time.value = end - start;
            var multigraphlayer = map.getVectorLayerByName("multigraphlayer");
            if (multigraphlayer != null)
            {
                multigraphlayer.delete();
            }
            var features = new ol.format.GeoJSON().readFeatures(geojson);
            multigraphlayer = new VectorLayer(features, 'Polygon', 'multigraphlayer');
            multigraphlayer.setStyle(accessibilityStyleFunction);
            map.addVectorLayer(multigraphlayer);
            updateLayerTree();
        }

        async function routing()
        {
            const layer = map.getVectorLayerByName(store.state.layertree.focuslayer);
            if (layer == null || layer.type != "Point")
            {
              alert("pls select a pointlayer!");
              return;
            }
            if (layer.selectedfeatures.length != 2)
            {
              alert("pls mark two features!");
              return;
            }
            var startpoint = layer.selectedfeatures[0].getGeometry().getCoordinates();
            var endpoint = layer.selectedfeatures[1].getGeometry().getCoordinates();
            if (draw.value)
            {
              draw_routing(routingtype.value, startpoint, endpoint, 1000)
            }
            else
            {
              run_routing(routingtype.value, startpoint, endpoint);
            }
        }

        async function run_routing(alg, startpoint, endpoint)
        {
            var key = -1;
            var start = new Date().getTime();
            var geojson = await getRouting(startpoint, endpoint, key, false, 1, alg);
            var end = new Date().getTime();
            time.value = end - start;
            var routinglayer = map.getVectorLayerByName("routinglayer");
            if (routinglayer != null)
            {
                routinglayer.delete();
            }
            var features = new ol.format.GeoJSON().readFeatures(geojson);
            routinglayer = new VectorLayer(features, 'LineString', 'routinglayer');
            routinglayer.setStyle(lineStyle(true));
            map.addVectorLayer(routinglayer);
            updateLayerTree();
        }

        async function draw_routing(alg, startpoint, endpoint, stepcount)
        {
            var key = -1;
            var finished = false;
            var geojson = null;
            var routinglayer = map.getVectorLayerByName("routinglayer");
            if (routinglayer != null)
            {
                routinglayer.delete();
            }
            routinglayer = new VectorLayer([], 'LineString', "routinglayer");
            routinglayer.setStyle(lineStyle(false));
            map.addVectorLayer(routinglayer);
            updateLayerTree();
            var start = new Date().getTime();
            do
            {
                geojson = await getRouting(startpoint, endpoint, key, true, stepcount, alg);
                key = geojson.key;
                finished = geojson.finished;
                var features = new ol.format.GeoJSON().readFeatures(geojson);
                routinglayer.addFeatures(features);
            } while (!geojson.finished)
            var end = new Date().getTime();
            time.value = end - start;
            routinglayer.delete();
            updateLayerTree();
            features = new ol.format.GeoJSON().readFeatures(geojson);
            routinglayer = new VectorLayer(features, 'LineString', 'routinglayer');
            routinglayer.setStyle(lineStyle(true));
            map.addVectorLayer(routinglayer);
        }

        return { routingtype, draw, range, count, time, precession, multigraph, routing }
    },
    template: `
    <div class="analysisbar">
        <div class="button"><button type="button" id="btnrouting" @click="routing()">routing</button></div>
        <div>
            <input type="checkbox" id="drawrouting" v-model="draw">
            <label for="drawrouting">draw?</label>
        </div>
        <label for="algs">Choose a algorithm:</label>
        <select v-model="routingtype">
            <option value="Dijktra">Dijktra</option>
            <option value="A*">A-Star</option>
            <option value="Bidirect-Dijkstra">Bidirectional Dijktra</option>
            <option value="Bidirect-A*">Bidirectional A-Star</option>
        </select>
        <div class="button"><button type="button" id="btnmg" @click="multigraph()">multigraph</button></div>
        <div>
            <input type="range" id="range" v-model="range" min="0" max="5400">
            <label for="range">{{ range }}</label>
        </div>
        <div>
            <input type="range" id="rangecount" v-model="count" min="1" max="10">
            <label for="rangecount">{{ precession }}</label>
        </div>
        <div id="txttime">Calculation Time: {{ time }}</div>
    </div>
    `
} 

export { analysisbar }