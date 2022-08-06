import { computed, ref, reactive, onMounted, watch} from 'vue';
import { dragablewindow } from '/components/util/DragableWindow';
import { getAppState, getMapState } from '/state';
import "./MapRegion.css"

const mapregion = {
    components: { dragablewindow },
    props: [],
    setup() {
        const state = getAppState();
        const map = getMapState();

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
            map.setTarget("mapregion")
        })

        return {text, state, pos, showDialog, setShow}
    },
    template: `
    <div id="mapregion" class="mapregion"></div>
    <dragablewindow v-if="showDialog" :pos="pos" name="Feature-Info" icon="mdi-information-outline" @onclose="setShow(false)">
        <textarea class="featuretext" readonly>{{ text }}</textarea>
    </dragablewindow>
    `
} 

export { mapregion }