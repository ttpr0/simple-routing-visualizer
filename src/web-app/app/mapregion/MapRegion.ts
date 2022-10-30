import { computed, ref, reactive, onMounted, watch} from 'vue';
import { getAppState, getMapState } from '/state';
import { NDataTable } from 'naive-ui';
import "ol/ol.css"
import "./MapRegion.css"
import { popup } from './Popup';
import { Overlay } from 'ol';

const mapregion = {
    components: { popup },
    props: [],
    setup() {
        const state = getAppState();
        const map = getMapState();

        onMounted(() => {
            map.setTarget("mapregion")
            mapregion.value.addEventListener("contextmenu", (e) => {
                e.preventDefault()
            })
        })

        const mapregion = ref(null);

        return { mapregion }
    },
    template: `
    <div id="mapregion" class="mapregion" ref="mapregion"></div>
    <popup></popup>
    `
} 

export { mapregion }