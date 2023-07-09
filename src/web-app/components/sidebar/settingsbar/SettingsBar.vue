<script lang="ts">
import { computed, ref, reactive, watch, toRef, onMounted } from "vue";
import { getAppState, getMapState } from "/state";
import { getMap } from "/map";
import { CONFIG, SIDEBARCOMPS } from "/config";
import { NSpace, NTag, NSelect, NCheckbox, NButton } from "naive-ui";


export default {
  components: { NSpace, NTag, NSelect, NCheckbox, NButton },
  props: [],
  setup(props) {
    const state = getAppState();
    const map_state = getMapState();

    const dark_mode = computed(() => {
        return state.settings.dark_mode; 
    });
    function setDarkMode(active) {
        state.settings.dark_mode = active;
    }

    watch(dark_mode, (newVal) => {
        const root = document.querySelector<HTMLElement>(':root');
        const setVariables = (vars: object) => Object.entries(vars).forEach(v => root.style.setProperty(v[0], v[1]));
        let vars = null;
        if (newVal) {
            vars = {
                "--text-color": "rgb(165, 165, 165)",
                "--text-light-color": "rgb(195, 195, 195)",
                "--text-hover-color": "white",
                "--text-theme-color": "white",
                "--theme-color": "rgb(65, 163, 170)",
                "--theme-thin-color": "rgba(65, 163, 170, 0.5)",
                "--theme-light-color": "rgb(82, 198, 206)",
                "--bg-color": "rgb(61, 61, 61)",
                "--bg-light-color": "rgb(71, 71, 71)",
                "--bg-dark-color": "rgb(51, 51, 51)",
                "--bg-hover-color": "rgb(81, 81, 81)",
                "--divider-color": "rgb(165, 165, 165)",
                "--button-color": "rgb(173, 173, 173)",
                "--button-disabled-color": "rgb(199, 198, 198)",
            };
        } else {
            vars = {
                "--text-color": "rgb(69, 68, 68)",
                "--text-light-color": "rgb(132, 131, 131)",
                "--text-hover-color": "rgb(181, 180, 180)",
                "--text-theme-color": "white",
                "--theme-color": "rgb(170, 65, 154)",
                "--theme-thin-color": "rgba(170, 65, 154, 0.5)",
                "--theme-light-color": "rgb(169, 100, 159)",
                "--bg-color": "rgb(241, 241, 241)",
                "--bg-light-color": "rgb(251, 251, 251)",
                "--bg-dark-color": "rgb(231, 231, 231)",
                "--bg-hover-color": "rgb(207, 205, 205)",
                "--divider-color": "white",
                "--button-color": "rgb(62, 60, 60)",
                "--button-disabled-color": "rgb(199, 198, 198)",
            };
        }
        setVariables(vars);
    });

    return { dark_mode, setDarkMode };
  },
};
</script>

<template>
  <div class="settingsbar">
    <n-space vertical>
        <n-checkbox
            :checked="dark_mode"
            @update:checked="(e) => setDarkMode(e)"
        >
            <p style="color: var(--text-color);">Activate Dark-Mode</p>
        </n-checkbox>
    </n-space>
  </div>
</template>

<style scoped>
.settingsbar {
  height: 100%;
  width: 100%;
  background-color: transparent;
  padding: 10px;
  overflow-y: scroll;
  scrollbar-width: thin;
}
</style>