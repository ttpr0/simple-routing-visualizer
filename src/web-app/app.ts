import { createApp, ref, reactive, onMounted, computed} from 'vue'
import proj4 from 'proj4';
import {register} from 'ol/proj/proj4.js';
import 'vuetify/styles'
import App from '/app/App.vue';

proj4.defs('EPSG:25832', '+proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs');
register(proj4);

const app = createApp(App);

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