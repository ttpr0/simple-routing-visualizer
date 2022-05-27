import { computed, ref, reactive, watch, toRef} from '/lib/vue.js'
import { layercheckbox } from '/components/LayerCheckBox.js'
import { pointstyle } from '/map/styles.js'
import { VectorLayer } from '/map/VectorLayer.js'
import { getState } from '/store/state.js';
import { getMap } from '../app.js'

const layerbar = {
    components: { layercheckbox },
    props: [ ],
    setup(props) {
        const filedialog = ref(null);
        const state = getState();
        const map = getMap();

        function update() {
            state.layertree.update = !state.layertree.update;
        }

        const layers = computed(() => {
            var test = state.layertree.update;
            return map.vectorlayers;
        })

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
                update();
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
            update();
        }

        return { filedialog, openfiledialog, onFileDialogChange, layers, addVectorLayer}
    },
    template: `
    <div class="layerbar">
        <input type="file" ref="filedialog" style="display:none" @change="onFileDialogChange">
        <button @click="openfiledialog">Open File</button>
        <button @click="addVectorLayer">Add empty PointLayer</button>
        <layercheckbox v-for="layer in layers" :layer="layer"></layercheckbox>
    </div>
    `
} 

export { layerbar }