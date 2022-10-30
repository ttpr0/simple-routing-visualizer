import { computed, ref, reactive, onMounted, watch} from 'vue';
import { getAppState, getMapState } from '/state';
import { footerbaritem } from '/share_components/footer/FooterBarItem';

const osm_link = {
    components: { footerbaritem },
    props: [],
    setup() {
        const map = getMapState();
        const state = getAppState();

        const openOSM = () => { window.open("https://www.openstreetmap.org/copyright"); }

        return { openOSM }
    },
    template: `
    <footerbaritem text="@OpenStreetMap contributors." side="right" @click="openOSM()">
    </footerbaritem>
    `
} 

export { osm_link }