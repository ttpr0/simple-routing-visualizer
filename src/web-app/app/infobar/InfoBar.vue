<script lang="ts">
import { computed, ref, reactive, onMounted, watch } from "vue";
import { getAppState } from "/state";
import { CONFIG, INFOBARCOMPS } from "/config";

export default {
  components: { },
  props: [],
  setup() {
    const state = getAppState();

    const comps = computed(() => {
        const info_conf = CONFIG["app"]["infobar"]
        let comps = [];
        for (let comp of info_conf) {
            comps.push([comp, INFOBARCOMPS[comp]])
        }
        return comps;
    })


    const sidebar_width = computed(() => {
      if (state.sidebar.active === "") {
        return (50).toString() + "px";
      } else {
        return (state.sidebar.width + 50).toString() + "px";
      }
    });

    const infobar_height = computed(() => {
      if (state.infobar.active === "") {
        return "0px";
      } else {
        return (state.infobar.height).toString() + "px";
      }
    });

    const resizer = ref(null);
    onMounted(() => {
        let start_y = 0;
        let start_height = 0;
        let curr_height = 0;

        resizer.value.onmousedown = dragMouseDown;
        function dragMouseDown(e) {
            e.preventDefault();
            start_y = e.clientY;
            // let width = sidebar_item.value.style.width;
            let height = state.infobar.height;
            start_height = height;
            document.body.style.cursor = "ns-resize";
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e.preventDefault();
            let curr_y = e.clientY;
            let new_height = start_height - curr_y + start_y;
            if (new_height < 200 && new_height < start_height) {
                state.infobar.height = 200;
            }
            else if (new_height > 400 && new_height > start_height) {
                state.infobar.height = 400;
            }
            else {
                curr_height = new_height;
                // sidebar_item.value.style.width = new_width.toString() + "px";
                state.infobar.height = new_height;
            }
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
            document.body.style.cursor = "default";
            if (curr_height < 200) {
                state.infobar.height = 200;
            }
            else if (curr_height > 400) {
                state.infobar.height = 400;
            }
        }
    })

    const active = computed(() => {
        return state.infobar.active;
    })
    function makeActive(name) {
        state.infobar.active = name;
    }

    return { comps, sidebar_width, infobar_height, resizer, active, makeActive };
  },
};
</script>

<template>
  <div class="infobar" v-show="active !== ''" :style="{width: `calc(100% - ${sidebar_width})`, height: infobar_height}">
    <div class="infotabs">
      <div class="infotab" v-for="[name, _] in comps" :key="name" :class="{active: active===name}" @click="makeActive(name)">{{ name }}</div>
    </div>
    <div class="infoicon">
      <v-icon size="25" theme="x-small" @click="makeActive('')">mdi-close</v-icon>
    </div>
    <div class="inforegion">
        <component v-for="[name, comp] in comps" :key="name" :is="comp" v-show="active === name"></component>
    </div>
    <div ref="resizer" class="resizer"></div>
  </div>
</template>

<style scoped>
.infobar {
    position: absolute;
    right: 0;
    bottom: 0;
    height: 100%;
    background-color: var(--bg-light-color);
}

.infotabs {
    position: relative;
    top: 0px;
    left: 0px;
    width: calc(100% - 50px);
    height: 30px;
    float: left;
}

.infobar .infoicon {
  float: right;
  height: 30px;
  width: 30px;
  padding: 5px 0px 0px 0px;
  cursor: pointer;
}

.infotab {
    position: relative;
    display: inline-block;
    width: fit-content;
    height: 30px;
    margin: 0px 5px 5px 5px;
    padding: 0px 5px 0px 5px;
    text-align: center;
    line-height: 30px;
    vertical-align: middle;
    overflow: hidden;
    color: var(--text-light-color);
    cursor: pointer;
}

.infotab.active {
    color: var(--text-color);
    border-bottom: solid 2px var(--text-color);
}

.infotab:hover {
    color: var(--text-color);
}

.inforegion {
    position: absolute;
    top: 30px;
    left: 0px;
    height: calc(100% - 30px);
    width: 100%;
    z-index: 0;
}

.infobar .resizer {
    position: absolute;
    right: 0px;
    top: 0px;
    height: 5px;
    width: 100%;
    background-color: transparent;
    float: right;
    cursor: ns-resize;
}
.infobar .resizer:hover {
    background-color: var(--theme-color);
    opacity: 0.5;
}
</style>