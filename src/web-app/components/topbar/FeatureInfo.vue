<script lang="ts">
import { ref, reactive, computed, watch, onMounted } from "vue";
import { getAppState } from "/state";
import { getMap } from "/map";
import { topbaritem } from "/share_components/topbar/TopBarItem";
import { topbarbutton } from "/share_components/topbar/TopBarButton";
import { topbarseperator } from "/share_components/topbar/TopBarSeperator";

export default {
  components: { topbarbutton },
  props: [],
  emits: [],
  setup(props) {
    const state = getAppState();
    const map = getMap();

    function featureinfoListener(e) {
      let features = [];
      map.forEachFeatureAtPixel(e.pixel, function (layer, id) {
        features.push(layer.getFeature(id));
      });
      if (features.length > 0) {
        state.infobar.active = "FeatureInfo";
        state.featureinfo.features = features;
      } else {
        state.featureinfo.features = features;
      }
    }

    var active = ref(false);

    function activateFeatureInfo() {
      if (active.value) {
        map.un("click", featureinfoListener);
        active.value = false;
      } else {
        map.on("click", featureinfoListener);
        active.value = true;
      }
    }

    return { active, activateFeatureInfo };
  },
};
</script>

<template>
  <topbarbutton :active="active" @click="activateFeatureInfo()"
    >Feature Info</topbarbutton
  >
</template>

<style scoped>
</style>