<script lang="ts">
import { ref, reactive, computed, watch, onMounted } from "vue";
import { getAppState, getMapState, getToolbarState } from "/state";
import { topbarbutton } from "/share_components/topbar/TopBarButton";

export default {
  components: { topbarbutton },
  props: [],
  emits: [],
  setup(props) {
    const state = getAppState();
    const map = getMapState();
    const toolbar = getToolbarState();

    const tooldialog = ref(null);

    function openToolBox() {
      state.window.show = true;
      state.window.pos = [400, 400];
      state.window.name = "File Selection";
      state.window.type = "fileselect";
      // var files = tooldialog.value.files;
      // var reader = new FileReader();
      // reader.onloadend = async () => {
      //   if (reader.result instanceof ArrayBuffer)
      //       return;
      //   let b64moduleData = "data:text/javascript;base64," + btoa(reader.result);
      //   let { toolbox } = await import(/* @vite-ignore */b64moduleData);

      //   toolbar.loadTools(toolbox.tools, toolbox.name);
      // };
      // reader.readAsText(files[0]);
    }

    return { openToolBox, tooldialog };
  },
};
</script>

<template>
  <input
    type="file"
    ref="tooldialog"
    style="display: none"
    accept=".jst"
    @change="openToolBox"
  />
  <topbarbutton @click="openToolBox()">Open Toolbox</topbarbutton>
</template>

<style scoped>
</style>