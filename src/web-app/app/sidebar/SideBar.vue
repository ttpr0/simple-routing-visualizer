<script lang="ts">
import { computed, ref, reactive, onMounted, watch} from 'vue';
import { getAppState } from '/state';
import { CONFIG, SIDEBARCOMPS } from "/config" 
import { VIcon } from 'vuetify/components';

export default {
    components: { VIcon },
    props: [],
    setup() {
        const state = getAppState();

        const active = computed(() => state.sidebar.active )

        const comps = computed(() => {
            const side_conf = CONFIG["app"]["sidebar"]
            let comps = [];
            for (let comp of side_conf) {
                comps.push([comp["comp"], comp["icon"], SIDEBARCOMPS[comp["comp"]]])
            }
            return comps;
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
                let width = sidebar_item.value.style.width;
                if (width === "")
                    start_width = 300;
                else
                    start_width = Number(width.replace("px", ""))
                document.body.style.cursor = "ew-resize";
                document.onmouseup = closeDragElement;
                document.onmousemove = elementDrag;
            }

            function elementDrag(e) {
                e.preventDefault();
                let curr_x = e.clientX;
                let new_width = start_width + curr_x - start_x;
                if (new_width < 200 && new_width < start_width)
                    sidebar_item.value.style.display = "none";
                else
                    sidebar_item.value.style.display = "block";
                curr_width = new_width;
                sidebar_item.value.style.width = new_width.toString() + "px";
            }

            function closeDragElement() {
                document.onmouseup = null;
                document.onmousemove = null;
                document.body.style.cursor = "default";
                if (curr_width < 200)
                {
                    state.sidebar.active = "";
                    sidebar_item.value.style.width = "300px";
                }
            }
        })

        function handleClick(item: string) {
            if (state.sidebar.active === item)
                state.sidebar.active = '';
            else
                state.sidebar.active = item;
        }

        return { active, handleClick, resizer, sidebar_item, comps }
    }
}
</script>

<template>
    <div class="sidebar">
        <div class="sidebar-tabs">
            <div v-for="[name, icon, comp] in comps" :key="name" :class="['sidebar-tab', {active: active === name}]" @click="handleClick(name)">
                <v-icon size="40" theme="x-small">
                    {{ icon }}
                </v-icon>
            </div>
        </div>
        <div ref="sidebar_item" class="sidebar-item" v-show="active!==''">
            <div class="content">
                <component v-for="[name, icon, comp] in comps" :is="comp" v-show="active === name"></component>
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
    width: 50px;
    height: 60px;
    background-color: transparent;
    color: var(--text-color);
    padding-left: 5px;
    padding-top: 10px;
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