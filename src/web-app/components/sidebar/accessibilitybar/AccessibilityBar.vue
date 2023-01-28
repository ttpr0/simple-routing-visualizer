<script lang="ts">
import { computed, ref, reactive, watch, toRef, onMounted } from 'vue';
import { VectorImageLayer } from '/map/VectorImageLayer';
import { getAppState, getMapState } from '/state';
import { getMap } from '/map';
import { CONFIG, POPUPCOMPS, SIDEBARCOMPS } from "/config"
import { NSpace, NTag, NSelect, NCheckbox, NButton } from 'naive-ui';
import { getRouting } from '/routing/api';
import { AccessibilityStyle } from './AccessibilityStyle';

export default {
    components: { NSpace, NTag, NSelect, NCheckbox, NButton },
    props: [],
    setup(props) {
        const state = getAppState();
        const map_state = getMapState();
        const map = getMap();

        function onClose() {
            CONFIG["app"]["sidebar"] = CONFIG["app"]["sidebar"].filter(elem => elem.comp !== "AccessibilityBar");
            state.sidebar.active = "";
        }

        async function onRun() {
            const layer = map.getLayerByName(map_state.focuslayer);
            let selectedfeatures = layer.getSelectedFeatures();
            if (selectedfeatures.length > 30) {
                alert("pls mark less than 30 features!");
                return;
            }
            if (selectedfeatures.length == 0) {
                alert("you have to mark at least one feature!");
                return
            }

            let ranges = [100, 200, 300, 400, 500];
            let factors = [1.0, 0.8, 0.5, 0.3, 0.2];
            let locations = [];
            for (let id of selectedfeatures) {
                locations.push(layer.getGeometry(id).coordinates)
            }

            var response = await fetch("http://localhost:8082/v1/test/fca", {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                },
                redirect: 'follow',
                referrerPolicy: 'no-referrer',
                body: JSON.stringify({
                    "facility_locations": locations,
                    "ranges": ranges,
                    "range_factors": factors
                })
            });

            let geojson = await response.json();

            let vec_layer = new VectorImageLayer(geojson.features, 'Point', "accessibility");
            vec_layer.setStyle(new AccessibilityStyle());

            map.addLayer(vec_layer);
        }

        return { onClose, onRun }
    }
}
</script>

<template>
    <div class="accessibilitybar">
        <n-space vertical>
            <n-space horizontal align="end">
                <p>run routing:</p>
                <n-button @click="">    Run1    </n-button>
            </n-space>
            <p>run routing:</p>
            <n-button @click="">    Run2    </n-button>
        </n-space>
        <br>
        <n-space horizontal align="end" justify="space-between">
            <n-button @click="onClose()">    Close    </n-button>
            <n-button @click="onRun()">    Run    </n-button>
        </n-space>
    </div>
</template>

<style scoped>
.accessibilitybar {
    height: 100%;
    width: 100%;
    background-color: transparent;
    padding: 10px;
    overflow-y: scroll;
    scrollbar-width: thin;
}
</style>