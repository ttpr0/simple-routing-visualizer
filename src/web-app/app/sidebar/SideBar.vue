<script lang="ts">
import { computed, ref, reactive, onMounted, watch, shallowRef } from 'vue';
import { getAppState } from '/state';
import { CONFIG, SIDEBARCOMPS } from "/config" 
import Icon from "/share_components/bootstrap/Icon.vue";

export default {
    components: { Icon },
    props: [],
    setup() {
        const state = getAppState();

        const active = computed(() => state.sidebar.active );
        const active_comp = shallowRef(null);
        watch(active, (newVal) => {
            const side_conf = CONFIG["app"]["sidebar"];
            for (let comp of side_conf) {
                if (comp["comp"] === active.value) {
                    active_comp.value = SIDEBARCOMPS[comp["comp"]];
                }
            }
        });

        const comps = computed(() => {
            const side_conf = CONFIG["app"]["sidebar"]
            let comps = [];
            for (let comp of side_conf) {
                if (comp["position"] === "top" || comp["position"] === undefined) {
                    comps.push([comp["comp"], comp["icon"], SIDEBARCOMPS[comp["comp"]]]);
                }
            }
            return comps;
        })
        const bottom_comps = computed(() => {
            const side_conf = CONFIG["app"]["sidebar"]
            let comps = [];
            for (let comp of side_conf) {
                if (comp["position"] === "bottom") {
                    comps.push([comp["comp"], comp["icon"], SIDEBARCOMPS[comp["comp"]]])
                }
            }
            return comps;
        })


        const width = computed(() => {
            return state.sidebar.width.toString() + "px";
        })
        const resizer = ref(null);
        const sidebar_item = ref(null);
        onMounted(() => {
            let start_x = 0;
            let start_width = 0;
            let curr_width = 0;

            resizer.value.onmousedown = dragMouseDown;
            function dragMouseDown(e) {
                e.preventDefault();
                start_x = e.clientX;
                let width = state.sidebar.width;
                if (width === 0)
                    start_width = 300;
                else
                    start_width = width;
                document.body.style.cursor = "ew-resize";
                document.onmouseup = closeDragElement;
                document.onmousemove = elementDrag;
            }

            function elementDrag(e) {
                e.preventDefault();
                let curr_x = e.clientX;
                let new_width = start_width + curr_x - start_x;
                if (new_width < 200 && new_width < start_width) {
                    state.sidebar.width = 0;
                }
                else if (new_width > 600 && new_width > start_width) {
                    state.sidebar.width = 600;
                }
                else {
                    curr_width = new_width;
                    state.sidebar.width = new_width;
                }
            }

            function closeDragElement() {
                document.onmouseup = null;
                document.onmousemove = null;
                document.body.style.cursor = "default";
                if (state.sidebar.width < 200) {
                    state.sidebar.active = "";
                    state.sidebar.width = 300;
                }
            }
        })

        function handleClick(item: string) {
            if (state.sidebar.active === item)
                state.sidebar.active = '';
            else
                state.sidebar.active = item;
        }

        return { active, handleClick, resizer, sidebar_item, comps, width, bottom_comps, active_comp }
    }
}
</script>

<template>
    <div class="sidebar">
        <div class="sidebar-tabs">
            <div v-for="([name, icon, _], index) in comps" :key="name" :class="['sidebar-tab', {active: active === name}]" :style="{top: (index*55)+'px'}" @click="handleClick(name)">
                <div style="padding: 5px 5px 5px 5px"><Icon :icon="icon" size="30px" /></div>
            </div>
            <div v-for="([name, icon, _], index) in bottom_comps" :key="name" :class="['sidebar-tab', {active: active === name}]" :style="{bottom: (index*55)+'px'}" @click="handleClick(name)">
                <div style="padding: 5px 5px 5px 5px"><Icon :icon="icon" size="30px" /></div>
            </div>
        </div>
        <div class="sidebar-item" v-show="active!==''" :style="{width: width}">
            <div class="content">
                <component :is="active_comp"></component>
            </div>
            <div ref="resizer" class="resizer">
            </div>
        </div>
    </div>
</template>

<style scoped>
.sidebar {
    height: 100%;
    width: max-content;
    background-color: var(--bg-color);
    position: relative;
    z-index: 1;
    float: left;
}

.sidebar-tabs {
    height: 100%;
    width: 50px;
    background-color: var(--bg-color);
    position: relative;
    z-index: 1;
    float: left;
}

.sidebar-tab {
    position: absolute;
    width: 50px;
    height: 55px;
    background-color: transparent;
    color: var(--text-color);
    padding-left: 5px;
    padding-top: 5px;
    vertical-align: bottom;
}

.sidebar-tab:hover {
    color: var(--text-hover-color);
}

.sidebar-tab.active {
    border-left: 3px solid var(--theme-color);
    color: var(--text-hover-color);
}

.sidebar-item {
    position: relative;
    float: right;
    width: 300px;
    max-width: 600px;
    height: 100%;
    background-color: var(--bg-dark-color);
    z-index: 1;
}

.sidebar-item .content {
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: hidden;
    float: left;
}

.sidebar-item .resizer {
    position: absolute;
    right: 0px;
    top: 0px;
    height: 100%;
    width: 5px;
    background-color: transparent;
    float: right;
    cursor: ew-resize;
}
.sidebar-item .resizer:hover {
    background-color: var(--theme-color);
    opacity: 0.5;
}
</style>