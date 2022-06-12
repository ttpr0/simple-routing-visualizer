import { computed, ref, reactive, watch, toRef} from 'vue';
import { VectorLayer } from '/map/VectorLayer.js';
import { getState } from '/store/state.js';
import { getMap } from '/map/maps.js';
import './FilesBar.css'
import { filetree } from './FileTree.js';

const filesbar = {
    components: { filetree },
    props: [ ],
    setup(props) {
        const state = getState();
        const map = getMap();

        const directories = computed(() => {
            return state.filetree.connections;
        })

        return { directories }
    },
    template: `
    <div class="filesbar">
        <div v-for="dir in directories">
            <filetree :path="dir.key + '/'" :item="dir.tree"></filetree>
            <div class="divider"></div>
        </div>
    </div>
    `
} 

export { filesbar }