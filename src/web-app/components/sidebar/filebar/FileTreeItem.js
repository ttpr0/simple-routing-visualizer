import { computed, ref, reactive, watch, toRef} from 'vue';
import { VectorLayer } from '/map/VectorLayer.js';
import { getState } from '/store/state.js';
import { getMap } from '/map/maps.js';
import { VIcon, VList, VMenu, VListItem } from 'vuetify/components';

const filetreeitem = {
    components: { VIcon, VMenu, VList, VListItem },
    props: [ 'path', 'name', 'type', 'open' ],
    emits: [ 'click', 'refresh', 'close' ],
    setup(props, ctx) {
        const state = getState();
        const map = getMap();

        const menu = ref(false);
        const menuitems = reactive([]);

        function refresh() {
            menu.value = false;
            ctx.emit('refresh');
        }
        function close() {
            menu.value = false;
            ctx.emit('close');
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
            menu.value = false;
        }

        function onRightClick() {
            menu.value = true;
        }

        return { onClick, onRightClick, menuitems, menu, icon_close, icon_open }
    },
    template: `
    <div class="filetreeitem">
        <v-menu location="end" v-model="menu" :close-on-content-click="false">
            <template v-slot:activator="{ props }">
                <div v-bind="props" @click="onClick" @contextmenu.prevent="onRightClick()">
                    <div class="icon1"><v-icon size=16 color="gray" v-if="['dir', 'gpkg'].includes(type)">{{ open ? 'mdi-chevron-down' : 'mdi-chevron-right' }}</v-icon></div>
                    <div class="icon2"><v-icon size=18 color="gray">{{ open ? icon_open : icon_close }}</v-icon></div>
                    <div class="text"><p>{{ name }}</p></div>
                </div>
            </template>
    
            <v-list>
                <v-list-item v-for="(item, index) in menuitems" :key="index" @click="item.func">
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-menu>
    </div>
    `
} 

export { filetreeitem }