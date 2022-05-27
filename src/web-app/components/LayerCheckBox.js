import { computed, ref, reactive, onMounted, defineExpose} from '/lib/vue.js'
import { layerbar } from '/components/LayerBar.js';
import { getState } from '/store/state.js';

const layercheckbox = {
    components: {  },
    props: ["layer"],
    setup(props) {
        const state = getState();

        function update() {
            state.layertree.update = !state.layertree.update;
        }

        function handleChange()
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

        function handleIconClick()
        {
            props.layer.delete();
            update();
        }

        function handleBoxClick()
        {
            state.layertree.focuslayer = props.layer.name;
        }

        const isFocus = computed(() => {
            return props.layer.name === state.layertree.focuslayer
        });

        return { handleChange, handleIconClick, handleBoxClick, isFocus }
    },
    template: `
    <div :class="[{layercheckbox:true}, {highlightlayercheckbox: isFocus}]" @click="handleBoxClick()">
        <input type="checkbox" :checked="layer.display" @change="handleChange()">
        <label >{{layer.name}}</label>
        <img class="layercheckbox-closeicon" src="/assets/proxy-image.png" alt="close" width="15" height="15" @click="handleIconClick()">
    </div>
    `
} 

export { layercheckbox }