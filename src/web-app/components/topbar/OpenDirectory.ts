import { ref, reactive, computed, watch, onMounted } from 'vue'
import { VectorLayer } from '/map/VectorLayer'
import { getAppState, getMapState, getToolbarState } from '/state';
import { topbaritem } from '/share_components/topbar/TopBarItem';
import { topbarbutton } from '/share_components/topbar/TopBarButton';
import { topbarseperator } from '/share_components/topbar/TopBarSeperator';
import { openDirectory } from '/util/fileapi'
import { GeoJSON } from "ol/format"

const open_directory = {
    components: { topbarbutton },
    props: [],
    emits: [],
    setup(props) {
      const state = getAppState();
      const map = getMapState();
      const toolbar = getToolbarState();

      const layerdialog = ref(null);
      const tooldialog = ref(null);

      async function openFolder() {
        var dir = await openDirectory();
        state.filetree.connections.push(dir);
      }

      return { openFolder }
    },
    template: `
    <topbarbutton @click="openFolder">Open Directory</topbarbutton>
    `
} 

export { open_directory }