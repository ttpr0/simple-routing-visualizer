import { computed, ref, reactive, watch, toRef} from 'vue';
import { VectorLayer } from '/map/VectorLayer.js';
import { getState } from '/store/state.js';
import { getMap } from '/map/maps.js';
import { VAutocomplete, VList, VProgressLinear } from 'vuetify/components';

const param = [
  {name: "range", title: "Reichweite", info: "Reichweite", type: "range", values: [10,100, 10], text:"check?"},
  {name: "test", title: "Test", info: "das ist ein Testfeld", type: "list", values: [1,100], text:"check?"},
]

function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

const run = async (obj, addMessage) => {
    addMessage("started");
    await sleep(5000);
    addMessage(obj.select);
}

export { run, param }