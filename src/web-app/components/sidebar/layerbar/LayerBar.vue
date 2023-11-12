<script lang="ts">
import { computed, ref, reactive, watch, toRef } from "vue";
import LayerTreeItem from "./LayerTreeItem.vue";
import { getAppState, getMapState } from "/state";

export default {
  components: { LayerTreeItem },
  props: [],
  setup(props) {
    const state = getAppState();
    const map_state = getMapState();

    const layers = computed(() => map_state.layers);

    return { layers };
  },
};
</script>

<template>
  <div class="layerbar">
    <LayerTreeItem
      v-for="layer in layers"
      :key="layer.name"
      :layer="layer"
    ></LayerTreeItem>
  </div>
</template>

<style scoped>
.layerbar {
  height: 100%;
  width: 100%;
  background-color: transparent;
  padding: 10px;
  overflow-y: scroll;
  scrollbar-width: thin;
}
</style>