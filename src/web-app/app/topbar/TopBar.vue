<script lang="ts">
import { computed, ref, reactive, onMounted, defineExpose, watch, defineComponent } from 'vue';
import { getAppState } from '/state';
import { topbaritem } from '/share_components/topbar/TopBarItem';
import { topbarseperator } from '/share_components/topbar/TopBarSeperator';
import { CONFIG, TOPBARCOMPS } from "/config";
import Icon from "/share_components/bootstrap/Icon.vue";

export default {
    components: { Icon, topbaritem },
    props: [],
    setup(props) {
        const state = getAppState();

        const active = computed(() => state.topbar.active)

        const comps = computed(() => {
            const top_conf = CONFIG["app"]["topbar"]
            let comps = [];
            for (let comp of top_conf) {
                let childs = [];
                for (let child of comp["childs"]) {
                    if (child === null)
                        childs.push(topbarseperator)
                    else
                        childs.push(TOPBARCOMPS[child])
                }
                comps.push([comp["title"], childs])
            }
            return comps;
        })

        function clickOutside(e) {
            if (e["inside"] !== true) {
                state.topbar.active = null
            }
        }
        watch(active, (newA, oldA) => {
            if (oldA === null) {
                document.addEventListener("click", clickOutside)
            }
            if (newA === null) {
                document.removeEventListener("click", clickOutside)
            }
        })
        function clickInside(e) {
            e["inside"] = true
        }

        function handleClick(item: string) {
            if (state.topbar.active === item)
                state.topbar.active = null;
            else
                state.topbar.active = item;
        }

        function handleHover(item: string) {
            if (state.topbar.active === null)
                return;
            else
                state.topbar.active = item;
        }

        return { active, handleClick, handleHover, clickInside, comps }
    }
}
</script>

<template>
    <div class="topbar">
        <div class="topbaricon">
            <div style="padding: 4px 4px 4px 10px;">
                <img src="/data/assets/earth_img.png" style="height: 25px; width: 25px;"> 
            </div>
        </div>
        <div @click="clickInside">
            <topbaritem v-for="[title, childs] in comps" :name="title" :active="active === title" @click="handleClick(title)" @hover="handleHover(title)">
                <component v-for="comp in childs" :is="comp"></component>
            </topbaritem>
        </div>
    </div>
</template>

<style scoped>
.topbar {
    height: 33px;
    width: 100%;
    background-color: var(--bg-light-color);
    position: relative;
    z-index: 2;
    user-select: none;
    color: var(--text-light-color);
}

.topbar .topbaricon {
    float: left;
}
</style>