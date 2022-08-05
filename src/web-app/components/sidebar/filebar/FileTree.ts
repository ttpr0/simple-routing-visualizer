import { computed, ref, reactive, watch, toRef} from 'vue';
import { VectorLayer } from '/map/VectorLayer';
import { getState } from '/store/state';
import { getMap } from '/map/maps';
import { filetreeitem } from './FileTreeItem';
import { refreshDirectory, closeDirectory } from '/util/fileapi';

const filetree = {
    name: 'filetree',
    components: { filetreeitem },
    props: [ 'path', 'item' ],
    setup(props, ctx) {
        const state = getState();
        const map = getMap();

        const open = ref(false);

        function onClose() {
            open.value = false;
            if (props.path.split('/').length === 2)
            {
                var key = props.path.split('/')[0];
                state.filetree.connections = state.filetree.connections.filter(item => item.key !== key);
                closeDirectory(key)
            }
        }

        async function onRefresh() {
            let dir = await refreshDirectory(props.path + '/' + props.item.name);
            props.item.children = dir.children;
        }

        return { open, onClose, onRefresh }
    },
    template: `
    <div class="filetree">
        <filetreeitem :path="path" :name="item.name" :type="item.type" :open="open" @click="open=!open" @close="onClose" @refresh="onRefresh"></filetreeitem>
        <div class="children" v-if="item.children.length > 0 && open">
            <filetree v-for="child in item.children" :path="path + item.name + '/'" :item="child"></filetree>
        </div>
    </div>
    `
} 

export { filetree }