import { computed, ref, reactive, watch, toRef} from 'vue';
import { VectorLayer } from '/map/VectorLayer';
import { getAppState } from '/state';
import { VIcon } from 'vuetify/components';

const filetreeitem = {
    components: { VIcon },
    props: [ 'path', 'name', 'type', 'open' ],
    emits: [ 'click', 'contextmenu' ],
    setup(props, ctx) {
        const state = getAppState();

        let icon_open = "mdi-file-document";
        let icon_close = "mdi-file-document";
        if (props.type === 'dir') {
            icon_open = "mdi-folder-open";
            icon_close = "mdi-folder";
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
            icon_open = "mdi-vector-polyline";
            icon_close = "mdi-vector-polyline";
        }
        if (['raster'].includes(props.type) ) {
            icon_open = "mdi-checkerboard";
            icon_close = "mdi-checkerboard";
        }

        function onClick() {
            ctx.emit('click');
        }

        function onContextmenu(e) {
            ctx.emit('contextmenu', e);
        }

        return { onClick, onContextmenu, icon_close, icon_open}
    },
    template: `
    <div class="filetreeitem" @contextmenu.prevent="onContextmenu">
        <div class="item" @click="onClick">
            <div class="icon"><v-icon size=18 color="rgb(119, 118, 118)">{{ open ? icon_open : icon_close }}</v-icon></div>
            <div class="text"><p>  {{ name }}</p></div>
        </div>
    </div>
    `
} 

export { filetreeitem }