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
  NSlider,
} from "naive-ui";
import { GridStyle } from "/map/styles";
import { GridLayer } from "/map/layers/raster/GridLayer";

export default {
  components: {
    NSpace,
    NTag,
    NSelect,
    NCheckbox,
    NButton,
    NColorPicker,
    NInputNumber,
    NSlider,
  },
  props: [],
  setup(props) {
    const state = getAppState();
    const map = getMap();
    const map_state = getMapState();

    const attribute = ref(null);
    const start_color = ref(null);
    const end_color = ref(null);
    const classes = ref(0);
    const attribute_options = ref([]);

    const active = computed(() => {
      const focuslayer = map_state.focuslayer;
      const layer = map.getLayerByName(focuslayer);
      if (layer === undefined) {
        return false;
      }
      const style = layer.getStyle() as GridStyle;
      if (style.constructor.name !== "RasterStyle") {
        return false;
      }
      const s = style.start_color;
      start_color.value = `rgba(${s[0]},${s[1]},${s[2]},${s[3]})`;
      const e = style.end_color;
      end_color.value = `rgba(${e[0]},${e[1]},${e[2]},${e[3]})`;
      attribute.value = style.attribute;
      classes.value = style.colors.length;
      const options = [];
      for (let id of layer.getAllFeatures()) {
        for (let item in layer.getFeature(id).properties) {
          options.push({ label: item, value: item });
        }
        break;
      }
      attribute_options.value = options;

      return true;
    });

    function transform_color(color) {
      const t = color.replace("rgba(", "").replace(")", "").split(",");
      const rgba = [];
      for (let i of t) {
        rgba.push(parseInt(i));
      }
      rgba[3] = parseFloat(t[3]);
      return rgba;
    }

    function applyChanges() {
      let min = Infinity;
      let max = -Infinity;
      const layer = map.getLayerByName(map_state.focuslayer) as GridLayer;
      const attr = attribute.value;
      for (let node of layer.features.getAllNodes()) {
        const value = node.value[attr];
        if (value === -9999) {
          continue;
        }
        if (value < min) min = value;
        if (value > max) max = value;
      }
      const ranges = [];
      const delta = (max - min) / classes.value;
      for (let i = 0; i < classes.value; i++) {
        ranges.push(min + i * delta);
      }
      const newStyle = new RasterStyle(
        attribute.value,
        transform_color(start_color.value),
        transform_color(end_color.value),
        ranges
      );
      layer.setStyle(newStyle);
    }

    return {
      active,
      applyChanges,
      start_color,
      end_color,
      attribute,
      classes,
      attribute_options,
    };
  },
};
</script>

<template>
  <n-space vertical v-if="active">
    <p>type:</p>
    <n-select v-model:value="attribute" :options="attribute_options" />
    <p>start color:</p>
    <n-color-picker v-model:value="start_color" size="small" />
    <p>end color:</p>
    <n-color-picker v-model:value="end_color" size="small" />
    <p>classes:</p>
    <n-slider v-model:value="classes" :min="1" :max="16" :step="1" />
    <n-button @click="applyChanges()">Apply</n-button>
  </n-space>
</template>

<style scoped>
</style>