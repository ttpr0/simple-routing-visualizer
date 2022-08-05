import { computed, ref, reactive, watch, toRef} from 'vue';
import { layertreeitem } from './LayerTreeItem';
import { VectorLayer } from '/map/VectorLayer';
import { getState } from '/store/state';
import { getMap } from '/map/maps';
import './LayerBar.css'

const layerbar = {
    components: { layertreeitem },
    props: [ ],
    setup(props) {
        const state = getState();
        const map = getMap();

        const layers = computed(() => {
            let test = state.layertree.update;
            return map.layers;
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