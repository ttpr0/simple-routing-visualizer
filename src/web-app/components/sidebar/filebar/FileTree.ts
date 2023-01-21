import { computed, ref, reactive, watch, toRef} from 'vue';
import { VectorLayer } from '/map/VectorLayer';
import { getAppState } from '/state';
import { filetreeitem } from './FileTreeItem';
import { getTree, closeDirectory } from '/util/fileapi';

const filetree = {
    name: 'filetree',
    components: { filetreeitem },
    props: [ 'path', 'item' ],
    setup(props, ctx) {
        const state = getAppState();

        const open = ref(false);

        function onRightClick(e) {
            state.contextmenu.pos = [e.pageX, e.pageY]
            state.contextmenu.display = true
            state.contextmenu.context.path = props.path;
            state.contextmenu.context.name = props.item.name;
            state.contextmenu.context.type = props.item.type;
            if (props.item.type === 'dir') {
                if (props.path.split("/").length === 2) {
                    state.contextmenu.type = "filetree:root-dir";
                }
                else {
                    state.contextmenu.type = "filetree:dir";
                }
            }
            else if (['vector', 'raster'].includes(props.item.type)) {
                state.contextmenu.type = "filetree:layer";
            }
            else {
                state.contextmenu.display = false;
            }
        }

        return { open, onRightClick }
    },
    template: `
    <div class="filetree">
        <filetreeitem :path="path" :name="item.name" :type="item.type" :open="open" @click="open=!open" @contextmenu="onRightClick"></filetreeitem>
        <div class="children" v-if="item.children !== undefined && open">
            <filetree v-for="child in item.children" :key="child.name" :path="path + item.name + '/'" :item="child"></filetree>
        </div>
    </div>
    `
} 

export { filetree }