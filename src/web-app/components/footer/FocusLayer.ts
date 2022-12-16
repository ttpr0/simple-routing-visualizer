import { computed, ref, reactive, onMounted, watch} from 'vue';
import { getAppState, getMapState } from '/state';
import { footerbaritem } from '/share_components/footer/FooterBarItem';

const focus_layer = {
    components: { footerbaritem },
    props: [],
    setup() {
        const map_state = getMapState();
        const state = getAppState();

        const focuslayer = computed(() => {
            return map_state.focuslayer;
        })

        return { focuslayer }
    },
    template: `
    <footerbaritem icon="mdi-bookmark-multiple" :text="focuslayer">
    </footerbaritem>
    `
} 

export { focus_layer }