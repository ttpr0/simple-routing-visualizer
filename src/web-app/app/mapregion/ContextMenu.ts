import { computed, ref, reactive, onMounted, watch, onUnmounted} from 'vue';
import { getAppState, getMapState } from '/state';
import { NDataTable, NConfigProvider, darkTheme } from 'naive-ui';
import { CONFIG, TOPBARCOMPS } from "/config" 
import { contextmenuitem } from '/share_components/contextmenu/ContextMenuItem';
import { topbarbutton } from '/share_components/topbar/TopBarButton';
import "ol/ol.css"
import "./MapRegion.css"
import { Overlay } from 'ol';

const contextmenu = {
    components: { contextmenuitem, topbarbutton },
    props: [],
    setup() {
        const state = getAppState();
        const map = getMapState();

        const comps = computed(() => {
            const ctx_conf = CONFIG["app"]["contextmenu"]
            let comps = [];
            for (let comp of ctx_conf) {
                comps.push(TOPBARCOMPS[comp])
            }
            return comps;
        })

        const pos = computed(() => { return state.contextmenu.pos })
        const active = computed(() => { return state.contextmenu.display })

        const clickInside = (e) => {
            e["ctx_inside"] = "nvnkjvnrni"
        }
        const clickOutside = (e) => {
            if (e["ctx_inside"] === "nvnkjvnrni") return
            state.contextmenu.display = false
        }
        const contextmenuOutside = (e) => {
            if (e["ctx_inside"] === "nvnkjvnrni") return
            state.contextmenu.display = false
        }

        watch(active, (newA) => {
            if (newA === true) {
                document.addEventListener("click", clickOutside)
                document.addEventListener("contextmenu", contextmenuOutside)
            }
            if (newA === false) {
                document.removeEventListener("click", clickOutside)
                document.removeEventListener("contextmenu", contextmenuOutside)
            }
        })

        return { comps, active, pos, clickInside }
    },
    template: `
    <contextmenuitem :active="active" :pos="pos" @click="clickInside">
        <component v-for="comp in comps" :is="comp"></component>
    </contextmenuitem>
    `
} 

export { contextmenu }