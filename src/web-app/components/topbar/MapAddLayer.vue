<script lang="ts">
import { ref, reactive, computed, watch, onMounted } from "vue";
import { PointLayer } from "/map/layers";
import { getAppState, getToolbarState } from "/state";
import { getMap } from "/map";
import { topbarbutton } from "/share_components/topbar/TopBarButton";

export default {
  components: { topbarbutton },
  props: [],
  emits: [],
  setup(props) {
    const state = getAppState();
    const map = getMap();

    function addVectorLayer() {
      var layername = "";
      while (layername == "") {
        var layername = prompt("Please enter a Layer-Name", "");
        if (layername == null) {
          return;
        }
      }
      var layer = new PointLayer([], layername);
      map.addLayer(layer);
    }

    return { addVectorLayer };
  },
};
</script>

<template>
  <topbarbutton @click="addVectorLayer">Add empty Point Layer</topbarbutton>
</template>

<style scoped>
</style>