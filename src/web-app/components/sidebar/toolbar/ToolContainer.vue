<script lang="ts">
import { computed, ref, reactive, watch, toRef} from 'vue';
import { VectorLayer } from '/map/VectorLayer';
import { getAppState, getToolbarState } from '/state';
import { VProgressLinear, VIcon } from 'vuetify/components';

export default {
    components: { VProgressLinear, VIcon },
    emits: ['close', 'run', 'info' ],
    props: [ 'toolname' ],
    setup(props, ctx) {
        const state = getAppState();
        const toolbar = getToolbarState();

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
            if (toolbar.toolinfo.tool === props.toolname)
            {
                return toolbar.state === 'running'; 
            }
            else
            { return false; }
        });

        const error = computed(() => {
            if (toolbar.toolinfo.tool === props.toolname)
            {
                return toolbar.state === 'error'; 
            }
            else
            { return false; }
        });

        const finished = computed(() => {
            if (toolbar.toolinfo.tool === props.toolname)
            {
                return toolbar.state === 'finished'; 
            }
            else
            { return false; }
        })

        const disableinfo = computed(() => {
            if (toolbar.toolinfo.tool !== props.toolname)
            { return true; }
            else 
            { return false; }
        });

        const disablerun = computed(() => {
            return toolbar.running === 'running';
        });

        return { onclose, onrun, oninfo, running, disablerun, disableinfo, error, finished }
    }
}
</script>

<template>
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
</template>

<style scoped>
.toolcontainer {
    position: relative;
    width: 100%;
    height: 100%;
}

.toolcontainer .header {
    width: 100%;
    height: 30px;
}


.toolcontainer .body {
    width: 100%;
    height: calc(100% - 80px);
    scrollbar-width: thin;
}

.toolcontainer .footer {
    width: 100%;
    height: 50px;
    position: absolute;
    bottom: 0px;
}

.toolcontainer .footer .run {
    border-radius: 5px;
    background-color: lightblue;
    color: white;
    margin-top: 15px;
    padding: 5px;
    float: right;
    cursor: pointer;
}
.toolcontainer .footer .run:disabled {
    background-color: lightgray;
}

.toolcontainer .footer .info {
    border-radius: 5px;
    background-color: lightblue;
    margin-top: 15px;
    padding: 5px;
    float: left;
    cursor: pointer;
}
.toolcontainer .footer .info:disabled {
    background-color: lightgray;
}
</style>