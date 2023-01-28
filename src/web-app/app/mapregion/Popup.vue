<script lang="ts">
import { computed, ref, reactive, onMounted, watch, onUnmounted} from 'vue';
import { getAppState } from '/state';
import { getMap } from '/map';
import { NDataTable, NConfigProvider, darkTheme } from 'naive-ui';
import { CONFIG, POPUPCOMPS, SIDEBARCOMPS } from "/config" 
import "ol/ol.css"
import { Overlay } from 'ol';

export default {
    components: { NDataTable, NConfigProvider },
    props: [],
    setup() {
        const state = getAppState();
        const map = getMap();

        const comp = computed(() => {
            const popup_conf = CONFIG["app"]["popup"]
            let type = state.popup.type;
            if (type === null) {
                type = "default"
            }
            let comp = POPUPCOMPS[popup_conf[type]]
            return comp;
        })

        const show = computed(() => { return state.popup.display; });
        const pos = computed(() => { return state.popup.pos; });

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
            state.popup.display = false;
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
    }
}
</script>

<template>
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
</template>

<style scoped>
.popup {
    position: absolute;
    background-color: rgb(61, 61, 61);
    box-shadow: 0 1px 4px rgba(0,0,0,0.2);
    padding: 10px;
    border-radius: 5px;
    bottom: 12px;
    left: -50px;
}

.popup:after {
    top: 100%;
    border: solid transparent;
    content: " ";
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
    border-top-color: rgb(61, 61, 61);
    border-width: 10px;
    left: 48px;
    margin-left: -10px;
}

.popup-header {
    width: 100%;
    height: 16px;
}

.popup-header-close {
    float: right;
    cursor: pointer;
    margin-top: -8px;
}
</style>