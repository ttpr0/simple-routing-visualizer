import { computed, ref, reactive, onMounted, defineExpose} from 'vue';
import { getMap } from '/map/maps.js';
import { analysistopbar } from './AnalysisTopBar.js';
import { testtopbar } from './TestTopBar.js';
import { selecttopbar } from './SelectTopBar.js'
import { layertopbar } from './LayerTopBar.js';
import './TopBar.css'

const topbar = {
    components: { selecttopbar, layertopbar, analysistopbar, testtopbar },
    props: [ ],
    setup(props) {
        const show_analysis = ref(false);
        const show_layer = ref(false);
        const show_select = ref(true);
        const show_tests = ref(false);

        function setAllFalse() {
            show_analysis.value = false;
            show_layer.value = false;
            show_select.value = false;
            show_tests.value = false;
        }

        return {show_analysis, show_layer, show_select, show_tests, setAllFalse}
    },
    template: `
    <div class="topbar">
        <div class="topbar-tabs">
            <div :class="['topbar-tabs-item', {active: show_analysis}]" @click="setAllFalse(); show_analysis=true">Analysis-Tools</div>
            <div :class="['topbar-tabs-item', {active: show_select}]" @click="setAllFalse(); show_select=true">Select-Tools</div>
            <div :class="['topbar-tabs-item', {active: show_layer}]" @click="setAllFalse(); show_layer=true">Layer-Tools</div>
            <div :class="['topbar-tabs-item', {active: show_tests}]" @click="setAllFalse(); show_tests=true">Tests</div>
        </div>
        <div class="topbar-items">
            <div v-show="show_select"><selecttopbar></selecttopbar></div>
            <div v-show="show_analysis"><analysistopbar></analysistopbar></div>
            <div v-show="show_tests"><testtopbar></testtopbar></div>
            <div v-show="show_layer"><layertopbar></layertopbar></div>
        </div>
    </div>
    `
} 

export { topbar }