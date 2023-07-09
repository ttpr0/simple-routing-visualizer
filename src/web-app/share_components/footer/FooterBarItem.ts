import { computed, ref, reactive, onMounted, watch} from 'vue';
import { getAppState } from '/state';
import { VIcon } from 'vuetify/components';
import "./FooterBarItem.css"
import Icon from "/share_components/bootstrap/Icon.vue";

const footerbaritem = {
    components: { Icon },
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
        <div style="float: left;"><Icon v-if="icon != null" :icon="icon" size="16px" color="var(--text-theme-color)" /></div>
        <div v-if="text != null">{{text}}</div>
    </div>
    `
} 

export { footerbaritem }