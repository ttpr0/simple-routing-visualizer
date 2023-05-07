<script lang="ts">
import { computed, ref, reactive, watch, toRef, onMounted } from "vue";
import { DragBox } from "ol/interaction";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import Feature from "ol/Feature.js";
import Polygon from "ol/geom/Polygon.js";
import { toLonLat, get as getProjection } from "ol/proj";
import { Style, Stroke, Fill } from "ol/style";
import { getAppState, getMapState } from "/state";
import { getMap } from "/map";
import { CONFIG, POPUPCOMPS, SIDEBARCOMPS } from "/config";
import { NSpace, NTag, NSelect, NCheckbox, NButton } from "naive-ui";
import { getRouting } from "/routing/api";
import { AccessibilityStyle } from "./AccessibilityStyle";
import { GridLayer } from "/map/layer/raster/GridLayer";
import { RasterStyle } from "/map/style";
import { getIsoRaster } from "/external/api";

const dragBox = new DragBox({
  condition: (e) => {
    return e.originalEvent.ctrlKey;
  },
});
const layer = new VectorLayer({
  source: new VectorSource({
    features: [],
  }),
});

export default {
  components: { NSpace, NTag, NSelect, NCheckbox, NButton },
  props: [],
  setup(props) {
    const state = getAppState();
    const map_state = getMapState();
    const map = getMap();

    const area_selection = ref("");
    const area_extent = ref(null);
    const calc_type = ref("isochrones");

    const time = ref(0);

    function onClose() {
      CONFIG["app"]["sidebar"] = CONFIG["app"]["sidebar"].filter(
        (elem) => elem.comp !== "AccessibilityBar"
      );
      state.sidebar.active = "";
    }

    function activateOwnArea(newVal) {
      if (newVal === true) {
        area_selection.value = "area";
        dragBox.on("boxend", () => {
          let extent = dragBox.getGeometry().getExtent();

          const projection = getProjection("EPSG:3857");
          const ll = toLonLat([extent[0], extent[1]], projection);
          const ur = toLonLat([extent[2], extent[3]], projection);

          area_extent.value = null;
          area_extent.value = [ll[0], ll[1], ur[0], ur[1]];
          map.olmap.removeLayer(layer);
          const feature = new Feature({
            geometry: new Polygon([
              [
                [ll[0], ll[1]],
                [ll[0], ur[1]],
                [ur[0], ur[1]],
                [ur[0], ll[1]],
              ],
            ]),
            name: "ownAreaExtent",
          });
          const source = new VectorSource({
            features: [feature],
            useSpatialIndex: false,
          });

          layer.setSource(source);
          layer.setZIndex(1000);
          layer.setVisible(true);
          map.olmap.addLayer(layer);
        });
        map.addInteraction(dragBox);
      } else {
        area_selection.value = "";
        area_extent.value = null;
        map.removeInteraction(dragBox);
        map.olmap.removeLayer(layer);
      }
    }

    async function onRun() {
      const layer = map.getLayerByName(map_state.focuslayer);
      let selectedfeatures = layer.getSelectedFeatures();
      if (selectedfeatures.length > 300) {
        alert("pls mark less than 300 features!");
        return;
      }
      if (selectedfeatures.length == 0) {
        alert("you have to mark at least one feature!");
        return;
      }

      // let ranges = [180, 420, 900, 1800];
      let ranges = [60, 180, 300, 420, 540, 660, 780, 900];
      let factors = [1.0, 0.8, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1];
      let locations = [];
      for (let id of selectedfeatures) {
        locations.push(layer.getGeometry(id).coordinates);
      }
      let envelope = area_extent.value;
      let mode = calc_type.value;
      if (mode === null) {
        mode = "isochrones";
      }

      let start = new Date().getTime();

      const request = {
        facility_locations: locations,
        ranges: ranges,
        range_factors: factors,
        envelop: envelope,
        mode: mode,
        range: 300,
        compute_type: "mean",
        population: {
          envelop: envelope,
        },
      };

      const response = await fetch("http://localhost:5000/v1/fca/grid", {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: JSON.stringify(request),
      });

      // var response = await fetch("https://localhost:5000/v1/accessibility/multi", {
      //     method: 'POST',
      //     mode: 'cors',
      //     cache: 'no-cache',
      //     credentials: 'same-origin',
      //     headers: {
      //         'Content-Type': 'application/json',
      //     },
      //     redirect: 'follow',
      //     referrerPolicy: 'no-referrer',
      //     body: JSON.stringify({
      //         "infrastructures": {
      //             "hospitals": {
      //                 "infrastructure_weight": 1,
      //                 "facility_locations": locations,
      //                 "ranges": ranges,
      //                 "range_factors": factors
      //             }
      //         }
      //     })
      // });

      let end = new Date().getTime();
      time.value = end - start;

      let geojson = await response.json();
      console.log(geojson);

      let style = new RasterStyle(
        "accessibility",
        [255, 0, 0, 0.6],
        [0, 255, 0, 0.6],
        [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
      );
      let vec_layer = new GridLayer(
        geojson.features,
        geojson.extend,
        geojson.size,
        "accessibility",
        "EPSG:25832",
        style
      );

      map.addLayer(vec_layer);
    }

    return { onClose, onRun, activateOwnArea, area_selection, time, calc_type };
  },
};
</script>

<template>
  <div class="accessibilitybar">
    <n-space vertical>
      <n-space vertical align="start">
        <n-checkbox
          :checked="area_selection === 'all'"
          :disabled="area_selection === 'area'"
          @update:checked="
            (e) =>
              e === true ? (area_selection = 'all') : (area_selection = '')
          "
        >
          Niedersachsenweite Analyse
        </n-checkbox>
        <n-checkbox
          :checked="area_selection === 'area'"
          :disabled="area_selection === 'all'"
          @update:checked="(e) => activateOwnArea(e)"
        >
          Eigene Gebietsselektion
        </n-checkbox>
      </n-space>
      <n-space vertical>
        <n-select
          v-model:value="calc_type"
          :options="[
            { label: 'Isochronen', value: 'isochrones' },
            { label: 'Matrix', value: 'matrix' },
            { label: 'IsoRaster', value: 'isoraster' },
          ]"
        />
      </n-space>
    </n-space>
    <br />
    <n-space horizontal align="end" justify="space-between">
      <n-button @click="onClose()"> Close </n-button>
      <n-button @click="onRun()"> Run </n-button>
    </n-space>
    <br />
    <n-tag>Calculation took: {{ time }} ms</n-tag>
  </div>
</template>

<style scoped>
.accessibilitybar {
  height: 100%;
  width: 100%;
  background-color: transparent;
  padding: 10px;
  overflow-y: scroll;
  scrollbar-width: thin;
}
</style>