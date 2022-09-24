import { createApp, ref, reactive, onMounted} from 'vue'
import { VectorLayer } from '/map/VectorLayer';
import { getAppState, getMapState } from '/state';
import { mapregion } from '/app/mapregion/MapRegion';
import { footerbar } from '/app/footerbar/FooterBar';
import { topbar } from '/app/topbar/TopBar';
import { sidebar } from '/app/sidebar/SideBar';
import 'vuetify/styles'
import { dragablewindow } from '/app/util/DragableWindow';
import { GeoJSON } from "ol/format"

const app = createApp({
  components: { sidebar, toolbar, mapregion, topbar, footerbar, dragablewindow },
  setup() {
    const map = getMapState();
    const state = getAppState();

    fetch(window.location.origin + '/datalayers/hospitals.geojson')
      .then(response => response.json())
      .then(response => {
        var points = new GeoJSON().readFeatures(response);
        var layer = new VectorLayer(points, 'Point', 'hospitals');
        map.addLayer(layer);
        map.focuslayer = layer.name;
    });

    return { state }
  },

  template: `
  <div class="appcontainer">
    <topbar></topbar>
    <div class="middlecontainer">
      <sidebar></sidebar>
      <mapregion></mapregion>
    </div>
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