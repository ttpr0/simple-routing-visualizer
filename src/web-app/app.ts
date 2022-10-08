import { createApp, ref, reactive, onMounted, computed} from 'vue'
import { VectorLayer } from '/map/VectorLayer';
import { getAppState, getMapState, getToolbarState } from '/state';
import { mapregion } from '/app/mapregion/MapRegion';
import { footerbar } from '/app/footerbar/FooterBar';
import { topbar } from '/app/topbar/TopBar';
import { sidebar } from '/app/sidebar/SideBar';
import 'vuetify/styles'
import { dragablewindow } from '/app/util/DragableWindow';
import { GeoJSON } from "ol/format"
import { toolbox as orstoolbox } from "/tools/orstools/ORSToolBox";
import { toolbox as testtoolbox } from "/tools/testtools/TestToolBox";


const app = createApp({
  components: { sidebar, toolbar, mapregion, topbar, footerbar, dragablewindow },
  setup() {
    const map = getMapState();
    const state = getAppState();
    const toolbar = getToolbarState();

    const toolinfo = computed(() => {
      return toolbar.toolinfo;
    })

    toolbar.loadTools(testtoolbox.tools, testtoolbox.name);
    toolbar.loadTools(orstoolbox.tools, orstoolbox.name);

    fetch(window.location.origin + '/datalayers/hospitals.geojson')
      .then(response => response.json())
      .then(response => {
        //var points = new GeoJSON().readFeatures(response);
        var layer = new VectorLayer(response.features, 'Point', 'hospitals');
        map.addLayer(layer);
        map.focuslayer = layer.name;
    });

    return { toolinfo }
  },

  template: `
  <div class="appcontainer">
    <topbar></topbar>
    <div class="middlecontainer">
      <sidebar></sidebar>
      <mapregion></mapregion>
    </div>
    <footerbar></footerbar>
    <dragablewindow v-if="toolinfo.show" :pos="toolinfo.pos" name="Tool-Info" icon="mdi-information-outline" @onclose="toolinfo.show=false">
      <div class="tooltext"><span v-html="toolinfo.text"></span></div>
    </dragablewindow>
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