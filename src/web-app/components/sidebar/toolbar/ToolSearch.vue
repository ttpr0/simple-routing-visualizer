<script lang="ts">
import { computed, ref, reactive, watch, toRef, onMounted } from "vue";
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
    TextInput,
  },
  props: [],
  setup(props) {
    const state = getAppState();
    const map = getMap();
    const toolbar = getToolbarState();
    const toolmanager = getToolManager();

    const tool_dict = computed(() => {
      for (const toolbox in toolbar.tools) {
        if (toolbox in toolbar.toolsearch.opened) {
          continue;
        }
        toolbar.toolsearch.opened[toolbox] = true;
      }
      return toolbar.tools;
    });
    const opened = reactive({});
    onMounted(() => {
      for (const key in toolbar.toolsearch.opened) {
        opened[key] = toolbar.toolsearch.opened[key];
      }
    });
    function toggleDetails(toolbox, e) {
      toolbar.toolsearch.opened[toolbox] = e.target.open;
      opened[toolbox] = e.target.open;
    }

    const search = computed(() => {
      return toolbar.toolsearch.search;
    });
    function setSearch(term) {
      toolbar.toolsearch.search = term;
    }
    const search_list = computed(() => {
      const list = [];
      for (const toolbox in toolbar.tools) {
        const tools = toolbar.tools[toolbox];
        for (const item of tools.filter((element) =>
          element.toLowerCase().includes(search.value)
        )) {
          list.push([item, toolbox]);
        }
      }
      return list;
    });

    function setCurrTool(toolbox, tool) {
      toolbar.toolview.tool = tool;
      toolbar.toolview.toolbox = toolbox;
    }

    return {
      search,
      setSearch,
      tool_dict,
      search_list,
      setCurrTool,
      opened,
      toggleDetails,
    };
  },
};
</script>

<template>
  <div style="height: 100%">
    <TextInput
      :modelValue="search"
      @update:modelValue="setSearch"
      placeholder="Filter Tools"
    />
    <div style="height: calc(100% - 34px); padding-top: 20px">
      <n-scrollbar>
        <div v-if="search !== ''">
          <div
            class="taglist"
            v-for="[item, toolbox] in search_list"
            :key="item"
          >
            <ToolTag
              :tool="item"
              :toolbox="toolbox"
              @click="setCurrTool(toolbox, item)"
            />
          </div>
        </div>
        <div v-else>
          <details
            v-for="(tools, toolbox) in tool_dict"
            :key="toolbox"
            :open="opened[toolbox]"
            @toggle="(e) => toggleDetails(toolbox, e)"
          >
            <summary>{{ toolbox }}</summary>
            <div class="taglist" v-for="item in tools" :key="item">
              <ToolTag
                :tool="item"
                :toolbox="toolbox"
                @click="setCurrTool(toolbox, item)"
              />
            </div>
          </details>
        </div>
      </n-scrollbar>
    </div>
  </div>
</template>

<style scoped>
/* Style for the summary element */
summary {
  cursor: pointer;
  outline: none;
  padding: 5px;
  background-color: transparent;
  color: var(--text-color);
  border: none;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

/* Style for the content inside the details element */
.taglist {
  padding: 3px 0px 3px 10px;
  background-color: transparent;
}
</style>