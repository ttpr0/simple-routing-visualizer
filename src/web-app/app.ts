import { createApp, ref, reactive, onMounted, computed} from 'vue'
import 'vuetify/styles'
import App from '/app/App.vue';

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