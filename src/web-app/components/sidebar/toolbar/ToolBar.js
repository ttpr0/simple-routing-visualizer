import { computed, ref, reactive, watch, toRef} from 'vue';
import { VectorLayer } from '/map/VectorLayer.js';
import { getState } from '/store/state.js';
import { getMap } from '/map/maps.js';
import './ToolBar.css'
import { VAutocomplete, VList } from 'vuetify/components';
import { toolcontainer } from './ToolContainer.js';

const toolbar = {
    components: { VAutocomplete, VList, toolcontainer },
    props: [ ],
    setup(props) {
        const showSearch = ref(true);
        const running = ref(false);
        const toolname = ref(null);
        const tools = { 
            'TestTool': './tools/TestTool.js', 
            'TestRanges': './tools/TestRanges.js', 
            'TestFeatureCount': './tools/TestFeatureCount.js', 
            'RangediffTest': './tools/RangediffTest.js',
            'IsolinesTest': './tools/IsolinesTest.js',
            'RunIsoRaster': './tools/RunIsoRaster.js',
            'ORSApiTest': './tools/ORSApiTest.js',
            'DockerApiTest': './tools/DockerApiTest.js',
            'CompareIsolines': './tools/CompareIsolines.js',
        };

        const onToolClick = (key) => {
            toolname.value = Object.keys(tools)[key];
            loadTool();
        }

        const Tool = {};

        const loadTool = async () => {
            let { tool, run } = await import(/* @vite-ignore */tools[toolname.value]);
            Tool.comp = tool;
            Tool.run = run;
            showSearch.value = false;
        }

        var obj = {};
        const reactiveObj = reactive(obj);

        const runTool = async () => {
            running.value = true;
            await Tool.run(obj);
            running.value = false;
        }

        return { toolname, tools, onToolClick, loadTool, showSearch, runTool, reactiveObj, Tool, running }
    },
    template: `
    <div class="toolbar">
        <div v-if="showSearch">
            <v-autocomplete v-model="toolname" :items="Object.keys(tools)" dense filled label="Select Tool" prepend-icon="mdi-wrench" @update:modelValue="loadTool()"></v-autocomplete>
            <v-list density="compact">
                <v-list-subheader>TOOLS</v-list-subheader>
                <v-list-item v-for="(item, i) in Object.keys(tools).slice(0,9)" :key="i" :value="item" variant="plain" @click="onToolClick(i)">
                    <v-list-item-avatar start>
                        <v-icon icon="mdi-tools"></v-icon>
                    </v-list-item-avatar>
                    <v-list-item-title v-text="item"></v-list-item-title>
                </v-list-item>
            </v-list>
        </div>
        <div v-if="!showSearch">
            <toolcontainer :toolname="toolname" @close="showSearch=true" @run="runTool()" :running="running">
                <component :is="Tool.comp" :obj="reactiveObj"></component>
            </toolcontainer>
        </div>
    </div>
    `
} 

export { toolbar}