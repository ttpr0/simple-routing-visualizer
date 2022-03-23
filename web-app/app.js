import { createApp, ref, reactive, onMounted} from '/lib/vue.js'
import { mapregion } from '/components/MapRegion.js';
import { Map2D } from '/map/Map2D.js';
import { sidebar } from '/components/SideBar.js';
import { VectorLayer } from './map/VectorLayer.js';
import { pointstyle, highlightpointstyle } from "/map/styles.js";
import { store } from './store/store.js';

const app = createApp({
  components: { mapregion, sidebar },
  setup() {
    const map = getMap();

    fetch(window.location.origin + '/datalayers/hospitals.geojson')
      .then(response => response.json())
      .then(response => {
        var points = new ol.format.GeoJSON().readFeatures(response);
        var layer = new VectorLayer(points, 'Point', 'hospitals');
        map.addVectorLayer(layer);
        store.commit('setFocusLayer', layer.name);
    });

    return {  }
  },

  template: `
  <sidebar></sidebar>
  <mapregion style="height: 100%; width: 80%; float: right;"></mapregion>
  `
})

const map = new Map2D();

function getMap()
{
  return map;
}

app.use(store);
  
app.mount('#app');

export { getMap }