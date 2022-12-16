import { ref, reactive, computed, watch, onMounted } from 'vue'
import { getAppState, getMapState } from '/state';
import { getMap } from '/map';
import { topbarbutton } from '/share_components/topbar/TopBarButton';

const map_addpoint = {
  components: { topbarbutton },
  props: [],
  emits: [],
  setup(props) {
    const state = getAppState();
    const map = getMap();
    const map_state = getMapState();

    function addpointListener(e) {
      var layer = map.getLayerByName(map_state.focuslayer);
      if (layer == null) {
        alert("pls select a layer to add point to!");
        return;
      }
      var feature = {
        type: "Feature",
        geometry: { type: "Point", coordinates: e.coordinate },
        name: 'new Point',
      };
      layer.addFeature(feature);
    }

    var active = ref(false);

    function activateAddPoint() {
      if (active.value) {
        map.un('click', addpointListener);
        active.value = false;
      }
      else {
        map.on('click', addpointListener);
        active.value = true;
      }
    }

    return { active, activateAddPoint }
  },
  template: `
    <topbarbutton :active="active" @click="activateAddPoint()">Add Point</topbarbutton>
    `
}

export { map_addpoint }