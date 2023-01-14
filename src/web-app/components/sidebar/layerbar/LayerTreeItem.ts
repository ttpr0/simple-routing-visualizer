import { computed, ref, reactive, onMounted, defineExpose} from 'vue'
import { getAppState, getMapState } from '/state';
import { getMap } from '/map';
import { VIcon } from 'vuetify/components';
import './LayerBar.css'

const layertreeitem = {
    components: { VIcon },
    props: ["layer"],
    setup(props) {
        const state = getAppState();
        const map = getMap();
        const map_state = getMapState();

        const item = ref(null);

        onMounted(() => {
            item.value.addEventListener("contextmenu", (e) => {
                state.contextmenu.pos = [e.pageX, e.pageY]
                state.contextmenu.display = true
                state.contextmenu.context.layer = props.layer.name;
                state.contextmenu.type = "layertree"
                e.preventDefault()
            });
        });

        const isFocus = computed(() => {
            return props.layer.name === map_state.focuslayer
        });

        const visibile = ref(map.isVisibile(props.layer.name))

        function handleDisplay()
        {
            map.toggleLayer(props.layer.name);
            visibile.value = map.isVisibile(props.layer.name);
        }

        function handleClick()
        {
            map_state.focuslayer = props.layer.name;
        }

        function handleMoveUp() {
            map.increaseZIndex(props.layer.name);
        }
        function handleMoveDown() {
            map.decreaseZIndex(props.layer.name);
        }

        return { handleDisplay, handleClick, handleMoveUp, handleMoveDown, isFocus, visibile, item }
    },
    template: `
    <div :class="[{layertreeitem:true}, {highlight: isFocus}]">
        <div class="check">
            <input type="checkbox" :checked="visibile" @change="handleDisplay()">
        </div>
        <div class="layer" @click="handleClick()" ref="item">
            {{"  "+layer.name}}
        </div>
        <div class="arrows">
            <v-icon class="icon" @click="handleMoveDown">mdi-arrow-down-thin-circle-outline</v-icon>
            <v-icon class="icon" @click="handleMoveUp">mdi-arrow-up-thin-circle-outline</v-icon>
        </div>
    </div>
    `
} 

export { layertreeitem}