import { computed, ref, reactive, watch, toRef} from 'vue';
import { VectorLayer } from '/map/VectorLayer.js';
import { getState } from '/store/state.js';
import { getMap } from '/map/maps.js';
import './ToolBar.css'
import { VAutocomplete, VList } from 'vuetify/components';
import { toolcontainer } from './ToolContainer.js';
import { toolparam } from './ToolParam.js';

const toolbar = {
    components: { VAutocomplete, VList, toolcontainer, toolparam },
    props: [ ],
    setup(props) {
        const state = getState();
        const map = getMap();

        function updateLayerTree() {
            state.layertree.update = !state.layertree.update;
        }

        const showSearch = ref(true);
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
            let { run, param, out } = await import(/* @vite-ignore */tools[toolname.value]);
            Tool.run = run;
            Tool.params = param;
            for (let p of Tool.params)
            {
                reactiveObj[p.name] = p.default;
            }
            Tool.output = out;
            showSearch.value = false;
        }

        var obj = {};
        const reactiveObj = reactive(obj);

        function setToolInfo() {
            state.tools.toolinfo.show = true; 
            state.tools.toolinfo.pos = [400, 400];          
        }

        function addMessage(message, color="black") {
            state.tools.toolinfo.text += "<span style='color:" + color + "'>" + message + "</span><br>";
        }

        const runTool = async () => {
            state.tools.currtool = toolname.value;
            state.tools.state = 'running';
            state.tools.toolinfo.text = "";
            const out = {};
            addMessage("Started " + toolname.value + ":", 'green');
            try {
                await Tool.run(obj, out, addMessage);
                Tool.output.forEach(element => {
                    if (element.type==='layer') 
                    {
                        map.addLayer(out[element.name]);
                    }                    
                });
                updateLayerTree();
                addMessage("Succesfully finished", 'green');
                state.tools.state = 'finished';
            }
            catch (e) {
                addMessage(e, 'red');
                state.tools.state = 'error';
            }
        }

        return { toolname, tools, onToolClick, loadTool, showSearch, runTool, reactiveObj, Tool, setToolInfo }
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
            <toolcontainer :toolname="toolname" @close="showSearch=true" @run="runTool()" @info="setToolInfo()">
                <toolparam v-for="param in Tool.params" v-model="reactiveObj[param.name]" :param="param"></toolparam>
            </toolcontainer>
        </div>
    </div>
    `
} 

export { toolbar}