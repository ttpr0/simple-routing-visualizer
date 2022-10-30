import { ref, reactive, computed, watch, onMounted } from 'vue'
import { VectorLayer } from '/map/VectorLayer'
import { getAppState, getMapState, getToolbarState } from '/state';
import { topbarbutton } from '/share_components/topbar/TopBarButton';

const open_toolbox = {
    components: { topbarbutton },
    props: [],
    emits: [],
    setup(props) {
      const state = getAppState();
      const map = getMapState();
      const toolbar = getToolbarState();

      const tooldialog = ref(null);

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

      return { openToolBox, tooldialog }
    },
    template: `
    <input type="file" ref="tooldialog" style="display:none" accept=".jst" @change="openToolBox">
    <topbarbutton @click="tooldialog.click()">Open Toolbox</topbarbutton>
    `
} 

export { open_toolbox }