import { createApp, ref, reactive, onMounted} from 'vue'
import { Map2D } from '/map/Map2D.js';
import { VectorLayer } from './map/VectorLayer.js';
import { getState } from './store/state.js';
import { mapregion } from './components/mapregion/MapRegion.js';
import { footerbar } from './components/footerbar/FooterBar.js';
import { topbar } from './components/topbar/TopBar.js';
import { sidebar } from './components/sidebar/SideBar.js';
import { getMap } from './map/maps.js';
import 'vuetify/styles'
import { VSystemBar, VSpacer, VIcon, VApp, VFooter } from 'vuetify/components';
import { Splitpanes, Pane } from 'splitpanes';
import 'splitpanes/dist/splitpanes.css'

const app = createApp({
  components: { sidebar, toolbar, mapregion, topbar, VSystemBar, VSpacer, VIcon, VApp, VFooter, Splitpanes, Pane, footerbar },
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
        var points = new ol.format.GeoJSON().readFeatures(response);
        var layer = new VectorLayer(points, 'Point', 'hospitals');
        map.addLayer(layer);
        setFocusLayer(layer.name);
        updateLayerTree();
    });

    return {  }
  },

  template: `
  <div class="appcontainer">
    <topbar></topbar>
    <sidebar></sidebar>
    <mapregion></mapregion>
    <footerbar></footerbar>
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