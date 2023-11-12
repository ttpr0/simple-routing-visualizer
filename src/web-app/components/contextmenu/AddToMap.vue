<script lang="ts">
import { ref, reactive, computed, watch, onMounted } from "vue";
import { getAppState, getMapState } from "/state";
import { getMap } from "/map";
import { PointLayer, LineStringLayer, PolygonLayer } from "/map/layers";
import { PointStyle, LineStyle, PolygonStyle } from "/map/style";
import { topbarbutton } from "/share_components/topbar/TopBarButton";
import { getConnectionManager } from "/components/sidebar/filebar/ConnectionManager";
import { getKeyFromPath, getPathFromPath } from "/util/file_api";

export default {
  components: { topbarbutton },
  props: [],
  emits: [],
  setup(props) {
    const state = getAppState();
    const map = getMap();
    const map_state = getMapState();
    const connmanager = getConnectionManager();

    async function addToMap() {
      let key = getKeyFromPath(state.contextmenu.context.path);
      let path =
        getPathFromPath(state.contextmenu.context.path) +
        state.contextmenu.context.name;
      const conn = connmanager.getConnection(key);
      const geojson = await conn.openFile(path);
      const features = geojson["features"];
      console.log(features);
      const type = features[0].geometry.type;
      const layername = prompt("Please enter a Layer-Name", "");
      let layer = null;
      if (["Point", "MultiPoint"].includes(type)) {
        layer = new PointLayer(features, layername);
      } else if (["LineString", "MultiLineString"].includes(type)) {
        layer = new LineStringLayer(features, layername);
      } else if (["Polygon", "MultiPolygon"].includes(type)) {
        layer = new PolygonLayer(features, layername);
      }
      map.addLayer(layer);
      state.contextmenu.display = false;
    }

    return { addToMap };
  },
};
</script>

<template>
  <topbarbutton @click="addToMap()">Add to Map</topbarbutton>
</template>

<style scoped>
</style>