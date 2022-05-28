import { computed, ref, reactive, onMounted, watch} from 'vue';
import { getState } from '/store/state.js';
import { getMap } from '/map/maps.js';
import { VIcon, VSpacer } from 'vuetify/components';
import "./FooterBar.css"
import { footerbaritem } from './FooterBarItem.js';

const footerbar = {
    components: { VIcon, VSpacer, footerbaritem},
    props: [],
    setup() {

        const map = getMap();
        const state = getState();

        const focuslayer = computed(() => {
            return state.layertree.focuslayer;
        })

        const position = computed(() => {
            var s = state.map.moved;
            var view = map.olmap.getView();
            var s = view.getCenter();
            var center = String(s[0])+ "; " + String(s[1])
            var zoom = view.getZoom();
            return [center, zoom]
        })


        const openOSM = () => { window.open("https://www.openstreetmap.org/copyright"); }


        return {focuslayer, position, openOSM}
    },
    template: `
    <div class="footerbar">
        <footerbaritem text="@OpenStreetMap contributors." side="right" @click="openOSM()"></footerbaritem>
        <footerbaritem icon="mdi-bookmark-multiple" :text="focuslayer"></footerbaritem>
        <footerbaritem icon="mdi-axis-arrow" :text="position[0]"></footerbaritem>
        <footerbaritem icon="mdi-contrast-box" :text="position[1]"></footerbaritem>
        <footerbaritem text="{ }  Javascript"></footerbaritem>
    </div>
    `
} 

export { footerbar }