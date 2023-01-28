<script lang="ts">
import { createApp, ref, reactive, onMounted, computed } from 'vue'
import { VectorLayer } from '/map/VectorLayer';
import { getAppState, getMapState, getToolbarState } from '/state';
import { getToolManager } from '/components/sidebar/toolbar/ToolManager';
import { getConnectionManager } from '/components/sidebar/filebar/ConnectionManager';
import { getMap } from '/map';
import MapRegion from '/app/mapregion/MapRegion.vue';
import FooterBar from '/app/footerbar/FooterBar.vue';
import SideBar from './sidebar/SideBar.vue';
import 'vuetify/styles'
import Window from '/app/window/Window.vue';
import ContextMenu from '/app/contextmenu/ContextMenu.vue';
import { toolbox as orstoolbox } from "/tools/orstools/ORSToolBox";
import { toolbox as testtoolbox } from "/tools/testtools/TestToolBox";
import { toolbox as routingtoolbox } from "/tools/routingtools/RoutingToolBox";
import { DummyConnection } from '/components/sidebar/filebar/DummyConnection';
import TopBar from '/app/topbar/Topbar.vue';

export default {
    components: { SideBar, toolbar, MapRegion, FooterBar, Window, ContextMenu, TopBar },
    setup() {
        const map = getMap();
        const map_state = getMapState();
        const state = getAppState();
        const toolbar = getToolbarState();
        const toolmanager = getToolManager();
        const connmanager = getConnectionManager();

        toolmanager.loadTools(testtoolbox.tools, testtoolbox.name);
        toolmanager.loadTools(orstoolbox.tools, orstoolbox.name);
        toolmanager.loadTools(routingtoolbox.tools, routingtoolbox.name);

        connmanager.addConnection(new DummyConnection());

        fetch(window.location.origin + '/datalayers/hospitals.geojson')
            .then(response => response.json())
            .then(response => {
                //var points = new GeoJSON().readFeatures(response);
                var layer = new VectorLayer(response.features, 'Point', 'hospitals');
                map.addLayer(layer);
                map_state.focuslayer = layer.name;
            });

        return {}
    }
}
</script>

<template>
    <div class="appcontainer">
        <TopBar></TopBar>
        <div class="middlecontainer">
            <SideBar></SideBar>
            <MapRegion></MapRegion>
        </div>
        <FooterBar></FooterBar>
        <Window></Window>
        <ContextMenu></ContextMenu>
    </div>
</template>

<style scoped>
.appcontainer {
    position: fixed;
    height: 100%;
    width: 100%;
    color: rgb(165, 165, 165);
    font-size: 15;
    font-style: normal;
    font-family: sans-serif;
    font-stretch: normal;
    line-height: 1.5;
}

.middlecontainer {
    height: calc(100vh - 57px);
    width: 100%;
    position: relative;
    z-index: 1;
    display: flex;
}
</style>