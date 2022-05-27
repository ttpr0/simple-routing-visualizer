import { computed, ref, reactive, onMounted, watch} from 'vue';
import { dragablewindow } from './DragableWindow.js';
import { getState } from '/store/state.js';
import { getMap } from '/map/maps.js';

const mapregion = {
    components: { dragablewindow },
    props: [],
    setup() {
        const state = getState();
        const map = getMap();

        const showDialog = computed(() => { return state.featureinfo.display; });
        const pos = computed(() => { return state.featureinfo.pos; });
        const text = computed(() => {
            var t = "";
            t += "Feature: \n";
            if (state.featureinfo.feature == null)
            {
                return t;
            }
            var properties = state.featureinfo.feature.getProperties();
            for (var p in properties)
            {
              t += p + ": " + properties[p] + "\n";
            }
            return t;
        })

        function setShow(bool) {
            if (bool != null) state.featureinfo.display = bool;
        }

        onMounted(() => {
            map.olmap.setTarget("mapregion")
        })

        return {text, state, pos, showDialog, setShow}
    },
    template: `
    <div id="mapregion"></div>
    <dragablewindow v-if="showDialog" :pos="pos" name="Feature-Info" @onclose="setShow(false)">
        <textarea class="featuretext">{{ text }}</textarea>
    </dragablewindow>
    `
} 

export { mapregion }