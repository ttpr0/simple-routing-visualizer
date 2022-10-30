import { ref, reactive, computed, watch, onMounted } from 'vue'
import { VectorLayer } from '/map/VectorLayer'
import { getAppState, getMapState, getToolbarState } from '/state';
import { topbarbutton } from '/share_components/topbar/TopBarButton';

const map_addlayer = {
    components: { topbarbutton },
    props: [],
    emits: [],
    setup(props) {
      const state = getAppState();
      const map = getMapState();

      function addVectorLayer() {
          var layername = "";
          while (layername == "")
          {
              var layername = prompt("Please enter a Layer-Name", "");
              if (layername == null)
              {
                  return;
              }
          }
          var layer = new VectorLayer([], "Point", layername);
          map.addLayer(layer);
      }

      return { addVectorLayer }
    },
    template: `
    <topbarbutton @click="addVectorLayer">Add empty Point Layer</topbarbutton>
    `
} 

export { map_addlayer }