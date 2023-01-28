<script lang="ts">
import { computed, ref, reactive, onMounted, watch, onUnmounted } from 'vue';
import { getAppState, getMapState, getToolbarState } from '/state';
import { CONFIG, WINDOWCOMPS } from "/config";
import { dragablewindow } from '/share_components/dragable_window/DragableWindow';

export default {
    components: { dragablewindow },
    props: [],
    setup() {
        const state = getAppState();

        const window = computed(() => {
            return state.window;
        });

        const comp = computed(() => {
            const window_conf = CONFIG["app"]["window"]
            let type = state.window.type;
            if (type === null) {
                return null;
            }
            let comp = WINDOWCOMPS[window_conf[type]]
            return comp;
        })

        return { window, comp }
    }
}
</script>

<template>
    <dragablewindow v-if="window.show" :pos="window.pos" :name="window.name" :icon="window.icon" @onclose="window.show = false">
        <component :is="comp"></component>
    </dragablewindow>
</template>

<style scoped>

</style>