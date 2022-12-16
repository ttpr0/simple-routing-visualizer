import { computed, ref, reactive, onMounted, watch} from 'vue';
import { getAppState, getMapState } from '/state';
import { footerbaritem } from '/share_components/footer/FooterBarItem';

const zoom = {
    components: { footerbaritem },
    props: [],
    setup() {
        const map_state = getMapState();
        const state = getAppState();

        const position = computed(() => map_state.map_position )

        return { position }
    },
    template: `
    <footerbaritem icon="mdi-contrast-box" :text="position[1]">
    </footerbaritem>
    `
} 

export { zoom }