import { ref, reactive, computed, watch, onMounted } from 'vue';
import { getAppState, getMapState } from '/state';
import { getMap } from '/map';
import { topbarbutton } from '/share_components/topbar/TopBarButton';

const create_new = {
  components: { topbarbutton },
  props: [],
  emits: [],
  setup(props) {
    const state = getAppState();
    const map = getMap();
    const map_state = getMapState();

    function createNew() {
      console.log(state.contextmenu.context.path);
      state.contextmenu.display = false;
    }

    return { createNew }
  },
  template: `
    <topbarbutton @click="createNew()">Create New</topbarbutton>
    `
}

export { create_new }