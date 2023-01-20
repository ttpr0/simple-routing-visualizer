import { ref, reactive, computed, watch, onMounted } from 'vue';
import { getAppState, getMapState } from '/state';
import { getMap } from '/map';
import { topbarbutton } from '/share_components/topbar/TopBarButton';

const add_to_map = {
  components: { topbarbutton },
  props: [],
  emits: [],
  setup(props) {
    const state = getAppState();
    const map = getMap();
    const map_state = getMapState();

    function addToMap() {
      state.contextmenu.display = false;
    }

    return { addToMap }
  },
  template: `
    <topbarbutton @click="addToMap()">Add to Map</topbarbutton>
    `
}

export { add_to_map }