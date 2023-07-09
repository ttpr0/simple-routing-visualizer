import { createApp, ref, reactive, onMounted, computed} from 'vue'
import proj4 from 'proj4';
import {register} from 'ol/proj/proj4.js';
import App from '/app/App.vue';

proj4.defs('EPSG:25832', '+proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs');
register(proj4);

const app = createApp(App);
  
app.mount('#app');

export { }