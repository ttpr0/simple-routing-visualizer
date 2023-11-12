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

    function selectListener(e) {
      let count = 0;
      map.forEachFeatureAtPixel(e.pixel, function (layer: ILayer, id: number) {
        if (layer === undefined) {
          return;
        }
        count++;
        if (layer.isSelected(id)) {
          layer.unselectFeature(id);
        } else {
          layer.selectFeature(id);
        }
      });
      if (count == 0) {
        map.forEachLayer((layer) => {
          if (map.isVisibile(layer.getName())) {
            layer.unselectAll();
          }
        });
      }
    }

    let active = ref(false);
    activateSelect();

    function activateSelect() {
      if (active.value) {
        map.un("click", selectListener);
        active.value = false;
      } else {
        map.on("click", selectListener);
        active.value = true;
      }
    }

    return { activateSelect, active };
  },
};
</script>

<template>
  <topbarbutton :active="active" @click="activateSelect()"
    >Features Auswählen</topbarbutton
  >
</template>

<style scoped>
</style>