<script lang="ts">
import { createApp, ref, reactive, onMounted, computed, watch } from "vue";

function sleep (ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default {
  components: {
  },
  props: {
    "progress": {
        type: Number,
        default: 0
    },
    "animation": Boolean,
    "color": {
        type: String,
        default: "#a34caf"
    },
    "height": {
        type: String,
        default: "10px"
    }
  },
  setup(props) {

    const prog_comp= ref(null);

    const progress = computed(() => {
        return props.progress;
    });
    const animation = computed(() => {
        return props.animation;
    });
    const running = ref(false);

    async function runAnimation() {
        while (animation.value) {
            if (prog_comp.value === null) {
                await sleep(100);
                continue
            }
            prog_comp.value.style.transition = "";
            await sleep(5);
            if (prog_comp.value === null) {
                await sleep(100);
                continue
            }
            prog_comp.value.style.width = "0%";
            await sleep(5);
            if (prog_comp.value === null) {
                await sleep(100);
                continue
            }
            prog_comp.value.style.left = "0%";
            await sleep(5);
            if (prog_comp.value === null) {
                await sleep(100);
                continue
            }
            prog_comp.value.style.transition = "width 0.7s ease-in-out, left 0.7s ease-in-out";
            await sleep(5);
            if (prog_comp.value === null) {
                await sleep(100);
                continue
            }
            prog_comp.value.style.width = "100%";
            await sleep(400);
            if (prog_comp.value === null) {
                await sleep(100);
                continue
            }
            prog_comp.value.style.left = "100%";
            await sleep(800);
            if (prog_comp.value === null) {
                await sleep(100);
                continue
            }
            prog_comp.value.style.transition = "";
            await sleep(5);
            if (prog_comp.value === null) {
                await sleep(100);
                continue
            }
            prog_comp.value.style.width = "0%";
            await sleep(5);
            if (prog_comp.value === null) {
                await sleep(100);
                continue
            }
            prog_comp.value.style.left = "0%";
            await sleep(5);
        }
    }

    watch(animation, async (newVal) => {
        if (newVal && !running.value) {
            running.value = true;
            await runAnimation();
            running.value = false;
        }
    });

    onMounted(async () => {
        if (animation.value && !running.value) {
            running.value = true;
            await runAnimation();
            running.value = false;
        }
    })

    return { prog_comp, running, progress };
  }
};
</script>

<template>
    <div class="progress-bar" :style="{height: height}">
        <div class="progress" :style="{'background-color': color, width: progress+'%', display: animation?'none':'block'}"></div>
        <div ref="prog_comp" class="progress" :style="{'background-color': color,  display: animation?'block':'none'}"></div>
    </div>
</template>

<style scoped>
.progress-bar {
  width: 100%;
  background-color: transparent;
  position: relative;
}

.progress {
  height: 100%;
  position: absolute;
  top: 0;
}
</style>