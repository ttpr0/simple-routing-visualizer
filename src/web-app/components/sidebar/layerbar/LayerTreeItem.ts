import { computed, ref, reactive, onMounted, defineExpose} from 'vue'
import { getAppState, getMapState } from '/state';
import { getMap } from '/map';
import { VIcon } from 'vuetify/components';

const layertreeitem = {
    components: { VIcon },
    props: ["layer"],
    setup(props) {
        const state = getAppState();
        const map = getMap();
        const map_state = getMapState();

        const icons = {
            'Polygon': 'mdi-vector-polygon',
            'LineString': 'mdi-vector-polyline',
            'Point': 'mdi-vector-point',
        }

        const visibile = ref(map.isVisibile(props.layer.name))

        function handleDisplay()
        {
            map.toggleLayer(props.layer.name);
            visibile.value = map.isVisibile(props.layer.name);
        }

        function handleClose()
        {
            map.removeLayer(props.layer.name);
        }

        function handleClick()
        {
            map_state.focuslayer = props.layer.name;
        }

        const isFocus = computed(() => {
            return props.layer.name === map_state.focuslayer
        });

        return { handleDisplay, handleClose, handleClick, isFocus, icons, visibile }
    },
    template: `
    <div class="layertreeitem">
        <input type="checkbox" :checked="visibile" @change="handleDisplay()">
        <div :class="[{layer:true}, {highlightlayer: isFocus}]" @click="handleClick()">
            <v-icon class="icon">{{icons[layer.type]}}</v-icon>
            <label>{{"  "+layer.name}}</label>
            <div @click="handleClose()" style="cursor: pointer;"><v-icon size=24>mdi-close</v-icon></div>
        </div>
    </div>
    `
} 

export { layertreeitem}