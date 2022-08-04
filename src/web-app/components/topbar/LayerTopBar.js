import { ref, reactive, computed, watch, onMounted } from 'vue'
import { VectorLayer } from '/map/VectorLayer.js'
import { getState } from '/store/state.js';
import { getMap } from '/map/maps.js';
import { getToolStore } from '/tools/toolstore.js'
import { topbarcomp } from './TopBarComp.js';
import { openDirectory } from '/util/fileapi.js'
import { GeoJSON } from "ol/format"

const layertopbar = {
    components: { topbarcomp },
    props: [ ],
    setup(props) {
      const state = getState();
      const map = getMap();
      const toolstore = getToolStore();

      const layerdialog = ref(null);
      const tooldialog = ref(null);

      function updateLayerTree() {
        state.layertree.update = !state.layertree.update;
      }

      function openLayer()
      {
          var files = layerdialog.value.files;
          var reader = new FileReader();
          reader.onloadend = () => {
              var points = new GeoJSON().readFeatures(reader.result);
              var layer = new VectorLayer(points, 'Point', files[0].name.split(".")[0]);
              map.addLayer(layer);
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
          map.addLayer(layer);
          updateLayerTree();
      }

      async function openFolder() {
        var dir = await openDirectory();
        state.filetree.connections.push(dir);
      }

      function openToolBox()
      {
          var files = tooldialog.value.files;
          var reader = new FileReader();
          reader.onloadend = async () => {
            let b64moduleData = "data:text/javascript;base64," + btoa(reader.result);
            let { toolbox } = await import(/* @vite-ignore */b64moduleData);

            toolstore.loadToolBox(toolbox);
            state.toolbox.update = !state.toolbox.update;
          };
          reader.readAsText(files[0]); 
      }

      return { layerdialog, openLayer, addVectorLayer, openFolder, openToolBox, tooldialog }
    },
    template: `
    <input type="file" ref="layerdialog" style="display:none" accept=".json,.geojson" @change="openLayer">
    <input type="file" ref="tooldialog" style="display:none" accept=".jst" @change="openToolBox">
    <topbarcomp name="Add Layers">
        <div class="container">
            <button class="bigbutton" @click="layerdialog.click()">Open<br> File</button>
        </div>
        <div class="container">
            <button class="bigbutton" @click="addVectorLayer">Add empty<br> PointLayer</button>
        </div>
        <div class="container">
            <button class="bigbutton" @click="openFolder">Open<br> Directory</button>
        </div>
        <div class="container">
            <button class="bigbutton" @click="tooldialog.click()">Open<br> ToolBox</button>
        </div>
    </topbarcomp>
    `
} 

export { layertopbar }