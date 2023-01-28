<script lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { getAppState, getMapState } from '/state';
import { getMap } from '/map';
import { topbarbutton } from '/share_components/topbar/TopBarButton';

export default {
    components: { topbarbutton },
    props: [],
    emits: [],
    setup(props) {
        const state = getAppState();
        const map = getMap();
        const map_state = getMapState();

        function delpointListener(e) {
            map.forEachFeatureAtPixel(e.pixel, function (layer, id) {
                if (layer.getName() === map_state.focuslayer) {
                    layer.removeFeature(id);
                }
            });
        }

        const active = ref(false)

        function activateDelPoint() {
            if (active.value) {
                map.un('click', delpointListener);
                active.value = false;
            }
            else {
                map.on('click', delpointListener);
                active.value = true;
            }
        }

        return { active, activateDelPoint }
    }
}
</script>

<template>
    <topbarbutton :active="active" @click="activateDelPoint()">Delete Point</topbarbutton>
</template>

<style scoped>

</style>