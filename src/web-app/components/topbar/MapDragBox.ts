import { ref, reactive, computed, watch, onMounted } from 'vue'
import { VectorLayer } from '/map/VectorLayer'
import { getAppState, getMapState } from '/state';
import { topbaritem } from '/share_components/topbar/TopBarItem';
import { topbarbutton } from '/share_components/topbar/TopBarButton';
import { topbarseperator } from '/share_components/topbar/TopBarSeperator';
import { Point } from 'ol/geom';
import { Feature } from 'ol';
import { ILayer } from '/map/ILayer';

const map_dragbox = {
  components: { topbarbutton },
  props: [],
  emits: [],
  setup(props) {
    const state = getAppState();
    const map = getMapState();

    var active = computed(() => map.dragbox_active);

    function activateDragBox() {
      if (active.value) {
        map.deactivateDragBox();
      }
      else {
        map.activateDragBox();
      }
    }

    return { activateDragBox, active }
  },
  template: `
    <topbarbutton :active="active" @click="activateDragBox()">im Rechteck auswählen</topbarbutton>
    `
}

export { map_dragbox }