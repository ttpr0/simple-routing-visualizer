import { computed, ref, reactive, onMounted, defineExpose} from '/lib/vue.js'
import { layerbar } from '/components/LayerBar.js';
import { useStore } from '/lib/vuex.js';

const layercheckbox = {
    components: {  },
    props: ["layer"],
    setup(props) {
        const store = useStore();

        function update() {
            store.commit('updateLayerTree');
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
            store.commit('setFocusLayer', props.layer.name);
        }

        const isFocus = computed(() => {
            return props.layer.name === store.state.layertree.focuslayer
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