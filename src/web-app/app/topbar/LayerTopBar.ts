import { ref, reactive, computed, watch, onMounted } from 'vue'
import { VectorLayer } from '/map/VectorLayer'
import { getAppState, getMapState, getToolbarState } from '/state';
import { topbaritem } from '/components/topbar/TopBarItem';
import { topbarbutton } from '/components/topbar/TopBarButton';
import { topbarseperator } from '/components/topbar/TopBarSeperator';
import { openDirectory } from '/util/fileapi'
import { GeoJSON } from "ol/format"

const layertopbar = {
    components: { topbaritem, topbarbutton, topbarseperator },
    props: [ "active" ],
    emits: [ "click", "hover" ],
    setup(props) {
      const state = getAppState();
      const map = getMapState();
      const toolbar = getToolbarState();

      const layerdialog = ref(null);
      const tooldialog = ref(null);

      function openLayer()
      {
          var files = layerdialog.value.files;
          var reader = new FileReader();
          reader.onloadend = () => {
              var points = new GeoJSON().readFeatures(reader.result);
              var layer = new VectorLayer(points, 'Point', files[0].name.split(".")[0]);
              map.addLayer(layer);
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
            if (reader.result instanceof ArrayBuffer)
                return;
            let b64moduleData = "data:text/javascript;base64," + btoa(reader.result);
            let { toolbox } = await import(/* @vite-ignore */b64moduleData);

            toolbar.loadTools(toolbox.tools, toolbox.name);
          };
          reader.readAsText(files[0]); 
      }

      return { layerdialog, openLayer, addVectorLayer, openFolder, openToolBox, tooldialog }
    },
    template: `
    <input type="file" ref="layerdialog" style="display:none" accept=".json,.geojson" @change="openLayer">
    <input type="file" ref="tooldialog" style="display:none" accept=".jst" @change="openToolBox">
    <topbaritem name="Layers" :active="active" @click="$emit('click')" @hover="$emit('hover')">
        <topbarbutton @click="layerdialog.click()">Open File</topbarbutton>
        <topbarbutton @click="addVectorLayer">Add empty Point Layer</topbarbutton>
        <topbarbutton @click="openFolder">Open Directory</topbarbutton>
        <topbarbutton @click="tooldialog.click()">Open Toolbox</topbarbutton>
    </topbaritem>
    `
} 

export { layertopbar }