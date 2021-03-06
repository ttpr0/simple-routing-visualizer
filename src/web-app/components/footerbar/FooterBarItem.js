import { computed, ref, reactive, onMounted, watch} from 'vue';
import { getState } from '/store/state.js';
import { getMap } from '/map/maps.js';
import { VIcon, VSpacer } from 'vuetify/components';
import "./FooterBarItem.css"

const footerbaritem = {
    components: { },
    props: { 
        "icon": {default: null}, 
        "text": {default: null}, 
        "side": {default: "right"} 
    },
    emits: ["click"],
    setup(props, ctx) {
         
        const onclick = () => { ctx.emit('click'); }

        return {onclick}
    },
    template: `
    <div class="footerbaritem" :style="{float: side}" @click="onclick()">
        <v-icon v-if="icon != null" size=16 color="white">{{icon}}</v-icon>
        <div v-if="text != null">{{text}}</div>
    </div>
    `
} 

export { footerbaritem }