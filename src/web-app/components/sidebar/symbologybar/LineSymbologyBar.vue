<script lang="ts">
import { computed, ref, reactive, watch, toRef, onMounted } from "vue";
import { getAppState, getMapState } from "/state";
import { getMap } from "/map";
import {
  NSpace,
  NTag,
  NSelect,
  NCheckbox,
  NButton,
  NColorPicker,
  NInputNumber,
} from "naive-ui";
import { LineStyle } from "/map/styles";

export default {
  components: {
    NSpace,
    NTag,
    NSelect,
    NCheckbox,
    NButton,
    NColorPicker,
    NInputNumber,
  },
  props: [],
  setup(props) {
    const state = getAppState();
    const map = getMap();
    const map_state = getMapState();

    const color = ref(null);
    const width = ref(null);

    const active = computed(() => {
      const focuslayer = map_state.focuslayer;
      const layer = map.getLayerByName(focuslayer);
      if (layer === undefined) {
        return false;
      }
      const style = layer.getStyle() as LineStyle;
      if (style.constructor.name !== "LineStyle") {
        return false;
      }

      color.value = style.getColor();
      width.value = style.getWidth();

      return true;
    });

    function applyChanges() {
      const newStyle = new LineStyle(color.value, width.value);
      const layer = map.getLayerByName(map_state.focuslayer);
      layer.setStyle(newStyle);
    }

    return { active, applyChanges, color, width };
  },
};
</script>

<template>
  <n-space vertical v-if="active">
    <p>color:</p>
    <n-color-picker v-model:value="color" size="small" />
    <p>width:</p>
    <n-input-number v-model:value="width" />
    <n-button @click="applyChanges()">Apply</n-button>
  </n-space>
</template>

<style scoped>
</style>