import { computed, ref, reactive, onMounted, watch} from 'vue';
import { getAppState, getMapState } from '/state';
import { footerbaritem } from '/share_components/footer/FooterBarItem';

const focus_layer = {
    components: { footerbaritem },
    props: [],
    setup() {
        const map = getMapState();
        const state = getAppState();

        const focuslayer = computed(() => {
            return map.focuslayer;
        })

        return { focuslayer }
    },
    template: `
    <footerbaritem icon="mdi-bookmark-multiple" :text="focuslayer">
    </footerbaritem>
    `
} 

export { focus_layer }