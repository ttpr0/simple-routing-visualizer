import { computed, ref, reactive, onMounted, defineExpose} from 'vue';
import { getMap } from '/map/maps';
import { analysistopbar } from './AnalysisTopBar';
import { selecttopbar } from './SelectTopBar'
import { layertopbar } from './LayerTopBar';
import './TopBar.css'

const topbar = {
    components: { selecttopbar, layertopbar, analysistopbar},
    props: [ ],
    setup(props) {
        const show_analysis = ref(false);
        const show_layer = ref(false);
        const show_select = ref(true);

        function setAllFalse() {
            show_analysis.value = false;
            show_layer.value = false;
            show_select.value = false;
        }

        const showItems = computed(() => {
            if (show_analysis.value || show_layer.value || show_select.value)
            {
                return true;
            }
            return false;
        })

        return {show_analysis, show_layer, show_select, setAllFalse, showItems}
    },
    template: `
    <div class="topbar">
        <div class="topbar-tabs">
            <div :class="['topbar-tabs-item', {active: show_analysis}]" @click="if (show_analysis===true) {show_analysis=false;} else {setAllFalse(); show_analysis=true}">Analysis-Tools</div>
            <div :class="['topbar-tabs-item', {active: show_select}]" @click="if (show_select===true) {show_select=false;} else {setAllFalse(); show_select=true}">Select-Tools</div>
            <div :class="['topbar-tabs-item', {active: show_layer}]" @click="if (show_layer===true) {show_layer=false;} else {setAllFalse(); show_layer=true}">Layer-Tools</div>
        </div>
        <div class="topbar-items" v-show="showItems">
            <div v-show="show_select"><selecttopbar></selecttopbar></div>
            <div v-show="show_analysis"><analysistopbar></analysistopbar></div>
            <div v-show="show_layer"><layertopbar></layertopbar></div>
        </div>
    </div>
    `
} 

export { topbar }