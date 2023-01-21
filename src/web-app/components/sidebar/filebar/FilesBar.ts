import { computed, ref, reactive, watch, toRef} from 'vue';
import { VectorLayer } from '/map/VectorLayer';
import { getAppState } from '/state';
import './FilesBar.css'
import { filetree } from './FileTree';
import { NButton } from 'naive-ui';
import { getConnectionManager } from '/components/sidebar/filebar/ConnectionManager';
import { FileAPIConnection } from '/components/sidebar/filebar/FileAPIConnection';

const filesbar = {
    components: { NButton, filetree },
    props: [ ],
    setup(props) {
        const state = getAppState();
        const connmanager = getConnectionManager();

        const directories = computed(() => {
            return state.filetree.connections;
        })

        async function newConnection() {
            let conn = new FileAPIConnection();
            await connmanager.addConnection(conn);
        }

        return { directories, newConnection }
    },
    template: `
    <div class="filesbar">
        <div v-for="(value, key) in directories" :key="key">
            <filetree :path="key + '/'" :item="directories[key]"></filetree>
            <div class="divider"></div>
        </div>
        <n-button @click="newConnection" dashed>
            + new Connection
        </n-button>
    </div>
    `
} 

export { filesbar }