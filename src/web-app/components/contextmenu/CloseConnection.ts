import { ref, reactive, computed, watch, onMounted } from 'vue';
import { getAppState, getMapState } from '/state';
import { getMap } from '/map';
import { topbarbutton } from '/share_components/topbar/TopBarButton';
import { getConnectionManager } from '/components/sidebar/filebar/ConnectionManager';
import { getKeyFromPath } from '/util';

const close_connection = {
  components: { topbarbutton },
  props: [],
  emits: [],
  setup(props) {
    const state = getAppState();
    const connmanager = getConnectionManager();

    function closeConnection() {
      const key = getKeyFromPath(state.contextmenu.context.path);
      connmanager.closeConnection(key);
      state.contextmenu.display = false;
    }

    return { closeConnection }
  },
  template: `
    <topbarbutton @click="closeConnection()">Close</topbarbutton>
    `
}

export { close_connection }