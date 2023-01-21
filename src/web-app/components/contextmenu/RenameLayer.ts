import { ref, reactive, computed, watch, onMounted } from 'vue';
import { getAppState, getMapState } from '/state';
import { getMap } from '/map';
import { topbarbutton } from '/share_components/topbar/TopBarButton';

const rename_layer = {
    components: { topbarbutton },
    props: [],
    emits: [],
    setup(props) {
        const state = getAppState();
        const map = getMap();
        const map_state = getMapState();

        function renameLayer() {
            const newname = prompt("Please enter a Layer-Name", "");
            map.renameLayer(state.contextmenu.context.layer, newname);
            state.contextmenu.display = false;
            if (map_state.focuslayer === state.contextmenu.context.layer) {
                map_state.focuslayer = undefined;
            }
        }

        return { renameLayer }
    },
    template: `
    <topbarbutton @click="renameLayer()">Rename</topbarbutton>
    `
}

export { rename_layer }