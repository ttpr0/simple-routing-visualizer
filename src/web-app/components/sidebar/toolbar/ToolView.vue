<script lang="ts">
import { computed, ref, reactive, watch, toRef, onMounted, toRaw } from "vue";
import { getAppState, getToolbarState } from "/state";
import { getMap } from "/map";
import Icon from "/share_components/bootstrap/Icon.vue";
import { NSpace, NInput, NTag, NScrollbar } from "naive-ui";
import ToolContainer from "./ToolContainer.vue";
import ToolTag from "./ToolTag.vue";
import { toolparam } from "/share_components/sidebar/toolbar/ToolParam";
import TextInput from "/share_components/TextInput.vue";
import ProgressBar from "/share_components/ProgressBar.vue";
import { getToolManager } from "./ToolManager";

export default {
  components: {
    Icon,
    NSpace,
    NInput,
    NTag,
    NScrollbar,
    ToolContainer,
    ToolTag,
    toolparam,
    TextInput,
    ProgressBar,
  },
  props: [],
  setup(props) {
    const state = getAppState();
    const map = getMap();
    const toolbar = getToolbarState();
    const toolmanager = getToolManager();

    onMounted(() => {
      if (
        toolbar.toolview.toolbox === toolbar.currtool.toolbox &&
        toolbar.toolview.tool === toolbar.currtool.tool
      ) {
        toolbar.toolview.params = toRaw(toolbar.currtool.params);
      } else {
        let tool = toolmanager.getTool(
          toolbar.toolview.toolbox,
          toolbar.toolview.tool
        );
        let params = tool.getDefaultParameters();
        toolbar.toolview.params = params;
      }
    });

    const params = computed(() => {
      return toolbar.toolview.params;
    });

    const param_info = ref(null);

    const out_info = computed(() => {
      const tool = toolmanager.getTool(
        toolbar.toolview.toolbox,
        toolbar.toolview.tool
      );
      if (tool !== undefined) {
        return tool.getOutputInfo();
      }
      return [];
    });
    const tool_params = computed(() => {
      return toolbar.toolview.params;
    });
    const tool_name = computed(() => {
      const tool = toolmanager.getTool(
        toolbar.toolview.toolbox,
        toolbar.toolview.tool
      );
      if (tool !== undefined) {
        param_info.value = tool.getParameterInfo();
      } else {
        param_info.value = [];
      }
      return [toolbar.toolview.tool, toolbar.toolview.toolbox];
    });

    function setParam(name, value) {
      toolbar.toolview.params[name] = value;
      const tool = toolmanager.getTool(
        toolbar.toolview.toolbox,
        toolbar.toolview.tool
      );
      const p = toRaw(toolbar.toolview.params);
      const [newI, newP] = tool.updateParameterInfo(p, param_info.value, name);
      if (newI !== null) {
        param_info.value = newI;
        toolbar.toolview.params = newP;
      }
    }

    function closeCurrTool() {
      toolbar.toolview.tool = undefined;
      toolbar.toolview.toolbox = undefined;
      toolbar.toolview.params = {};
    }

    function activateToolInfo() {
      toolmanager.setToolInfo();
    }

    const runTool = async () => {
      toolbar.toolinfo.tool = toolbar.toolview.tool;
      const p = toRaw(toolbar.toolview.params);
      const out = await toolmanager.runTool(
        toolbar.toolview.toolbox,
        toolbar.toolview.tool,
        p
      );
      if (out == null) return;
      out_info.value.forEach((element) => {
        if (element["type"] === "layer") {
          try {
            map.addLayer(out[element["name"]]);
          } catch {
            return;
          }
        }
      });
    };

    return {
      tool_params,
      param_info,
      tool_name,
      runTool,
      activateToolInfo,
      closeCurrTool,
      setParam,
    };
  },
};
</script>

<template>
  <ToolContainer
    :toolbox="tool_name[1]"
    :tool="tool_name[0]"
    @close="closeCurrTool()"
    @run="runTool()"
    @info="activateToolInfo()"
  >
    <toolparam
      v-for="param in param_info"
      :key="param"
      :modelValue="tool_params[param.name]"
      @update:modelValue="(value) => setParam(param.name, value)"
      :param="param"
    ></toolparam>
  </ToolContainer>
</template>

<style scoped>
</style>