<script lang="ts">
import { computed } from "vue";

export default {
  components: {
  },
  props: {
    "icon": {
        type: String,
    },
    "size": {
        type: String,
        default: "20px"
    },
    "color": {
        type: String,
        default: ""
    }
  },
  emits: [
    "click"
  ],
  setup(props, ctx) {
    const style = computed(() => {
        return {
            "display": "block",
            "height": props.size,
            "width": props.size,
            "font-size": props.size,
            "color": props.color,
            "background-color": "transparent",
        }
    })

    function onclick(e) {
      ctx.emit("click", e);
    } 

    return { style, onclick };
  },
};
</script>

<template>
    <i :class="icon" :style="style" @click="onclick"></i>
</template>

<style scoped>

</style>