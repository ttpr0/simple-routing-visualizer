import { ref, reactive, computed, watch, onMounted } from 'vue'
import { VectorLayer } from '/map/VectorLayer.js'
import { pointstyle, highlightpointstyle } from "/map/styles.js";
import { useStore } from 'vuex';
import { getMap } from '/map/maps.js';
import { toolbarcomp } from './ToolBarComp.js';

const layertoolbar = {
    components: { toolbarcomp },
    props: [ ],
    setup(props) {
      const store = useStore();
      const map = getMap();

      const filedialog = ref(null);

      function updateLayerTree() {
          store.commit('updateLayerTree');
      }

      function openfiledialog() {
          filedialog.value.click();
      }

      function onFileDialogChange()
      {
          var files = filedialog.value.files;
          var reader = new FileReader();
          reader.onloadend = () => {
              var points = new ol.format.GeoJSON().readFeatures(reader.result);
              var layer = new VectorLayer(points, 'Point', files[0].name.split(".")[0]);
              map.addVectorLayer(layer);
              updateLayerTree();
          };
          reader.readAsText(files[0]); 
      }

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
          var layer = new VectorLayer([], 'Point', layername);
          map.addVectorLayer(layer);
          updateLayerTree();
      }

      return { filedialog, openfiledialog, onFileDialogChange, addVectorLayer}
    },
    template: `
    <div class="layertoolbar">
        <input type="file" ref="filedialog" style="display:none" @change="onFileDialogChange">
        <toolbarcomp name="Add Layers">
            <div class="container">
                <button class="bigbutton" @click="openfiledialog">Open<br> File</button>
            </div>
            <div class="container">
                <button class="bigbutton" @click="addVectorLayer">Add empty<br> PointLayer</button>
            </div>
        </toolbarcomp>
    </div>
    `
} 

export { layertoolbar }