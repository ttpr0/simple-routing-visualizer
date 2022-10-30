import { ref, reactive, computed, watch, onMounted } from 'vue'
import { VectorLayer } from '/map/VectorLayer'
import { getAppState, getMapState, getToolbarState } from '/state';
import { topbarbutton } from '/share_components/topbar/TopBarButton';

const open_file = {
    components: { topbarbutton },
    props: [],
    emits: [],
    setup(props) {
      const state = getAppState();
      const map = getMapState();

      const layerdialog = ref(null);

      function openLayer()
      {
          var files = layerdialog.value.files;
          var reader = new FileReader();
          reader.onloadend = () => {
              //var points = new GeoJSON().readFeatures(reader.result);
              let features = JSON.parse(reader.result as string)["features"]
              var layer = new VectorLayer(features, 'Point', files[0].name.split(".")[0]);
              map.addLayer(layer);
          };
          reader.readAsText(files[0]); 
      }

      return { layerdialog, openLayer }
    },
    template: `
    <input type="file" ref="layerdialog" style="display:none" accept=".json,.geojson" @change="openLayer">
    <topbarbutton @click="layerdialog.click()">Open File</topbarbutton>
    `
} 

export { open_file }