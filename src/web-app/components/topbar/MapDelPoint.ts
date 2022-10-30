import { ref, reactive, computed, watch, onMounted } from 'vue'
import { getAppState, getMapState } from '/state';
import { topbarbutton } from '/share_components/topbar/TopBarButton';

const map_delpoint = {
  components: { topbarbutton },
  props: [],
  emits: [],
  setup(props) {
    const state = getAppState();
    const map = getMapState();

    function delpointListener(e) {
      map.forEachFeatureAtPixel(e.pixel, function (layer, id) {
        if (layer.getName() === map.focuslayer) {
          layer.removeFeature(id);
        }
      });
    }

    const active = ref(false)

    function activateDelPoint() {
      if (active.value) {
        map.un('click', delpointListener);
        active.value = false;
      }
      else {
        map.on('click', delpointListener);
        active.value = true;
      }
    }

    return { active, activateDelPoint }
  },
  template: `
    <topbarbutton :active="active" @click="activateDelPoint()">Delete Point</topbarbutton>
    `
}

export { map_delpoint }