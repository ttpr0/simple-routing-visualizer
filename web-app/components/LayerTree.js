import { computed, ref, reactive, watch, toRef} from 'vue';
import { layertreeitem } from './LayerTreeItem.js';
import { pointstyle } from '/map/styles.js';
import { VectorLayer } from '/map/VectorLayer.js';
import { useStore } from 'vuex';
import { getMap } from '/map/maps.js';

const layertree = {
    components: { layertreeitem },
    props: [ ],
    setup(props) {
        const filedialog = ref(null);
        const store = useStore();
        const map = getMap();

        const layers = computed(() => {
            var test = store.state.layertree.update;
            return map.vectorlayers;
        })

        return { layers}
    },
    template: `
    <div class="layerbar">
        <layertreeitem v-for="layer in layers" :layer="layer"></layertreeitem>
    </div>
    `
} 

export { layertree }