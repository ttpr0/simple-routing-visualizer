import { computed, ref, reactive, onMounted, defineExpose} from 'vue'
import { getState } from '/store/state.js';
import { VIcon } from 'vuetify/components';

const layertreeitem = {
    components: { VIcon },
    props: ["layer"],
    setup(props) {
        const state = getState();

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
            if (props.layer.display)
            {
                props.layer.displayOff();
            }
            else
            {
                props.layer.displayOn();
            }
        }

        function handleClose()
        {
            props.layer.delete();
            update();
        }

        function handleClick()
        {
            state.layertree.focuslayer = props.layer.name;
        }

        const isFocus = computed(() => {
            return props.layer.name === state.layertree.focuslayer
        });

        return { handleDisplay, handleClose, handleClick, isFocus, icons }
    },
    template: `
    <div class="layertreeitem">
        <input type="checkbox" :checked="layer.display" @change="handleDisplay()">
        <div :class="[{layer:true}, {highlightlayer: isFocus}]" @click="handleClick()">
            <v-icon>{{ icons[layer.type] }}</v-icon>
            <label>{{"  "+layer.name}}</label>
            <div @click="handleClose()" style="cursor: pointer;"><v-icon size=24>mdi-close</v-icon></div>
        </div>
    </div>
    `
} 

export { layertreeitem}