import { computed, ref, reactive, onMounted, watch} from 'vue';
import { getAppState, getMapState } from '/state';
import { VIcon, VSpacer } from 'vuetify/components';
import "./FooterBar.css"
import { footerbaritem } from './FooterBarItem';

const footerbar = {
    components: { VIcon, VSpacer, footerbaritem},
    props: [],
    setup() {

        const map = getMapState();
        const state = getAppState();

        const focuslayer = computed(() => {
            return map.focuslayer;
        })

        const position = computed(() => map.map_position )


        const openOSM = () => { window.open("https://www.openstreetmap.org/copyright"); }


        return {focuslayer, position, openOSM}
    },
    template: `
    <div class="footerbar">
        <footerbaritem text="@OpenStreetMap contributors." side="right" @click="openOSM()"></footerbaritem>
        <footerbaritem icon="mdi-bookmark-multiple" :text="focuslayer"></footerbaritem>
        <footerbaritem icon="mdi-axis-arrow" :text="position[0]"></footerbaritem>
        <footerbaritem icon="mdi-contrast-box" :text="position[1]"></footerbaritem>
    </div>
    `
} 

export { footerbar }