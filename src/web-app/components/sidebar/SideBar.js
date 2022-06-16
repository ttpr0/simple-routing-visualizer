import { computed, ref, reactive, onMounted, watch} from 'vue';
import { getState } from '/store/state.js';
import { getMap } from '/map/maps.js';
import { VIcon } from 'vuetify/components';
import './SideBar.css'
import { layerbar } from './layerbar/LayerBar.js';
import { toolbar } from './toolbar/ToolBar.js';
import { filesbar } from './filebar/FilesBar.js';

const sidebar = {
    components: { VIcon, layerbar, toolbar, filesbar },
    props: [],
    setup() {
        const show_layers = ref(false);
        const show_symbology = ref(false);
        const show_tools = ref(false);
        const show_files = ref(false);

        function setAllFalse() {
            show_layers.value = false;
            show_symbology.value = false;
            show_tools.value = false;
            show_files.value = false;
        }

        return { show_files, show_layers, show_symbology, show_tools, setAllFalse}
    },
    template: `
    <div class="sidebar">
        <div :class="['sidebar-tab', {active: show_layers}]" @click="if (show_layers===true) {show_layers=false;} else {setAllFalse(); show_layers=true}"><v-icon size=40 color="gray">mdi-layers-triple</v-icon></div>
        <div :class="['sidebar-tab', {active: show_symbology}]" @click="if (show_symbology===true) {show_symbology=false;} else {setAllFalse(); show_symbology=true}"><v-icon size=40 color="gray">mdi-lead-pencil</v-icon></div>
        <div :class="['sidebar-tab', {active: show_tools}]" @click="if (show_tools===true) {show_tools=false;} else {setAllFalse(); show_tools=true}"><v-icon size=40 color="gray">mdi-toolbox</v-icon></div>
        <div :class="['sidebar-tab', {active: show_files}]" @click="if (show_files===true) {show_files=false;} else {setAllFalse(); show_files=true;}"><v-icon size=40 color="gray">mdi-attachment</v-icon></div>
        <div class="sidebar-item">
            <div v-show="show_layers"><layerbar></layerbar></div>
            <div v-show="show_tools"><toolbar></toolbar></div>
            <div v-show="show_files"><filesbar></filesbar></div>
        </div>
    </div>
    `
} 

export { sidebar }