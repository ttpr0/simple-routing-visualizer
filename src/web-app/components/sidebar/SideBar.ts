import { computed, ref, reactive, onMounted, watch} from 'vue';
import { getAppState } from '/state';
import { VIcon } from 'vuetify/components';
import './SideBar.css'
import { layerbar } from './layerbar/LayerBar';
import { toolbar } from './toolbar/ToolBar';
import { filesbar } from './filebar/FilesBar';

const sidebar = {
    components: { VIcon, layerbar, toolbar, filesbar },
    props: [],
    setup() {
        const state = getAppState();

        const active = computed(() => state.sidebar.active )

        function setActive(value: string) {
            state.sidebar.active = value;
        }

        return { active, setActive }
    },
    template: `
    <div class="sidebar">
        <div :class="['sidebar-tab', {active: active === 'layers'}]" @click="if (active==='layers') {setActive('');} else {setActive('layers')}"><v-icon size=40 color="gray">mdi-layers-triple</v-icon></div>
        <div :class="['sidebar-tab', {active: active === 'symbology'}]" @click="if (active==='symbology') {setActive('');} else {setActive('symbology')}"><v-icon size=40 color="gray">mdi-lead-pencil</v-icon></div>
        <div :class="['sidebar-tab', {active: active === 'tools'}]" @click="if (active==='tools') {setActive('');} else {setActive('tools')}"><v-icon size=40 color="gray">mdi-toolbox</v-icon></div>
        <div :class="['sidebar-tab', {active: active === 'files'}]" @click="if (active==='files') {setActive('');} else {setActive('files')}"><v-icon size=40 color="gray">mdi-attachment</v-icon></div>
        <div class="sidebar-item">
            <div v-show="active === 'layers'"><layerbar></layerbar></div>
            <div v-show="active === 'tools'"><toolbar></toolbar></div>
            <div v-show="active === 'files'"><filesbar></filesbar></div>
        </div>
    </div>
    `
} 

export { sidebar }