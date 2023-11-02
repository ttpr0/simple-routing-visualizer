<script lang="ts">
import { computed, ref, reactive, watch, toRef} from 'vue';
import { VectorLayer } from '/map/VectorLayer';
import { getAppState, getToolbarState } from '/state';
import { getMap } from '/map';
import Icon from "/share_components/bootstrap/Icon.vue";
import { NSpace, NInput, NTag, NScrollbar } from 'naive-ui';
import ToolSearch from "./ToolSearch.vue";
import ToolView from "./ToolView.vue";
import { toolparam } from '/share_components/sidebar/toolbar/ToolParam';
import TextInput from "/share_components/TextInput.vue";
import ProgressBar from "/share_components/ProgressBar.vue";
import { getToolManager } from './ToolManager';

export default {
    components: { Icon, NSpace, NInput, NTag, NScrollbar, ToolView, ToolSearch },
    props: [ ],
    setup(props) {
        const state = getAppState();
        const map = getMap();
        const toolbar = getToolbarState();
        const toolmanager = getToolManager(); 

        const showSearch = computed(() => {
            if (toolbar.toolview.tool === undefined) {
                return true;
            }
            else {
                return false;
            }
        })

        return { showSearch }
    }
}
</script>

<template>
    <div class="toolbar">
        <div v-if="showSearch">
            <ToolSearch />
        </div>
        <div v-if="!showSearch">
            <ToolView />
        </div>
    </div>
</template>

<style scoped>
.toolbar {
    height: 100%;
    width: 100%;
    background-color: var(--bg-dark-color);
    color: var(--text-color);
    padding: 20px;
}
</style>