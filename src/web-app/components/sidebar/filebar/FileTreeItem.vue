<script lang="ts">
import { computed, ref, reactive, watch, toRef} from 'vue';
import { VectorLayer } from '/map/VectorLayer';
import { getAppState } from '/state';
import { VIcon } from 'vuetify/components';

export default {
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
        if (['gpkg'].includes(props.type) ) {
            icon_open = "mdi-package-variant";
            icon_close = "mdi-package-variant-closed";
        }

        const item = ref(null);

        function onClick() {
            item.value.classList.add("clicked");
            setTimeout(() => {
                item.value.classList.value = ["filetreeitem"];
            }, 300);            
            ctx.emit('click');
        }

        function onContextmenu(e) {
            ctx.emit('contextmenu', e);
        }

        return { onClick, onContextmenu, icon_close, icon_open, item }
    }
}
</script>

<template>
    <div class="filetreeitem" ref="item" @click="onClick" @contextmenu.prevent="onContextmenu">
            <div class="icon"><v-icon size=18 color="var(--button-color)">{{ open ? icon_open : icon_close }}</v-icon></div>
            <div class="text"><p>  {{ name }}</p></div>
    </div>
</template>

<style scoped>
.filetreeitem {
    margin: 0px 0px 5px 0px;
    padding: 0px 5px 0px 5px;
    height: 27px;
    width: max-content;
    border-radius: 2px;
    border-width: 1px;
    border-style: dashed;
    border-color: transparent;
    color: var(--button-color);
    user-select: none;
    cursor: pointer;

    transition: color 0.2s;
    transition: border 0.4s;
}

.filetreeitem:hover {
    color: var(--theme-color);
    border-color: var(--theme-light-color);
    transition: color 0.2s;
    transition: border 0.6s;
}

.filetreeitem.clicked {
    color: var(--theme-color);
    border-color: var(--theme-light-color);
    transition: color 0.2s;
    transition: border 0.6s;    
    box-shadow: 0px 0px 4px var(--theme-light-color);
    transition: box-shadow 0.3s;
}

.filetreeitem .icon {
    width: 20px;
    display: inline-block;
}

.filetreeitem .text {
    width: fit-content;
    display: inline-block;
}
</style>