import { computed, ref, reactive, watch, toRef} from 'vue';
import { VectorLayer } from '/map/VectorLayer.js';
import { getState } from '/store/state.js';
import { getMap } from '/map/maps.js';
import './ToolBar.css'
import { VAutocomplete, VList, VProgressLinear, VIcon } from 'vuetify/components';

const toolcontainer = {
    components: { VProgressLinear, VIcon },
    emits: ['close', 'run', 'info' ],
    props: [ 'toolname' ],
    setup(props, ctx) {
        const state = getState();

        const onclose = () => {
            ctx.emit('close');
        }

        const onrun = () => {
            ctx.emit('run');
        }

        const oninfo = () => {
            ctx.emit('info');
        }

        const running = computed(() => {
            if (state.tools.currtool === props.toolname)
            {
                return state.tools.running; 
            }
            else
            { return false; }
        });

        const disableinfo = computed(() => {
            if (state.tools.currtool !== props.toolname)
            { return true; }
            else 
            { return false; }
        });

        const disablerun = computed(() => {
            return state.tools.running;
        });

        return { onclose, onrun, oninfo, running, disablerun, disableinfo }
    },
    template: `
    <div class="toolcontainer">
        <div class="header">
            <v-icon @click="onclose()">mdi-arrow-left</v-icon>
            <p style="display: inline-block; width: 70%; text-align: center;">{{ toolname }}</p>
        </div>
        <div class="body" style="overflow-y: auto;">
            <slot></slot>
        </div>
        <div class="footer">
            <v-progress-linear :active="running" indeterminate color="rgb(65, 163, 170)"></v-progress-linear>
            <button class="info" @click="oninfo()" style="float= left;" :disabled="disableinfo"><v-icon size=20 color="white">mdi-information</v-icon></button>
            <button class="run" @click="onrun()" :disabled="disablerun">Run Tool</button>
        </div>
    </div>
    `
} 

export { toolcontainer }