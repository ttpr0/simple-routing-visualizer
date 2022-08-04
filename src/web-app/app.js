import { createApp, ref, reactive, onMounted} from 'vue'
import { VectorLayer } from './map/VectorLayer.js';
import { getState } from './store/state.js';
import { mapregion } from './components/mapregion/MapRegion.js';
import { footerbar } from './components/footerbar/FooterBar.js';
import { topbar } from './components/topbar/TopBar.js';
import { sidebar } from './components/sidebar/SideBar.js';
import { getMap } from './map/maps.js';
import 'vuetify/styles'
import { VSystemBar, VSpacer, VIcon, VApp, VFooter } from 'vuetify/components';
import { dragablewindow } from '/components/util/DragableWindow.js';
import { GeoJSON } from "ol/format"

const app = createApp({
  components: { sidebar, toolbar, mapregion, topbar, footerbar, dragablewindow },
  setup() {
    const map = getMap();
    const state = getState();

    function updateLayerTree() {
      state.layertree.update = !state.layertree.update;
    }
    function setFocusLayer(layer)
    {
      state.layertree.focuslayer = layer;
    }

    fetch(window.location.origin + '/datalayers/hospitals.geojson')
      .then(response => response.json())
      .then(response => {
        var points = new GeoJSON().readFeatures(response);
        var layer = new VectorLayer(points, 'Point', 'hospitals');
        map.addLayer(layer);
        setFocusLayer(layer.name);
        updateLayerTree();
    });

    return { state }
  },

  template: `
  <div class="appcontainer">
    <topbar></topbar>
    <sidebar></sidebar>
    <mapregion></mapregion>
    <footerbar></footerbar>
    <dragablewindow v-if="state.tools.toolinfo.show" :pos="state.tools.toolinfo.pos" name="Tool-Info" icon="mdi-information-outline" @onclose="state.tools.toolinfo.show=false">
      <div class="tooltext"><span v-html="state.tools.toolinfo.text"></span></div>
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