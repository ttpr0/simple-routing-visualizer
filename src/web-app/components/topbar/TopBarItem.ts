import { computed, ref, reactive, onMounted, defineExpose} from 'vue';
import './TopBarItem.css'

const topbaritem = {
    components: {  },
    props: [ "name", "active" ],
    emits: [ "click", "hover" ],
    setup(props, ctx) {

        function onclick() {
            ctx.emit("click");
        }
        function onhover() {
            ctx.emit("hover");
        }

        return { onclick, onhover }
    },
    template: `
    <div :class="[{active: active}, {topbaritem: true}]">
        <div class="tab" @click="onclick()" @mouseover="onhover()">{{ name }}</div>
        <div class="menu" v-if="active">
            <slot></slot>
        </div>
    </div>
    `
} 

export { topbaritem }