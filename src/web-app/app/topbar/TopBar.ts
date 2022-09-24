import { computed, ref, reactive, onMounted, defineExpose} from 'vue';
import { analysistopbar } from './AnalysisTopBar';
import { selecttopbar } from './SelectTopBar'
import { layertopbar } from './LayerTopBar';
import { getAppState } from '/state';
import { VIcon } from 'vuetify/components';
import { topbaritem } from '/components/topbar/TopBarItem';
import { topbarbutton } from '/components/topbar/TopBarButton';
import { topbarseperator } from '/components/topbar/TopBarSeperator';
import './TopBar.css'

const topbar = {
    components: { selecttopbar, layertopbar, analysistopbar, VIcon, topbaritem},
    props: [ ],
    setup(props) {
        const state = getAppState();

        const active = computed(() => state.topbar.active )

        function setActive(value: string) {
            state.topbar.active = value; 
        }

        function handleClick(item: string) {
            if (state.topbar.active === item)
                state.topbar.active = null;
            else
                state.topbar.active = item;
        }

        function handleHover(item: string) {
            if (state.topbar.active === null)
                return;
            else
                state.topbar.active = item;
        }

        return { active, handleClick, handleHover }
    },
    template: `
    <div class="topbar">
        <v-icon size=33 color="white" style="float: left;" small>mdi-navigation-variant-outline</v-icon>
        <selecttopbar :active="active === 'select'" @click="handleClick('select')" @hover="handleHover('select')"></selecttopbar>
        <layertopbar :active="active === 'layer'" @click="handleClick('layer')" @hover="handleHover('layer')"></layertopbar>
    </div>
    `
} 

export { topbar }