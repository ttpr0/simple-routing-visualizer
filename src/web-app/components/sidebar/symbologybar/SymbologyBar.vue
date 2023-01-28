<script lang="ts">
import { computed, ref, reactive, watch, toRef, onMounted} from 'vue';
import { getAppState, getMapState } from '/state';
import { getMap } from '/map';
import { NSpace, NColorPicker } from 'naive-ui';
import pointsymbologybar from './PointSymbologyBar.vue';
import linesymbologybar from './LineSymbologyBar.vue';
import polygonsymbologybar from './PolygonSymbologyBar.vue';

export default {
    components: { pointsymbologybar, linesymbologybar, polygonsymbologybar },
    props: [ ],
    setup(props) {
        const state = getAppState();
        const map = getMap();
        const map_state = getMapState();

        const layer_type = computed(() => {
            const focuslayer = map_state.focuslayer;
            const layer = map.getLayerByName(focuslayer);
            if (layer === undefined) {
                return null;
            }
            return layer.getType();
        });

        return { layer_type }
    }
}
</script>

<template>
    <div class="symbologybar">
        <pointsymbologybar v-if="layer_type === 'Point'"></pointsymbologybar>
        <linesymbologybar v-if="layer_type === 'LineString'"></linesymbologybar>
        <polygonsymbologybar v-if="layer_type === 'Polygon'"></polygonsymbologybar>
    </div>
</template>

<style scoped>
.symbologybar {
    height: 100%;
    width: 100%;
    background-color: transparent;
    padding: 10px;
    overflow-y: scroll;
    scrollbar-width: thin;
}
</style>