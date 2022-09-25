import { computed, ref, reactive, watch, toRef} from 'vue';
import { VectorLayer } from '/map/VectorLayer';
import { getAppState, getMapState, getToolbarState } from '/state';
import './ToolBar.css'
import { VAutocomplete, VList, VListItem, VListSubheader, VListItemTitle, VListItemAvatar } from 'vuetify/components';
import { toolcontainer } from './ToolContainer';
import { toolparam } from '/components/sidebar/toolbar/ToolParam';

const toolbar = {
    components: { VAutocomplete, VList, VListItem, VListSubheader, VListItemAvatar, VListItemTitle, toolcontainer, toolparam },
    props: [ ],
    setup(props) {
        const state = getAppState();
        const map = getMapState();
        const toolbar = getToolbarState();

        const tools = computed(() => {
            return toolbar.tools;
        })

        const showSearch = ref(true);
        const currtool = computed(() => {
            return toolbar.currtool;
        })

        const onToolClick = (name) => {
            toolbar.currtool.name = name;
            loadTool();
        }

        const loadTool = async () => {
            let t = toolbar.getTool(toolbar.currtool.name);
            toolbar.currtool.params = t.param;
            toolbar.currtool.out = t.out;
            for (let p of t.param)
            {
                reactiveParams[p['name']] = p['default'];
            }
            showSearch.value = false;
        }

        var params = {};
        const reactiveParams = reactive(params);

        function setToolInfo() {
            toolbar.setToolInfo();
        }

        const runTool = async () => {
            const out = await toolbar.runTool(toolbar.currtool.name, params)
            if (out == null)
                return;
            toolbar.currtool.out.forEach(element => {
                if (element.type==='layer') 
                {
                    try {
                        map.addLayer(out[element.name]);
                    }
                    catch {
                        return;
                    }
                }                    
            });
        }

        return { tools, onToolClick, loadTool, showSearch, runTool, reactiveParams, currtool, setToolInfo }
    },
    template: `
    <div class="toolbar">
        <div v-if="showSearch">
            <v-autocomplete v-model="currtool.name" :items="tools" dense filled label="Select Tool" prepend-icon="mdi-wrench" @update:modelValue="loadTool()"></v-autocomplete>
            <v-list density="compact" bg-color="rgb(51,51,51)">
                <v-list-subheader color="white">TOOLS</v-list-subheader>
                <v-list-item v-for="(item, i) in tools.slice(0,9)" :key="i" :value="item" variant="plain" @click="onToolClick(item)">
                    <v-list-item-avatar start>
                        <v-icon icon="mdi-tools" color="white"></v-icon>
                    </v-list-item-avatar>
                    <div style="color: white; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"><v-list-item-title v-text="item"></v-list-item-title></div>
                </v-list-item>
            </v-list>
        </div>
        <div v-if="!showSearch">
            <toolcontainer :toolname="currtool.name" @close="showSearch=true" @run="runTool()" @info="setToolInfo()">
                <toolparam v-for="param in currtool.params" v-model="reactiveParams[param.name]" :param="param"></toolparam>
            </toolcontainer>
        </div>
    </div>
    `
} 

export { toolbar}