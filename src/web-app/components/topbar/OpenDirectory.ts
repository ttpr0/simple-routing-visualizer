import { ref, reactive, computed, watch, onMounted } from 'vue'
import { getAppState, getMapState, getToolbarState } from '/state';
import { topbarbutton } from '/share_components/topbar/TopBarButton';
import { getConnectionManager } from '/components/sidebar/filebar/ConnectionManager';
import { FileAPIConnection } from '/components/sidebar/filebar/FileAPIConnection';

const open_directory = {
    components: { topbarbutton },
    props: [],
    emits: [],
    setup(props) {
      const state = getAppState();
      const map = getMapState();
      const toolbar = getToolbarState();
      const connmanager = getConnectionManager();

      async function openFolder() {
        let conn = new FileAPIConnection();
        await connmanager.addConnection(conn);
      }

      return { openFolder }
    },
    template: `
    <topbarbutton @click="openFolder">Open Directory</topbarbutton>
    `
} 

export { open_directory }