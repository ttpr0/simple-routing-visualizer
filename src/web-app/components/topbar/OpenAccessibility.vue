<script lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { VectorLayer } from '/map/VectorLayer'
import { getAppState, getMapState } from '/state';
import { getMap } from '/map';
import { CONFIG } from "/config"
import { topbarbutton } from '/share_components/topbar/TopBarButton';

export default {
    components: { topbarbutton },
    props: [],
    emits: [],
    setup(props) {
        const state = getAppState();
        const map = getMap();

        function openAccessibilityBar() {
            const side_conf = CONFIG["app"]["sidebar"];
            let active = false;
            for (let item of side_conf) {
                if (item.comp === "AccessibilityBar") {
                    active = true
                }
            }
            if (active === false) {
                side_conf.push({
                    comp: "AccessibilityBar",
                    icon: "mdi-human"
                })
            }
            state.sidebar.active = "AccessibilityBar";
            state.topbar.active = null;
        }

        return { openAccessibilityBar }
    }
}
</script>

<template>
    <topbarbutton @click="openAccessibilityBar()">Accessibility-Bar öffnen</topbarbutton>
</template>

<style scoped>

</style>