import { ref, reactive, computed, watch, onMounted } from 'vue';
import { getAppState, getMapState } from '/state';
import { getMap } from '/map';
import { VectorLayer } from '/map/VectorLayer';
import { PointStyle, LineStyle, PolygonStyle } from '/map/style';
import { topbarbutton } from '/share_components/topbar/TopBarButton';
import { getConnectionManager } from '/components/sidebar/filebar/ConnectionManager';
import { getKeyFromPath, getPathFromPath } from '/util';

const add_to_map = {
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
      let path = getPathFromPath(state.contextmenu.context.path) + state.contextmenu.context.name;
      const conn = connmanager.getConnection(key);
      const geojson = await conn.openFile(path);
      const features = geojson["features"];
      console.log(features);
      const type = features[0].geometry.type;
      const layername = prompt("Please enter a Layer-Name", "");
      let layer = null;
      if (["Point", "MultiPoint"].includes(type)) {
        layer = new VectorLayer(features, "Point", layername, new PointStyle());
      }
      else if (["LineString", "MultiLineString"].includes(type)) {
        layer = new VectorLayer(features, "LineString", layername, new LineStyle());
      }
      else if (["Polygon", "MultiPolygon"].includes(type)) {
        layer = new VectorLayer(features, "Polygon", layername, new PolygonStyle());
      }
      map.addLayer(layer);
      state.contextmenu.display = false;
    }

    return { addToMap }
  },
  template: `
    <topbarbutton @click="addToMap()">Add to Map</topbarbutton>
    `
}

export { add_to_map }