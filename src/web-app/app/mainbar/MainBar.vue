<script lang="ts">
import { computed, ref, reactive, onMounted, watch } from "vue";
import { getAppState } from "/state";
import { getMap } from "/map";
import MapRegion from "/app/mapregion/MapRegion.vue";

export default {
  components: { MapRegion },
  props: [],
  setup() {
    const state = getAppState();
    const map = getMap();

    const tabs = reactive(["Map"]);

    const sidebar_width = computed(() => {
      if (state.sidebar.active === "") {
        return (50).toString() + "px";
      } else {
        return (state.sidebar.width + 50).toString() + "px";
      }
    });

    const infobar_height = computed(() => {
      if (state.infobar.active === "") {
        return "0px";
      } else {
        return (state.infobar.height).toString() + "px";
      }
    });

    return { tabs, sidebar_width, infobar_height };
  },
};
</script>

<template>
  <div class="mainbar" :style="{width: `calc(100% - ${sidebar_width})`, height: `calc(100% - ${infobar_height})`}">
    <!-- <div class="maintabs">
      <div class="maintab" v-for="name in tabs" :key="name">{{ name }}</div>
    </div> -->
    <div class="mainregion">
      <MapRegion></MapRegion>
    </div>
  </div>
</template>

<style scoped>
.mainbar {
  position: absolute;
  right: 0;
  top: 0;
}

.maintabs {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 30px;
  background-color: var(--bg-color);
}

.maintab {
  position: relative;
  display: inline-block;
  width: 70px;
  height: 30px;
  text-align: center;
  line-height: 30px;
  vertical-align: middle;
  overflow: hidden;
  color: var(--text-color);
  font-weight: 600;
  background-color: var(--button-disabled-color);
}

.maintab:hover {
  cursor: pointer;
}

.mainregion {
  position: absolute;
  top: 0px;
  left: 0px;
  height: calc(100% - 0px);
  width: 100%;
  z-index: 0;
}
</style>