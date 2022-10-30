import { computed, ref, reactive, onMounted, watch, onUnmounted} from 'vue';
import { getAppState, getMapState } from '/state';
import { NDataTable, NConfigProvider, darkTheme } from 'naive-ui';
import { CONFIG, POPUPCOMPS, SIDEBARCOMPS } from "/config" 
import "ol/ol.css"
import "./MapRegion.css"
import { Overlay } from 'ol';

const popup = {
    components: { NDataTable, NConfigProvider },
    props: [],
    setup() {
        const state = getAppState();
        const map = getMapState();

        const comp = computed(() => {
            const popup_conf = CONFIG["app"]["popup"]
            let type = state.popup.type;
            if (type === null) {
                type = "default"
            }
            let comp = POPUPCOMPS[popup_conf[type]]
            return comp;
        })

        const show = computed(() => { return state.featureinfo.display; });
        const pos = computed(() => { return state.featureinfo.pos; });

        watch([show, pos], ([newS, newP]) => {
            if (newS === true) {
                popup.setPosition(newP);
            }
            else {
                closePopup();
            }
        })

        const popup_div = ref(null)
        let popup = null;

        const closePopup = () => {
            popup.setPosition(undefined);
            state.featureinfo.display = false;
        }

        onMounted(() => {
            popup = new Overlay({
                element: popup_div.value,
            })
            map.addOverlay(popup)
        })

        onUnmounted(() => {
            map.removeOverlay(popup)
        })

        return { popup_div, closePopup, comp, darkTheme }
    },
    template: `
    <div ref="popup_div" class="popup">
        <div class="popup-header" ref="windowheader">
            <div class="popup-header-close"  @click="closePopup()">
                <v-icon size=24 color="white">mdi-close</v-icon>
            </div>
        </div>
        <n-config-provider :theme="darkTheme">
            <component :is="comp"></component>
        </n-config-provider>
    </div>
    `
} 

export { popup }