import { ref, reactive, computed, watch, onMounted } from 'vue';
import { getAppState, getMapState } from '/state';
import { getMap } from '/map';
import { topbarbutton } from '/share_components/topbar/TopBarButton';
import { getConnectionManager } from '/components/sidebar/filebar/ConnectionManager';
import { getKeyFromPath } from '/util';

const refresh_connection = {
  components: { topbarbutton },
  props: [],
  emits: [],
  setup(props) {
    const state = getAppState();
    const connmanager = getConnectionManager();

    function refreshConnection() {
      const key = getKeyFromPath(state.contextmenu.context.path);
      connmanager.refreshConnection(key);
      state.contextmenu.display = false;
    }

    return { refreshConnection }
  },
  template: `
    <topbarbutton @click="refreshConnection()">Refresh</topbarbutton>
    `
}

export { refresh_connection }