import { computed, ref, reactive, watch, toRef} from 'vue'
import { VectorLayer } from '/map/VectorLayer.js'
import { useStore } from 'vuex';
import { getMap } from '/map/maps.js';
import { getMultiGraph, getRouting } from '../routing/api.js';
import { accessibilityStyleFunction, lineStyle } from '../map/styles.js';
import { toolbarcomp } from './ToolBarComp.js';

const analysistoolbar = {
    components: { toolbarcomp },
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
        const count = ref(100); 

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
            var geojson = await getMultiGraph(locations, range.value, count.value);
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
              draw_routing(routingtype.value, startpoint, endpoint, 1000);
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
            console.log(geojson)
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
                routinglayer.getSource().addFeatures(features);
            } while (!geojson.finished)
            var end = new Date().getTime();
            time.value = end - start;
            routinglayer.delete();
            features = new ol.format.GeoJSON().readFeatures(geojson);
            routinglayer = new VectorLayer(features, 'LineString', 'routinglayer');
            routinglayer.setStyle(lineStyle(true));
            map.addVectorLayer(routinglayer);
            updateLayerTree();
        }

        return { routingtype, draw, range, count, time, multigraph, routing }
    },
    template: `
    <div class="analysistoolbar">
      <toolbarcomp name="Routing">
        <div class="container">
          <button class="bigbutton" @click="routing()">Start<br>Routing</button>
        </div>
        <div class="container">
          <div>
            <input type="checkbox" id="drawrouting" v-model="draw">
            <label for="drawrouting">draw?</label>
          </div>
          <div>
            <label for="algs">Choose a algorithm:</label><br>
            <select v-model="routingtype">
              <option value="Dijktra">Dijktra</option>
              <option value="A*">A-Star</option>
              <option value="Bidirect-Dijkstra">Bidirectional Dijktra</option>
              <option value="Bidirect-A*">Bidirectional A-Star</option>
            </select>
          </div>
          <div id="txttime">Calculation Time: {{ time }}</div>
        </div>
      </toolbarcomp>
      <toolbarcomp name="Multigraph">
        <div class="container">
          <button class="bigbutton" @click="multigraph()">Run<br>Multigraph</button>
        </div>
        <div class="container">
          <label for="range">{{ range }}</label><br>
          <input type="range" id="range" v-model="range" min="0" max="5400"><br>
          <label for="rangecount">{{ count }}</label><br>
          <input type="range" id="rangecount" v-model="count" min="100" max="1000"><br>
        </div>
      </toolbarcomp>
    </div>
    `
} 

export { analysistoolbar }