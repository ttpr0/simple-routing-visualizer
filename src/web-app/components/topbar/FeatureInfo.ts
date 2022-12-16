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

const feature_info = {
  components: { topbarbutton },
  props: [],
  emits: [],
  setup(props) {
    const state = getAppState();
    const map = getMap();

    function setFeatureInfo(feature, pos, display) {
      if (feature != null) state.popup.feature = feature;
      if (pos != null) state.popup.pos = pos;
      if (display != null) state.popup.display = display;
    }

    function featureinfoListener(e) {
      let features = [];
      map.forEachFeatureAtPixel(e.pixel, function (layer, id) {
        features.push(layer.getFeature(id));
      });
      if (features.length > 0) {
        setFeatureInfo(features[0], features[0].geometry.coordinates, true);
      }
      else {
        setFeatureInfo(null, null, false);
      }
    }

    var active = ref(false);

    function activateFeatureInfo() {
      if (active.value) {
        map.un('click', featureinfoListener);
        active.value = false;
      }
      else {
        map.on('click', featureinfoListener);
        active.value = true;
      }
    }

    return { active, activateFeatureInfo }
  },
  template: `
    <topbarbutton :active="active" @click="activateFeatureInfo()">Feature Info</topbarbutton>
    `
}

export { feature_info }