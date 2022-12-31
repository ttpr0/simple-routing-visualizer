import { computed, ref, reactive, onMounted, watch, onUnmounted} from 'vue';
import { getAppState, getMapState, getToolbarState } from '/state';
import { CONFIG } from "/config";
import { dragablewindow } from '/share_components/dragable_window/DragableWindow';

const dragwindow = {
    components: { dragablewindow },
    props: [],
    setup() {
        const state = getAppState();
        const map = getMapState();
        const toolbar = getToolbarState();

        const toolinfo = computed(() => {
            return toolbar.toolinfo;
        });

        return { toolinfo }
    },
    template: `
    <dragablewindow v-if="toolinfo.show" :pos="toolinfo.pos" name="Tool-Info" icon="mdi-information-outline" @onclose="toolinfo.show=false">
      <div class="tooltext"><span v-html="toolinfo.text"></span></div>
    </dragablewindow>
    `
} 

export { dragwindow }