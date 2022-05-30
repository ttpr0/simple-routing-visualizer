import { computed, ref, reactive, watch, toRef} from 'vue';
import { VectorLayer } from '/map/VectorLayer.js';
import { getState } from '/store/state.js';
import { getMap } from '/map/maps.js';
import './ToolBar.css'
import { VAutocomplete, VList, VProgressLinear } from 'vuetify/components';

const toolcontainer = {
    components: { VProgressLinear },
    emits: ['close', 'run' ],
    props: [ 'toolname', 'running' ],
    setup(props, ctx) {

        const onclose = () => {
            ctx.emit('close');
        }

        const onrun = () => {
            ctx.emit('run');
        }

        return { onclose, onrun }
    },
    template: `
    <div class="toolcontainer">
        <div class="header">
            <v-icon @click="onclose()">mdi-arrow-left</v-icon>
            <p style="display: inline-block; width: 70%; text-align: center;">{{ toolname }}</p>
        </div>
        <div class="body">
            <slot></slot>
        </div>
        <div class="footer">
            <v-progress-linear :active="running" indeterminate color="rgb(65, 163, 170)"></v-progress-linear>
            <button @click="onrun()">Run Tool</button>
        </div>
    </div>
    `
} 

export { toolcontainer }