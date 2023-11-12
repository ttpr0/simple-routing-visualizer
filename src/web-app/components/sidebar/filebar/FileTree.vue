<script lang="ts">
import { computed, ref, reactive, watch, toRef } from "vue";
import { getAppState } from "/state";
import FileTreeItem from "./FileTreeItem.vue";
import { getTree, closeDirectory } from "/util/file_api/fileapi";

export default {
  name: "FileTree",
  components: { FileTreeItem },
  props: ["path", "item", "onclickHandler"],
  setup(props, ctx) {
    const state = getAppState();

    const open = ref(false);

    function onRightClick(e) {
      state.contextmenu.pos = [e.pageX, e.pageY];
      state.contextmenu.display = true;
      state.contextmenu.context.path = props.path;
      state.contextmenu.context.name = props.item.name;
      state.contextmenu.context.type = props.item.type;
      if (props.item.type === "dir") {
        if (props.path.split("/").length === 2) {
          state.contextmenu.type = "filetree:root-dir";
        } else {
          state.contextmenu.type = "filetree:dir";
        }
      } else if (["vector", "raster"].includes(props.item.type)) {
        state.contextmenu.type = "filetree:layer";
      } else {
        state.contextmenu.display = false;
      }
    }

    function onClick() {
      props.onclickHandler(props.path + props.item.name);
      open.value = !open.value;
    }

    return { open, onClick, onRightClick };
  },
};
</script>

<template>
  <div class="filetree">
    <FileTreeItem
      :path="path"
      :name="item.name"
      :type="item.type"
      :open="open"
      @click="onClick()"
      @contextmenu="onRightClick"
    ></FileTreeItem>
    <div class="children" v-if="item.children !== undefined && open">
      <FileTree
        v-for="child in item.children"
        :key="child.name"
        :path="path + item.name + '/'"
        :item="child"
        :onclickHandler="onclickHandler"
      ></FileTree>
    </div>
  </div>
</template>

<style scoped>
.filetree {
  width: fit-content;
  height: fit-content;
  position: relative;
}

.filetree .children {
  position: relative;
  left: 20px;
}
</style>