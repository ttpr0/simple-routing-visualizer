import { createApp, ref, reactive, onMounted, defineExpose} from '/lib/vue.js'
import { layerbar } from '/components/LayerBar.js';
import { selectbar } from '/components/SelectBar.js';
import { getMap } from '../app.js';
import { analysisbar } from './AnalysisBar.js';

const topbar = {
    components: { layerbar, selectbar, analysisbar },
    props: [ ],
    setup(props) {
        const show_analysis = ref(false);
        const show_layer = ref(false);
        const show_select = ref(false);
        return {show_analysis, show_layer, show_select}
    },
    template: `
    <div class="topbar">
        <div class="topbar-menu">
            <div class="topbar-menuitem" @click="show_analysis = !show_analysis">Analyse</div>  
            <div class="topbar-menuitem" @click="show_layer = !show_layer">Layerbaum</div>    
            <div class="topbar-menuitem" @click="show_select = !show_select">Select Item</div>      
        </div>
        <div class="topbar-body">
            <analysisbar v-if="show_analysis" class="sidebar-analysis">analysis</analysisbar>
            <layerbar v-if="show_layer" class="sidebar-layer">layer</layerbar>
            <selectbar v-if="show_select" class="sidebar-select">select</selectbar>
        </div>
    </div>
    `
} 

export { topbar }