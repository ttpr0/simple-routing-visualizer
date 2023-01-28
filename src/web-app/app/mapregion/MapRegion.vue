<script lang="ts">
import { computed, ref, reactive, onMounted, watch} from 'vue';
import { getAppState } from '/state';
import { getMap } from '/map';
import "ol/ol.css"
import Popup from './Popup.vue';

export default {
    components: { Popup },
    props: [],
    setup() {
        const state = getAppState();
        const map = getMap();

        onMounted(() => {
            map.setTarget("mapregion")
            mapregion.value.addEventListener("contextmenu", (e) => {
                state.contextmenu.pos = [e.pageX, e.pageY]
                state.contextmenu.display = true
                state.contextmenu.context.map_pos = map.getEventCoordinate(e);
                state.contextmenu.type = "map"
                e.preventDefault()
            })
        })

        const mapregion = ref(null);

        return { mapregion }
    }
}
</script>

<template>
    <div id="mapregion" class="mapregion" ref="mapregion"></div>
    <Popup></Popup>
</template>

<style scoped>
.mapregion {
    position: relative;
    flex: 1;
    height: 100%;
    width: 100%;
    z-index:0;
}
</style>