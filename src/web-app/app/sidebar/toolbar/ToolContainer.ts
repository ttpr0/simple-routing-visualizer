import { computed, ref, reactive, watch, toRef} from 'vue';
import { VectorLayer } from '/map/VectorLayer';
import { getAppState } from '/state';
import './ToolBar.css'
import { VAutocomplete, VList, VProgressLinear, VIcon } from 'vuetify/components';

const toolcontainer = {
    components: { VProgressLinear, VIcon },
    emits: ['close', 'run', 'info' ],
    props: [ 'toolname' ],
    setup(props, ctx) {
        const state = getAppState();

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
                return state.tools.state === 'running'; 
            }
            else
            { return false; }
        });

        const error = computed(() => {
            if (state.tools.currtool === props.toolname)
            {
                return state.tools.state === 'error'; 
            }
            else
            { return false; }
        });

        const finished = computed(() => {
            if (state.tools.currtool === props.toolname)
            {
                return state.tools.state === 'finished'; 
            }
            else
            { return false; }
        })

        const disableinfo = computed(() => {
            if (state.tools.currtool !== props.toolname)
            { return true; }
            else 
            { return false; }
        });

        const disablerun = computed(() => {
            return state.tools.running === 'running';
        });

        return { onclose, onrun, oninfo, running, disablerun, disableinfo, error, finished }
    },
    template: `
    <div class="toolcontainer">
        <div class="header">
            <v-icon @click="onclose()">mdi-arrow-left</v-icon>
            <div style="width: calc(100% - 24px); float: right;">
                <p style="display: inline-block; width: 100%; text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ toolname }}</p>
            </div>
        </div>
        <div class="body" style="overflow-y: auto;">
            <slot></slot>
        </div>
        <div class="footer">
            <v-progress-linear model-value="100" :active="running || finished || error" :indeterminate="running" :color="error ? 'red' : 'rgb(65, 163, 170)'"></v-progress-linear>
            <button class="info" @click="oninfo()" style="float= left;" :disabled="disableinfo"><v-icon size=20 color="white">mdi-information</v-icon></button>
            <button class="run" @click="onrun()" :disabled="disablerun">Run Tool</button>
        </div>
    </div>
    `
} 

export { toolcontainer }