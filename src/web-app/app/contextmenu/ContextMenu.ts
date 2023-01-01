import { computed, ref, reactive, onMounted, watch, onUnmounted} from 'vue';
import { getAppState, getMapState } from '/state';
import { CONFIG, TOPBARCOMPS } from "/config" 
import { contextmenuitem } from '/share_components/contextmenu/ContextMenuItem';
import { topbarseperator } from '/share_components/topbar/TopBarSeperator';

const contextmenu = {
    components: { contextmenuitem },
    props: [],
    setup() {
        const state = getAppState();
        const map = getMapState();

        const comps = computed(() => {
            const ctx_conf = CONFIG["app"]["contextmenu"]
            let type = state.contextmenu.type;
            if (ctx_conf[type] === undefined) {
                return null;
            }
            let comps = [];
            for (let comp of ctx_conf[type]) {
                if (comp === null) 
                    comps.push(topbarseperator)
                else
                    comps.push(TOPBARCOMPS[comp])
            }
            return comps;
        })

        const pos = computed(() => { return state.contextmenu.pos })
        const active = computed(() => {
            if (state.contextmenu.type === null) {
                return false;
            }
            return state.contextmenu.display 
        })

        const mousedownInside = (e) => {
            e["ctx_inside"] = "nvnkjvnrni"
        }
        const mousedownOutside = (e) => {
            if (e["ctx_inside"] === "nvnkjvnrni") return
            state.contextmenu.display = false
        }
        const contextmenuOutside = (e) => {
            //if (e["ctx_inside"] === "nvnkjvnrni") return
            state.contextmenu.display = false
        }

        watch(active, (newA) => {
            if (newA === true) {
                document.addEventListener("mousedown", mousedownOutside)
                document.addEventListener("contextmenu", contextmenuOutside, true)
            }
            if (newA === false) {
                document.removeEventListener("mousedown", mousedownOutside)
                document.removeEventListener("contextmenu", contextmenuOutside)
            }
        })

        return { comps, active, pos, mousedownInside }
    },
    template: `
    <contextmenuitem :active="active" :pos="pos" @mousedown="mousedownInside">
        <component v-for="comp in comps" :is="comp"></component>
    </contextmenuitem>
    `
} 

export { contextmenu }