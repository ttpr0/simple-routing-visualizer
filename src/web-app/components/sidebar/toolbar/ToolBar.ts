import { computed, ref, reactive, watch, toRef} from 'vue';
import { VectorLayer } from '/map/VectorLayer';
import { getAppState, getMapState } from '/state';
import { getToolStore } from '/tools/toolstore';
import './ToolBar.css'
import { VAutocomplete, VList } from 'vuetify/components';
import { toolcontainer } from './ToolContainer';
import { toolparam } from './ToolParam';

const toolbar = {
    components: { VAutocomplete, VList, toolcontainer, toolparam },
    props: [ ],
    setup(props) {
        const state = getAppState();
        const map = getMapState();
        const toolstore = getToolStore();

        const tools = computed(() => {
            let test = state.toolbox.update;
            let tools = [];
            for (let t of  Object.keys(toolstore.tools))
            {
                tools.push(t);
            }
            return tools;
        })

        const showSearch = ref(true);
        const toolname = ref(null);

        const onToolClick = (name) => {
            toolname.value = name;
            loadTool();
        }

        const Tool: any = {};

        const loadTool = async () => {
            let t = toolstore.tools[toolname.value];
            Tool.run = t.run;
            Tool.param = t.param;
            Tool.out = t.out;
            for (let p of Tool.param)
            {
                reactiveObj[p.name] = p.default;
            }
            showSearch.value = false;
        }

        var obj = {};
        const reactiveObj = reactive(obj);

        function setToolInfo() {
            state.tools.toolinfo.show = true; 
            state.tools.toolinfo.pos = [400, 400];          
        }

        function addMessage(message, color="black") {
            if (typeof message === 'string')
            { message = message.replace(/(?:\r\n|\r|\n)/g, '<br>'); }
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
                Tool.out.forEach(element => {
                    if (element.type==='layer') 
                    {
                        map.addLayer(out[element.name]);
                    }                    
                });
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
            <v-autocomplete v-model="toolname" :items="tools" dense filled label="Select Tool" prepend-icon="mdi-wrench" @update:modelValue="loadTool()"></v-autocomplete>
            <v-list density="compact">
                <v-list-subheader>TOOLS</v-list-subheader>
                <v-list-item v-for="(item, i) in tools.slice(0,9)" :key="i" :value="item" variant="plain" @click="onToolClick(item)">
                    <v-list-item-avatar start>
                        <v-icon icon="mdi-tools"></v-icon>
                    </v-list-item-avatar>
                    <v-list-item-title v-text="item"></v-list-item-title>
                </v-list-item>
            </v-list>
        </div>
        <div v-if="!showSearch">
            <toolcontainer :toolname="toolname" @close="showSearch=true" @run="runTool()" @info="setToolInfo()">
                <toolparam v-for="param in Tool.param" v-model="reactiveObj[param.name]" :param="param"></toolparam>
            </toolcontainer>
        </div>
    </div>
    `
} 

export { toolbar}