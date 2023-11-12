<script lang="ts">
import { computed, ref, reactive, watch, toRef } from "vue";
import { getAppState } from "/state";
import Icon from "/share_components/bootstrap/Icon.vue";

export default {
  components: { Icon },
  props: ["path", "name", "type", "open"],
  emits: ["click", "contextmenu"],
  setup(props, ctx) {
    const state = getAppState();

    let icon_open = "bi-file-earmark-textt";
    let icon_close = "bi-file-earmark-text";
    if (props.type === "dir") {
      icon_open = "bi-folder2-open";
      icon_close = "bi-folder";
    }
    if (["src"].includes(props.type)) {
      icon_open = "bi-file-earmark-code";
      icon_close = "bi-file-earmark-code";
    }
    if (["img"].includes(props.type)) {
      icon_open = "bi-file-earmark-image";
      icon_close = "bi-file-earmark-image";
    }
    if (["vector"].includes(props.type)) {
      icon_open = "bi-bezier";
      icon_close = "bi-bezier";
    }
    if (["raster"].includes(props.type)) {
      icon_open = "bi-border-all";
      icon_close = "bi-border-all";
    }
    if (["gpkg"].includes(props.type)) {
      icon_open = "bi-box-seam";
      icon_close = "bi-box-seam";
    }

    const item = ref(null);

    function onClick() {
      item.value.classList.add("clicked");
      setTimeout(() => {
        item.value.classList.value = ["filetreeitem"];
      }, 300);
      ctx.emit("click");
    }

    function onContextmenu(e) {
      ctx.emit("contextmenu", e);
    }

    return { onClick, onContextmenu, icon_close, icon_open, item };
  },
};
</script>

<template>
  <div
    class="filetreeitem"
    ref="item"
    @click="onClick"
    @contextmenu.prevent="onContextmenu"
  >
    <div class="icon">
      <Icon
        :icon="open ? icon_open : icon_close"
        size="18px"
        color="var(--button-color)"
      />
    </div>
    <div class="text">
      <p>{{ name }}</p>
    </div>
  </div>
</template>

<style scoped>
.filetreeitem {
  margin: 0px 0px 5px 0px;
  padding: 0px 5px 0px 5px;
  height: 27px;
  width: max-content;
  border-radius: 2px;
  border-width: 1px;
  border-style: dashed;
  border-color: transparent;
  color: var(--button-color);
  user-select: none;
  cursor: pointer;

  transition: color 0.2s;
  transition: border 0.4s;
}

.filetreeitem:hover {
  color: var(--theme-color);
  border-color: var(--theme-light-color);
  transition: color 0.2s;
  transition: border 0.6s;
}

.filetreeitem.clicked {
  color: var(--theme-color);
  border-color: var(--theme-light-color);
  transition: color 0.2s;
  transition: border 0.6s;
  box-shadow: 0px 0px 4px var(--theme-light-color);
  transition: box-shadow 0.3s;
}

.filetreeitem .icon {
  width: 20px;
  display: inline-block;
}

.filetreeitem .text {
  width: fit-content;
  display: inline-block;
}
</style>