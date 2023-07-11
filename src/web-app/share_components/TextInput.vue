<script lang="ts">
import { createApp, ref, reactive, onMounted, computed, watch } from "vue";

export default {
  components: {
  },
  props: {
    "placeholder": {
        type: String,
        default: ""
    },
    "padding": {
        type: String,
        default: "10px"
    },
    "modelValue": {
        type: String,
        default: ""
    }
  },
  emits: [
    "update:modelValue"
  ],
  setup(props, ctx) {

    function oninput(e) {
        ctx.emit("update:modelValue", e.target.value);
    }

    return { oninput };
  }
};
</script>

<template>
    <input type="text" class="input-field" :value="modelValue" @input="oninput" :placeholder="placeholder" :style="{padding: padding}">
</template>

<style scoped>
.input-field {
  border: none;
  border-radius: 4px;
  background-color: var(--bg-color);
  color: var(--text-color);
  width: 100%;
}

.input-field:focus {
  outline: none;
  background-color: var(--bg-light-color);
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
}
</style>