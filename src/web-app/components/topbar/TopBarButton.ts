import { computed, ref, reactive, onMounted, defineExpose, withCtx} from 'vue';
import './TopBarButton.css'

const topbarbutton = {
    components: {  },
    props: [ "active" ],
    emits: [ "click" ],
    setup(props, ctx) {

        function onclick() {
            ctx.emit("click");
        }

        return { onclick }
    },
    template: `
    <button :class="[{highlight: active},{topbarbutton:true}]" @click="onclick()">
        <slot></slot>
    </button>
    `
} 

export { topbarbutton }