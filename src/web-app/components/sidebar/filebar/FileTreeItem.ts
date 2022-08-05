import { computed, ref, reactive, watch, toRef} from 'vue';
import { VectorLayer } from '/map/VectorLayer';
import { getState } from '/store/state';
import { getMap } from '/map/maps';
import { VIcon, VList, VMenu, VListItem } from 'vuetify/components';

const filetreeitem = {
    components: { VIcon, VMenu, VList, VListItem },
    props: [ 'path', 'name', 'type', 'open' ],
    emits: [ 'click', 'refresh', 'close' ],
    setup(props, ctx) {
        const state = getState();
        const map = getMap();

        const showmenu = ref(false);
        const menuitems = reactive([]);

        function refresh() {
            showmenu.value = false;
            ctx.emit('refresh');
        }
        function close() {
            showmenu.value = false;
            ctx.emit('close');
        }

        function callMenu(e, func, keepopen=false)
        {
            func();
            if (keepopen) { onRightClick(e); }
        }

        let icon_open = "mdi-file-document";
        let icon_close = "mdi-file-document";
        if (props.type === 'dir') {
            icon_open = "mdi-folder-open";
            icon_close = "mdi-folder";
            menuitems.push({ title: 'Refresh' , func: refresh});
            menuitems.push({ title: 'Create New' , func: () => {console.log('test1')}});
            menuitems.push({ title: 'Close' , func: close});
        }
        if (['src'].includes(props.type) ) {
            icon_open = "mdi-file-code-outline";
            icon_close = "mdi-file-code-outline";
        }
        if (['img'].includes(props.type)) {
            icon_open = "mdi-file-image-outline";
            icon_close = "mdi-file-image-outline";
        }
        if (['vector'].includes(props.type) ) {
            menuitems.push({ title: 'Add to Map' , func: () => {console.log('test2')}});
            icon_open = "mdi-vector-polyline";
            icon_close = "mdi-vector-polyline";
        }
        if (['raster'].includes(props.type) ) {
            menuitems.push({ title: 'Add to Map' , func: () => {console.log('test2')}});
            icon_open = "mdi-checkerboard";
            icon_close = "mdi-checkerboard";
        }

        function onClick() {
            ctx.emit('click');
        }

        function onRightClick(e) {
            showmenu.value = true;
            const click = () => {
                showmenu.value = false;
                document.removeEventListener('click', click, true);
            }
            document.addEventListener('click', click, true);

            const contextmenu = () => {
                showmenu.value = false;
                document.removeEventListener('contextmenu', contextmenu, true);
            }
            document.addEventListener('contextmenu', contextmenu, true);
        }

        return { onClick, onRightClick, callMenu, menuitems, showmenu, icon_close, icon_open, console}
    },
    template: `
    <div class="filetreeitem" @contextmenu.prevent="onRightClick">
        <div class="item" @click="onClick">
            <div class="icon"><v-icon size=18 color="rgb(119, 118, 118)">{{ open ? icon_open : icon_close }}</v-icon></div>
            <div class="text"><p>  {{ name }}</p></div>
        </div>
        <div class="menu" v-if="showmenu">
            <div class="menuitem" v-for="item in menuitems" @click="callMenu($event,item.func)">{{ item.title }}</div>
        </div>
    </div>
    `
} 

export { filetreeitem }