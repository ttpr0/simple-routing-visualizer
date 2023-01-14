import { ref, reactive, computed, watch, onMounted } from 'vue';
import { getAppState, getMapState } from '/state';
import { getMap } from '/map';
import { topbarbutton } from '/share_components/topbar/TopBarButton';

const remove_layer = {
  components: { topbarbutton },
  props: [],
  emits: [],
  setup(props) {
    const state = getAppState();
    const map = getMap();
    const map_state = getMapState();

    function removeLayer() {
      map.removeLayer(state.contextmenu.context.layer);
      state.contextmenu.display = false;
      if (map_state.focuslayer === state.contextmenu.context.layer) {
        map_state.focuslayer = undefined;
      }
    }

    return { removeLayer }
  },
  template: `
    <topbarbutton @click="removeLayer()">Remove</topbarbutton>
    `
}

export { remove_layer }