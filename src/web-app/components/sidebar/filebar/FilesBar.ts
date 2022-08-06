import { computed, ref, reactive, watch, toRef} from 'vue';
import { VectorLayer } from '/map/VectorLayer';
import { getAppState } from '/state';
import './FilesBar.css'
import { filetree } from './FileTree';

const filesbar = {
    components: { filetree },
    props: [ ],
    setup(props) {
        const state = getAppState();

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