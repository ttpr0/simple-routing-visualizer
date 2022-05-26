import { computed, ref, reactive, onMounted, defineExpose} from 'vue';
import { layertree } from './LayerTree';
import { getMap } from '/map/maps.js';

const sidebar = {
    components: { layertree },
    props: [ ],
    setup(props) {
        const show_analysis = ref(true);
        const show_layer = ref(false);
        const show_select = ref(false);
        return {show_analysis, show_layer, show_select}
    },
    template: `
    <div class="sidebar">
        <layertree></layertree>
    </div>
    `
} 

export { sidebar }