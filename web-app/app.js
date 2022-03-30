import { createApp, ref, reactive, onMounted} from 'vue'
import { Map2D } from '/map/Map2D.js';
import { VectorLayer } from './map/VectorLayer.js';
import { store } from './store/store.js';
import { mapregion } from './components/MapRegion.js';
import { sidebar } from '/components/SideBar.js';
import { toolbar } from './components/ToolBar.js';
import { getMap } from './map/maps.js';

const app = createApp({
  components: { sidebar, toolbar, mapregion },
  setup() {
    const map = getMap();

    function updateLayerTree() {
      store.commit('updateLayerTree');
    }

    fetch(window.location.origin + '/datalayers/hospitals.geojson')
      .then(response => response.json())
      .then(response => {
        var points = new ol.format.GeoJSON().readFeatures(response);
        var layer = new VectorLayer(points, 'Point', 'hospitals');
        map.addVectorLayer(layer);
        store.commit('setFocusLayer', layer.name);
        updateLayerTree();
    });

    return {  }
  },

  template: `
  <div class="appcontainer">
    <toolbar></toolbar>
    <sidebar></sidebar>
    <mapregion></mapregion>
  </div>
  `
})

app.use(store);
  
app.mount('#app');

export { getMap }