<script lang="ts">
import { createApp, ref, reactive, onMounted, computed, watch } from "vue";

export default {
  components: {
  },
  props: {

  },
  emits: [
    "click"
  ],
  setup(props, ctx) {

    function onclick(e) {
        ctx.emit("click", e);
    }

    return { onclick };
  }
};
</script>

<template>
    <div class="tag" @click="onclick">
        <slot />
    </div>
</template>

<style scoped>
.tag {
  display: inline-block;
  background-color: var(--bg-color);
  color: var(--text-color);
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: fit-content;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tag:hover {
  cursor: pointer;
  background-color: var(--bg-dark-color);
}

.tag:active {
  transform: translateY(2px);
}
</style>