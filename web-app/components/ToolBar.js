import { computed, ref, reactive, onMounted, defineExpose} from 'vue';
import { selecttoolbar } from '/components/SelectToolBar.js';
import { getMap } from '/map/maps.js';
import { analysistoolbar } from './AnalysisToolBar.js';
import { layertoolbar } from './LayerToolBar.js';

const toolbar = {
    components: {  selecttoolbar, analysistoolbar, layertoolbar },
    props: [ ],
    setup(props) {
        const show_analysis = ref(true);
        const show_layer = ref(false);
        const show_select = ref(false);

        function showAnalysisTools() {
            show_analysis.value = true;
            show_layer.value = false;
            show_select.value = false;
        }
        function showLayerTools() {
            show_analysis.value = false;
            show_layer.value = true;
            show_select.value = false;
        }
        function showSelectTools() {
            show_analysis.value = false;
            show_layer.value = false;
            show_select.value = true;
        }

        return {show_analysis, show_layer, show_select, showAnalysisTools, showSelectTools, showLayerTools}
    },
    template: `
    <div class="toolbar">
        <div class="toolbar-tabs">
            <button :class="{active: show_analysis}" @click="showAnalysisTools()">Analysis-Tools</button>
            <button :class="{active: show_select}" @click="showSelectTools()">Select-Tools</button>
            <button :class="{active: show_layer}" @click="showLayerTools()">Layer-Tools</button>
        </div>
        <div class="toolbar-items">
            <layertoolbar v-show="show_layer"></layertoolbar>
            <selecttoolbar v-show="show_select"></selecttoolbar>
            <analysistoolbar v-show="show_analysis"></analysistoolbar>
        </div>
    </div>
    `
} 

export { toolbar }