import { computed, ref, reactive, watch, toRef} from 'vue';
import { layertreeitem } from './LayerTreeItem.js';
import { VectorLayer } from '/map/VectorLayer.js';
import { getState } from '/store/state.js';
import { getMap } from '/map/maps.js';
import './LayerBar.css'

const layerbar = {
    components: { layertreeitem },
    props: [ ],
    setup(props) {
        const state = getState();
        const map = getMap();

        const layers = computed(() => {
            var test = state.layertree.update;
            return map.vectorlayers;
        })

        return { layers }
    },
    template: `
    <div class="layerbar">
        <layertreeitem v-for="layer in layers" :layer="layer"></layertreeitem>
    </div>
    `
} 

export { layerbar}