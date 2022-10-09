import { computed, ref, reactive, watch, toRef} from 'vue';
import { VectorLayer } from '/map/VectorLayer';
import { getAppState, getMapState, getToolbarState } from '/state';
import './ToolBar.css'
import { VIcon } from 'vuetify/components';
import { NSpace, NInput, NTag, NScrollbar } from 'naive-ui';
import { toolcontainer } from './ToolContainer';
import { toolparam } from '/components/sidebar/toolbar/ToolParam';

const toolbar = {
    components: { VIcon, NSpace, NInput, NTag, NScrollbar, toolcontainer, toolparam },
    props: [ ],
    setup(props) {
        const state = getAppState();
        const map = getMapState();
        const toolbar = getToolbarState();

        const tool_search = ref("");
        const tools = computed(() => {
            return toolbar.tools.filter(element => element.toLowerCase().includes(tool_search.value))
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
            toolbar.toolinfo.tool = toolbar.currtool.name;
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

        return { tools, tool_search, onToolClick, showSearch, runTool, reactiveParams, currtool, setToolInfo }
    },
    template: `
    <div class="toolbar">
        <div v-if="showSearch" style="height: 100%;">
            <n-input v-model:value="tool_search" type="text" placeholder="Basic Input" />
            <div style="height: calc(100% - 34px); padding-top: 20px;">
                <n-scrollbar>
                    <n-space vertical>
                        <n-tag v-for="(item, i) in tools" @click="onToolClick(item)" size="large">
                            <div style="cursor: pointer;">
                                <v-icon icon="mdi-tools" color="white"></v-icon>
                                {{ item }}
                            </div>
                        </n-tag>
                    </n-space>
                </n-scrollbar>
            </div>
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