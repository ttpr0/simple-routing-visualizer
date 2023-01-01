import { computed, ref, reactive, onMounted, watch} from 'vue';
import { getAppState } from '/state';
import { getMap } from '/map';
import "ol/ol.css"
import "./MapRegion.css"
import { popup } from './Popup';

const mapregion = {
    components: { popup },
    props: [],
    setup() {
        const state = getAppState();
        const map = getMap();

        onMounted(() => {
            map.setTarget("mapregion")
            mapregion.value.addEventListener("contextmenu", (e) => {
                state.contextmenu.pos = [e.pageX, e.pageY]
                state.contextmenu.display = true
                state.contextmenu.context.map_pos = map.getEventCoordinate(e);
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