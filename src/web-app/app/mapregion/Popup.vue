<script lang="ts">
import { computed, ref, reactive, onMounted, watch, onUnmounted } from 'vue';
import { getAppState } from '/state';
import { getMap } from '/map';
import { NDataTable } from 'naive-ui';
import { CONFIG, POPUPCOMPS, SIDEBARCOMPS } from "/config"
import "ol/ol.css"
import { Overlay } from 'ol';

export default {
  components: { NDataTable },
  props: [],
  setup() {
    const state = getAppState();
    const map = getMap();

    const show = computed(() => { return state.popup.display; });
    const pos = computed(() => { return state.popup.pos; });

    watch([show, pos], ([newS, newP]) => {
      if (newS === true) {
        popup.setPosition(newP);
      }
      else {
        popup.setPosition(undefined);
        state.popup.display = false;
      }
    })

    const popup_div = ref(null)
    let popup = null;

    onMounted(() => {
      popup = new Overlay({
        element: popup_div.value,
      })
      map.addOverlay(popup)
    })

    onUnmounted(() => {
      map.removeOverlay(popup)
    })

    return { popup_div }
  }
}
</script>

<template>
  <div ref="popup_div" class="popup">
    <v-icon size="36" color="var(--theme-color)" theme="x-small">
      mdi-map-marker
    </v-icon>
    <div class='pulse'></div>
  </div>
</template>

<style scoped>
.popup {
  position: absolute;
  top: -36px;
  left: -18px;
  pointer-events: none;
  animation-name: bounce;
  animation-fill-mode: both;
  animation-duration: 1s;
}

.pulse {
  border-radius: 50%;
  height: 14px;
  width: 14px;
  position: absolute;
  margin: 0px 0px 0px 11px;
  transform: rotateX(55deg);
  z-index: -2;
}

.pulse:after {
  content: "";
  border-radius: 50%;
  height: 40px;
  width: 40px;
  position: absolute;
  margin: -13px 0 0 -13px;
  animation: pulsate 1s ease-out;
  animation-iteration-count: infinite;
  opacity: 0;
  box-shadow: 0 0 1px 2px var(--theme-light-color);
  animation-delay: 1.1s;
}

@keyframes pulsate {
  0% {
    transform: scale(0.1, 0.1);
    opacity: 0;
  }

  50% {
    opacity: 1;
  }

  100% {
    transform: scale(1.2, 1.2);
    opacity: 0;
  }
}

@keyframes bounce {
  0% {
    opacity: 0;
    transform: translateY(-2000px)
  }
  60% {
    opacity: 1;
    transform: translateY(30px);
  }
  80% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0);
  }
}
</style>