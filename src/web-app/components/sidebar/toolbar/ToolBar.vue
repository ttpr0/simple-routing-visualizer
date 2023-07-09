<script lang="ts">
import { computed, ref, reactive, watch, toRef} from 'vue';
import { VectorLayer } from '/map/VectorLayer';
import { getAppState, getToolbarState } from '/state';
import { getMap } from '/map';
import Icon from "/share_components/bootstrap/Icon.vue";
import { NSpace, NInput, NTag, NScrollbar } from 'naive-ui';
import ToolContainer from './ToolContainer.vue';
import { toolparam } from '/share_components/sidebar/toolbar/ToolParam';
import { getToolManager } from './ToolManager';

export default {
    components: { Icon, NSpace, NInput, NTag, NScrollbar, ToolContainer, toolparam },
    props: [ ],
    setup(props) {
        const state = getAppState();
        const map = getMap();
        const toolbar = getToolbarState();
        const toolmanager = getToolManager(); 

        const tool_search = ref("");
        const tool_list = computed(() => {
            return toolbar.tools.filter(element => element.toLowerCase().includes(tool_search.value))
        })

        let params = {};

        const showSearch = computed(() => {
            if (toolbar.currtool.name === undefined) {
                return true;
            }
            else {
                let tool = toolmanager.getTool(toolbar.currtool.name);
                params = tool.getDefaultParameters();
                toolbar.currtool.params = params;
                return false;
            }
        })

        const param_info = ref(null);

        const out_info = computed(() => {
            const tool = toolmanager.getTool(toolbar.currtool.name);
            if (tool !== undefined) {
                return tool.getOutputInfo();
            }
            return [];
        })
        const tool_params = computed(() => {
            return toolbar.currtool.params;
        })
        const tool_name = computed(() => {
            const tool = toolmanager.getTool(toolbar.currtool.name);
            if (tool !== undefined) {
                param_info.value = tool.getParameterInfo();
            }
            else {
                param_info.value = [];
            }
            return toolbar.currtool.name;
        })

        function setParam(name, value) {
            toolbar.currtool.params[name] = value;
            const tool = toolmanager.getTool(toolbar.currtool.name);
            const [newI, newP] = tool.updateParameterInfo(params, param_info.value, name);
            if (newI !== null) {
                param_info.value = newI;
                toolbar.currtool.params = newP;
            }
        }

        function setCurrTool(name) {
            toolbar.currtool.name = name;
        }

        function setToolInfo() {
            toolmanager.setToolInfo();
        }

        const runTool = async () => {
            toolbar.toolinfo.tool = toolbar.currtool.name;
            const out = await toolmanager.runTool(toolbar.currtool.name, params)
            if (out == null)
                return;
            out_info.value.forEach(element => {
                if (element['type'] ==='layer') 
                {
                    try {
                        map.addLayer(out[element['name']]);
                    }
                    catch {
                        return;
                    }
                }                    
            });
        }

        return { tool_search, showSearch, tool_params, tool_list, param_info, tool_name , runTool, setToolInfo, setCurrTool, setParam}
    }
}
</script>

<template>
    <div class="toolbar">
        <div v-if="showSearch" style="height: 100%;">
            <n-input v-model:value="tool_search" type="text" placeholder="Filter Tools" />
            <div style="height: calc(100% - 34px); padding-top: 20px;">
                <n-scrollbar>
                    <n-space vertical>
                        <n-tag v-for="(item, i) in tool_list" :key="i" @click="setCurrTool(item)" size="large">
                            <div style="cursor: pointer;">
                                <div style="float: left; margin-right: 5px;"><Icon icon="bi-wrench-adjustable-circle" size="15px" color="var(--text-color)" /></div>
                                {{ item }}
                            </div>
                        </n-tag>
                    </n-space>
                </n-scrollbar>
            </div>
        </div>
        <div v-if="!showSearch">
            <ToolContainer :toolname="tool_name" @close="setCurrTool(undefined)" @run="runTool()" @info="setToolInfo()">
                <toolparam v-for="param in param_info" :key="param" :modelValue="tool_params[param.name]" @update:modelValue="value => setParam(param.name, value)" :param="param"></toolparam>
            </ToolContainer>
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