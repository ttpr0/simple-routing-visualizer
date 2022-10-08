import { computed, ref, reactive, onMounted, watch} from 'vue';
import { dragablewindow } from '/app/util/DragableWindow';
import { getAppState, getMapState } from '/state';
import { NDataTable } from 'naive-ui';
import "ol/ol.css"
import "./MapRegion.css"

const mapregion = {
    components: { dragablewindow, NDataTable },
    props: [],
    setup() {
        const state = getAppState();
        const map = getMapState();

        const showDialog = computed(() => { return state.featureinfo.display; });
        const pos = computed(() => { return state.featureinfo.pos; });
        const data = computed(() => {
            var d = [];
            if (state.featureinfo.feature == null)
            {
                return d;
            }
            var properties = state.featureinfo.feature["properties"];
            for (var p in properties)
            {
              d.push({prop: p, val: String(properties[p])});
            }
            return d;
        })


        function setShow(bool) {
            if (bool != null) state.featureinfo.display = bool;
        }

        onMounted(() => {
            map.setTarget("mapregion")
        })

        return { data, state, pos, showDialog, setShow}
    },
    template: `
    <div id="mapregion" class="mapregion"></div>
    <dragablewindow v-if="showDialog" :pos="pos" name="Feature-Info" icon="mdi-information-outline" @onclose="setShow(false)">
        <div style="width: 400px; height: 300px;">
            <n-data-table
                :columns="[{title: 'Property',key: 'prop'},{title: 'Value',key: 'val'}]"
                :data="data"
                :pagination="false"
                :max-height="250"
                :width="400"
            />
        </div>
    </dragablewindow>
    `
} 

export { mapregion }