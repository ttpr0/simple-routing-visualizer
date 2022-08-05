import { computed, ref, reactive, onMounted, defineExpose} from 'vue'
import { getState } from '/store/state';
import { VIcon } from 'vuetify/components';
import { getMap } from '/map/maps';

const layertreeitem = {
    components: { VIcon },
    props: ["layer"],
    setup(props) {
        const state = getState();
        const map = getMap();

        const icons = {
            'Polygon': 'mdi-vector-polygon',
            'LineString': 'mdi-vector-polyline',
            'Point': 'mdi-dots-hexagon',
        }

        function update() {
            state.layertree.update = !state.layertree.update;
        }

        function handleDisplay()
        {
            map.toggleLayer(props.layer.name);
        }

        function handleClose()
        {
            map.removeLayer(props.layer.name);
            update();
        }

        function handleClick()
        {
            state.layertree.focuslayer = props.layer.name;
        }

        const isFocus = computed(() => {
            return props.layer.name === state.layertree.focuslayer
        });

        return { handleDisplay, handleClose, handleClick, isFocus, icons, map }
    },
    template: `
    <div class="layertreeitem">
        <input type="checkbox" :checked="map.isVisibile(layer.name)" @change="handleDisplay()">
        <div :class="[{layer:true}, {highlightlayer: isFocus}]" @click="handleClick()">
            <v-icon>{{ icons[layer.type] }}</v-icon>
            <label>{{"  "+layer.name}}</label>
            <div @click="handleClose()" style="cursor: pointer;"><v-icon size=24>mdi-close</v-icon></div>
        </div>
    </div>
    `
} 

export { layertreeitem}