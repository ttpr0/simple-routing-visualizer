import { createApp, ref, reactive, onMounted, defineExpose} from '/lib/vue.js'
import { layerbar } from '/components/LayerBar.js';
import { selectbar } from '/components/SelectBar.js';
import { getMap } from '../app.js';
import { analysisbar } from './AnalysisBar.js';

const sidebar = {
    components: { layerbar, selectbar, analysisbar },
    props: [ ],
    setup(props) {
        const show_analysis = ref(true);
        const show_layer = ref(false);
        const show_select = ref(false);
        return {show_analysis, show_layer, show_select}
    },
    template: `
    <nav class="sidebar">
        <div class="sidebar-menuitem" @click="show_analysis = !show_analysis">Analyse</div>
        <analysisbar v-show="show_analysis" class="sidebar-analysis">analysis</analysisbar>
        <div class="sidebar-menuitem" @click="show_layer = !show_layer">Layerbaum</div>
        <layerbar v-show="show_layer" class="sidebar-layer">layer</layerbar>
        <div class="sidebar-menuitem" @click="show_select = !show_select">Select Item</div>
        <selectbar v-show="show_select" class="sidebar-select">select</selectbar>
    </nav>
    `
} 

export { sidebar }