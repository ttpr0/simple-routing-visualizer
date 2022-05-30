import { computed, ref, reactive, watch, toRef} from 'vue';
import { VectorLayer } from '/map/VectorLayer.js';
import { getState } from '/store/state.js';
import { getMap } from '/map/maps.js';
import { VAutocomplete, VList, VProgressLinear } from 'vuetify/components';


const tool = {
    components: {  },
    props: [ 'obj' ],
    setup(props, ctx) {

        return { }
    },
    template: `
    <input type="range" id="smoothing" v-model="obj.select" min="1" max="100">
    <label for="smoothing">{{ 10 }}</label><br>
    `,
} 

function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

const run = async (obj) => {
    await sleep(2000);
    alert(obj.select);
}

export { tool, run }