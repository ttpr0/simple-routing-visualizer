import { computed, ref, reactive, onMounted, watch} from '/lib/vue.js'
import { dragablewindow } from './DragableWindow.js';
import { useStore } from '/lib/vuex.js';
import { getMap } from '../app.js';

const mapregion = {
    components: { dragablewindow },
    props: ["style"],
    setup(props) {
        const store = useStore();
        const map = getMap();

        const showDialog = computed(() => { return store.state.featureinfo.display; });
        const pos = computed(() => { return store.state.featureinfo.pos; });
        const text = computed(() => {
            var t = "";
            t += "Feature: \n";
            if (store.state.featureinfo.feature == null)
            {
                return t;
            }
            var properties = store.state.featureinfo.feature.getProperties();
            for (var p in properties)
            {
              t += p + ": " + properties[p] + "\n";
            }
            return t;
        })

        function setShow(bool) {
            store.commit('setFeatureInfo', { display: bool });
        }

        onMounted(() => {
            map.olmap.setTarget("mapregion")
        })

        return {text, store, pos, showDialog, setShow}
    },
    template: `
    <div id="mapregion" :style="style"></div>
    <dragablewindow v-if="showDialog" :pos="pos" name="Feature-Info" @onclose="setShow(false)">
        <textarea class="featuretext">{{ text }}</textarea>
    </dragablewindow>
    `
} 

export { mapregion }