import { computed, ref, reactive, onMounted, defineExpose} from 'vue';
import { selecttoolbar } from '/components/SelectToolBar.js';
import { getMap } from '/map/maps.js';
import { analysistoolbar } from './AnalysisToolBar.js';
import { layertoolbar } from './LayerToolBar.js';
import { testtoolbar } from './TestToolBar.js';

const toolbar = {
    components: {  selecttoolbar, analysistoolbar, layertoolbar, testtoolbar },
    props: [ ],
    setup(props) {
        const show_analysis = ref(false);
        const show_layer = ref(false);
        const show_select = ref(true);
        const show_tests = ref(false);

        function showAnalysisTools() {
            show_analysis.value = true;
            show_layer.value = false;
            show_select.value = false;
            show_tests.value = false;
        }
        function showLayerTools() {
            show_analysis.value = false;
            show_layer.value = true;
            show_select.value = false;
            show_tests.value = false;
        }
        function showSelectTools() {
            show_analysis.value = false;
            show_layer.value = false;
            show_select.value = true;
            show_tests.value = false;
        }
        function showTestTools() {
            show_analysis.value = false;
            show_layer.value = false;
            show_select.value = false;
            show_tests.value = true;
        }

        return {show_analysis, show_layer, show_select, show_tests, showAnalysisTools, showSelectTools, showLayerTools, showTestTools}
    },
    template: `
    <div class="toolbar">
        <div class="toolbar-tabs">
            <button :class="{active: show_analysis}" @click="showAnalysisTools()">Analysis-Tools</button>
            <button :class="{active: show_select}" @click="showSelectTools()">Select-Tools</button>
            <button :class="{active: show_layer}" @click="showLayerTools()">Layer-Tools</button>
            <button :class="{active: show_tests}" @click="showTestTools()">Tests</button>
        </div>
        <div class="toolbar-items">
            <layertoolbar v-show="show_layer"></layertoolbar>
            <selecttoolbar v-show="show_select"></selecttoolbar>
            <analysistoolbar v-show="show_analysis"></analysistoolbar>
            <testtoolbar v-show="show_tests"></testtoolbar>
        </div>
    </div>
    `
} 

export { toolbar }