import { computed, ref, reactive, onMounted, defineExpose} from 'vue';
import { analysistopbar } from './AnalysisTopBar';
import { selecttopbar } from './SelectTopBar'
import { layertopbar } from './LayerTopBar';
import { getAppState } from '/state';
import './TopBar.css'

const topbar = {
    components: { selecttopbar, layertopbar, analysistopbar},
    props: [ ],
    setup(props) {
        const state = getAppState();

        const active = computed(() => state.topbar.active )

        function setActive(value: string) {
            state.topbar.active = value; 
        }

        return { active, setActive }
    },
    template: `
    <div class="topbar">
        <div class="topbar-tabs">
            <div :class="['topbar-tabs-item', {active: active === 'analysis'}]" @click="if (active==='analysis') { setActive(''); } else { setActive('analysis') }">Analysis-Tools</div>
            <div :class="['topbar-tabs-item', {active: active === 'select'}]" @click="if (active==='select') { setActive(''); } else { setActive('select') }">Select-Tools</div>
            <div :class="['topbar-tabs-item', {active: active === 'layer'}]" @click="if (active==='layer') { setActive(''); } else { setActive('layer') }">Layer-Tools</div>
        </div>
        <div class="topbar-items" v-show="active !== ''">
            <div v-show="active === 'select'"><selecttopbar></selecttopbar></div>
            <div v-show="active === 'analysis'"><analysistopbar></analysistopbar></div>
            <div v-show="active === 'layer'"><layertopbar></layertopbar></div>
        </div>
    </div>
    `
} 

export { topbar }