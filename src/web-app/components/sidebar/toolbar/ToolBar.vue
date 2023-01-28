<script lang="ts">
import { computed, ref, reactive, watch, toRef} from 'vue';
import { VectorLayer } from '/map/VectorLayer';
import { getAppState, getToolbarState } from '/state';
import { getMap } from '/map';
import { VIcon } from 'vuetify/components';
import { NSpace, NInput, NTag, NScrollbar } from 'naive-ui';
import ToolContainer from './ToolContainer.vue';
import { toolparam } from '/share_components/sidebar/toolbar/ToolParam';
import { getToolManager } from './ToolManager';

export default {
    components: { VIcon, NSpace, NInput, NTag, NScrollbar, ToolContainer, toolparam },
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

        const param_info = computed(() => {
            const tool = toolmanager.getTool(toolbar.currtool.name);
            if (tool !== undefined) {
                return tool.getParameterInfo();
            }
            return [];
        })
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
            return toolbar.currtool.name;
        })

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

        return { tool_search, showSearch, tool_params, tool_list, param_info, tool_name , runTool, setToolInfo, setCurrTool}
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
                        <n-tag v-for="(item, i) in tool_list" @click="setCurrTool(item)" size="large">
                            <div style="cursor: pointer;">
                                <v-icon icon="mdi-tools" color="white"></v-icon>
                                {{ item }}
                            </div>
                        </n-tag>
                    </n-space>
                </n-scrollbar>
            </div>
        </div>
        <div v-if="!showSearch">
            <ToolContainer :toolname="tool_name" @close="setCurrTool(undefined)" @run="runTool()" @info="setToolInfo()">
                <toolparam v-for="param in param_info" v-model="tool_params[param.name]" :param="param"></toolparam>
            </ToolContainer>
        </div>
    </div>
</template>

<style scoped>
.toolbar {
    height: 100%;
    width: 100%;
    background-color: rgb(51, 51, 51);
    color: white;
    padding: 20px;
}
</style>