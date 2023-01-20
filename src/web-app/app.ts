import { createApp, ref, reactive, onMounted, computed} from 'vue'
import { VectorLayer } from '/map/VectorLayer';
import { getAppState, getMapState, getToolbarState } from '/state';
import { getToolManager } from '/components/sidebar/toolbar/ToolManager';
import { getConnectionManager } from '/components/sidebar/filebar/ConnectionManager';
import { getMap } from '/map';
import { mapregion } from '/app/mapregion/MapRegion';
import { footerbar } from '/app/footerbar/FooterBar';
import { topbar } from '/app/topbar/TopBar';
import { sidebar } from '/app/sidebar/SideBar';
import 'vuetify/styles'
import { dragwindow } from '/app/window/Window';
import { contextmenu } from '/app/contextmenu/ContextMenu';
import { toolbox as orstoolbox } from "/tools/orstools/ORSToolBox";
import { toolbox as testtoolbox } from "/tools/testtools/TestToolBox";
import { toolbox as routingtoolbox } from "/tools/routingtools/RoutingToolBox";
import { DummyConnection } from '/components/sidebar/filebar/DummyConnection';


const app = createApp({
  components: { sidebar, toolbar, mapregion, topbar, footerbar, dragwindow, contextmenu },
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

    return { }
  },

  template: `
  <div class="appcontainer">
    <topbar></topbar>
    <div class="middlecontainer">
      <sidebar></sidebar>
      <mapregion></mapregion>
    </div>
    <footerbar></footerbar>
    <dragwindow></dragwindow>
    <contextmenu></contextmenu>
  </div>
  `
})

import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  components,
  directives,
})

app.use(vuetify)
  
app.mount('#app');

export { }