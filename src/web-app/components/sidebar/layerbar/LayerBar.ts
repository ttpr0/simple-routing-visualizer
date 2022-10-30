import { computed, ref, reactive, watch, toRef} from 'vue';
import { layertreeitem } from './LayerTreeItem';
import { VectorLayer } from '/map/VectorLayer';
import { getAppState, getMapState } from '/state';
import './LayerBar.css'

const layerbar = {
    components: { layertreeitem },
    props: [ ],
    setup(props) {
        const state = getAppState();
        const map = getMapState();

        const layers = computed(() => map.layers);

        return { layers }
    },
    template: `
    <div class="layerbar">
        <layertreeitem v-for="layer in layers" :layer="layer"></layertreeitem>
    </div>
    `
} 

export { layerbar}