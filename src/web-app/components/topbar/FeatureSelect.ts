import { ref, reactive, computed, watch, onMounted } from 'vue'
import { VectorLayer } from '/map/VectorLayer'
import { getAppState } from '/state';
import { getMap } from '/map';
import { topbaritem } from '/share_components/topbar/TopBarItem';
import { topbarbutton } from '/share_components/topbar/TopBarButton';
import { topbarseperator } from '/share_components/topbar/TopBarSeperator';
import { Point } from 'ol/geom';
import { Feature } from 'ol';
import { ILayer } from '/map/ILayer';

const feature_select = {
  components: { topbarbutton },
  props: [],
  emits: [],
  setup(props) {
    const state = getAppState();
    const map = getMap();

    function selectListener(e) {
      var count = 0;
      map.forEachFeatureAtPixel(e.pixel, function (layer: ILayer, id: number) {
        count++;
        if (layer.isSelected(id)) {
          layer.unselectFeature(id);
        }
        else {
          layer.selectFeature(id);
        }
      });
      if (count == 0) {
        map.forEachLayer(layer => {
          if (map.isVisibile(layer.getName())) {
            layer.unselectAll();
          }
        })
      }
    }

    var active = ref(false);
    activateSelect();

    function activateSelect() {
      if (active.value) {
        map.un('click', selectListener);
        active.value = false;
      }
      else {
        map.on('click', selectListener);
        active.value = true;
      }
    }

    return { activateSelect, active }
  },
  template: `
    <topbarbutton :active="active" @click="activateSelect()">Features Auswählen</topbarbutton>
    `
}

export { feature_select }