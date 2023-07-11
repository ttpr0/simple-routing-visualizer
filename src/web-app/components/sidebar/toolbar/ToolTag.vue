<script lang="ts">
import { computed, ref, reactive, watch, toRef, onMounted} from 'vue';
import { VectorLayer } from '/map/VectorLayer';
import { getAppState, getToolbarState } from '/state';
import { getMap } from '/map';
import Icon from "/share_components/bootstrap/Icon.vue";
import Tag from "/share_components/Tag.vue";
import ProgressBar from "/share_components/ProgressBar.vue";


export default {
    components: { Icon, Tag, ProgressBar },
    props: [ "tool", "toolbox" ],
    emits: [ "click" ],
    setup(props, ctx) {
        const state = getAppState();
        const map = getMap();
        const toolbar = getToolbarState();

        function onclick(e) {
            ctx.emit("click", e);
        }

        const active = ref(false);
        const progress = ref(100);
        const animation = ref(false);
        const color = ref("var(--theme-color)");

        function setProgressBar() {
            if (toolbar.currtool.tool === props.tool && toolbar.currtool.toolbox === props.toolbox) {
                active.value = true;
                color.value = "var(--theme-color)";
                if (toolbar.currtool.state === "running") {
                    animation.value = true;
                } else if (toolbar.currtool.state === "finished") {
                    animation.value = false;
                } else if (toolbar.currtool.state === "error") {
                    animation.value = false;
                    color.value = "red";
                }
            } else {
                active.value = false;
            }
        }

        const curr_tool = computed(() => {
            return [toolbar.currtool.tool, toolbar.currtool.toolbox];
        });
        watch(curr_tool, () => {
            setProgressBar();
        })
        const tool_state = computed(() => {
            return toolbar.currtool.state;
        });
        watch(tool_state, (newVal: string) => {
            setProgressBar();
        });

        onMounted(() => {
            setProgressBar();
        });

        return { onclick, active, progress, animation, color }
    }
}
</script>

<template>
    <Tag @click="onclick">
        <div class="tagcontent">
            <div style="float: left; margin-right: 5px; padding: 2px 0px 0px 0px;"><Icon icon="bi-wrench-adjustable-circle" size="17px" color="var(--text-color)" /></div>
            <div class="tagtext" style="float: left;">{{ tool }}</div>
        </div>
        <ProgressBar v-if="active" height="5px" :progress="progress" :animation="animation" :color="color" />
    </Tag>
</template>

<style scoped>
.tagcontent {
    padding: 8px 16px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.tagtext {
    width: calc(100% - 38px);
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>