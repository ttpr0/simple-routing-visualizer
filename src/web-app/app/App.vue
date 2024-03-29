<script lang="ts">
import { createApp, ref, reactive, onMounted, computed } from "vue";
import { PointLayer } from "/map/layers/PointLayer";
import { getAppState, getMapState, getToolbarState } from "/state";
import { getToolManager } from "/components/sidebar/toolbar/ToolManager";
import { getConnectionManager } from "/components/sidebar/filebar/ConnectionManager";
import { getMap } from "/map";
import MapRegion from "/app/mapregion/MapRegion.vue";
import MainBar from "/app/mainbar/MainBar.vue";
import FooterBar from "/app/footerbar/FooterBar.vue";
import SideBar from "./sidebar/SideBar.vue";
import TopBar from "/app/topbar/TopBar.vue";
import InfoBar from "/app/infobar/InfoBar.vue";
import "vuetify/styles";
import Window from "/app/window/Window.vue";
import ContextMenu from "/app/contextmenu/ContextMenu.vue";
import { toolbox as orstoolbox } from "/tools/orstools/ORSToolBox";
import { toolbox as testtoolbox } from "/tools/testtools/TestToolBox";
import { toolbox as routingtoolbox } from "/tools/routingtools/RoutingToolBox";
import { toolbox as utilitytoolbox } from "/tools/utilitytools/UtilityToolBox";
import { DummyConnection } from "/components/sidebar/filebar/DummyConnection";
import { NConfigProvider, darkTheme } from "naive-ui";

export default {
  components: {
    NConfigProvider,
    SideBar,
    MapRegion,
    FooterBar,
    Window,
    ContextMenu,
    TopBar,
    MainBar,
    InfoBar,
  },
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
    toolmanager.loadTools(utilitytoolbox.tools, utilitytoolbox.name);

    connmanager.addConnection(new DummyConnection());

    fetch(window.location.origin + "/data/datalayers/hospitals.geojson")
      .then((response) => response.json())
      .then((response) => {
        let layer = new PointLayer(response.features, "hospitals");
        map.addLayer(layer);
        map_state.focuslayer = layer.name;
      });

    return { darkTheme };
  },
};
</script>

<template>
  <div class="appcontainer">
    <n-config-provider>
      <TopBar></TopBar>
      <div class="middlecontainer">
        <SideBar></SideBar>
        <MainBar></MainBar>
        <InfoBar></InfoBar>
      </div>
      <FooterBar></FooterBar>
      <Window></Window>
      <ContextMenu></ContextMenu>
    </n-config-provider>
  </div>
</template>

<style scoped>
.appcontainer {
  position: fixed;
  height: 100%;
  width: 100%;
  color: var(--text-color);
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
}
</style>