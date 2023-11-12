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
import { PointStyle } from "/map/styles";

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
    const radius = ref(null);
    const point_type = ref(null);
    const points = ref(null);
    const inner_radius = ref(null);

    const active = computed(() => {
      const focuslayer = map_state.focuslayer;
      const layer = map.getLayerByName(focuslayer);
      if (layer === undefined) {
        return false;
      }
      const style = layer.getStyle() as PointStyle;
      if (style.constructor.name !== "PointStyle") {
        return false;
      }

      color.value = style.getColor();
      radius.value = style.getRadius();
      point_type.value = style.getType();
      points.value = style.getPoints();
      inner_radius.value = style.getInnerRadius();

      return true;
    });

    function applyChanges() {
      const newStyle = new PointStyle(
        color.value,
        radius.value,
        point_type.value,
        points.value,
        inner_radius.value
      );
      const layer = map.getLayerByName(map_state.focuslayer);
      layer.setStyle(newStyle);
    }

    return {
      active,
      applyChanges,
      color,
      radius,
      point_type,
      points,
      inner_radius,
    };
  },
};
</script>

<template>
  <n-space vertical v-if="active">
    <p>color:</p>
    <n-color-picker v-model:value="color" size="small" />
    <p>radius:</p>
    <n-input-number v-model:value="radius" />
    <p>type:</p>
    <n-select
      v-model:value="point_type"
      :options="[
        { label: 'polygon', value: 'polygon' },
        { label: 'circle', value: 'circle' },
        { label: 'star', value: 'star' },
      ]"
    />
    <p v-if="point_type !== 'circle'">points:</p>
    <n-input-number v-if="point_type !== 'circle'" v-model:value="points" />
    <p v-if="point_type === 'star'">inner radius:</p>
    <n-input-number v-if="point_type === 'star'" v-model:value="inner_radius" />
    <n-button @click="applyChanges()">Apply</n-button>
  </n-space>
</template>

<style scoped>
</style>