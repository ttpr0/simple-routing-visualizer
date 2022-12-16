import { computed, ref, reactive, onMounted, watch} from 'vue';
import { getAppState } from '/state';
import { getMap } from '/map';
import { NDataTable } from 'naive-ui';
import "ol/ol.css"
import "./MapRegion.css"
import { popup } from './Popup';
import { contextmenu } from './ContextMenu';
import { Overlay } from 'ol';

const mapregion = {
    components: { popup, contextmenu },
    props: [],
    setup() {
        const state = getAppState();
        const map = getMap();

        onMounted(() => {
            map.setTarget("mapregion")
            mapregion.value.addEventListener("contextmenu", (e) => {
                state.contextmenu.pos = [e.pageX, e.pageY]
                state.contextmenu.display = true
                state.contextmenu.context.map_pos = map.getCoordinateFromPixel([e.offsetX, e.offsetY])
                e["ctx_inside"] = "nvnkjvnrni"
                e.preventDefault()
            })
        })

        const mapregion = ref(null);

        return { mapregion }
    },
    template: `
    <div id="mapregion" class="mapregion" ref="mapregion"></div>
    <popup></popup>
    <contextmenu></contextmenu>
    `
} 

export { mapregion }