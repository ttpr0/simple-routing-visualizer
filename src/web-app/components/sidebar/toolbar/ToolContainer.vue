<script lang="ts">
import { computed, ref, reactive, watch, toRef } from "vue";
import { getAppState, getToolbarState } from "/state";
import Icon from "/share_components/bootstrap/Icon.vue";
import ProgressBar from "/share_components/ProgressBar.vue";

export default {
  components: { Icon, ProgressBar },
  emits: ["close", "run", "info"],
  props: ["tool", "toolbox"],
  setup(props, ctx) {
    const state = getAppState();
    const toolbar = getToolbarState();

    const onclose = () => {
      ctx.emit("close");
    };

    const onrun = () => {
      ctx.emit("run");
    };

    const oninfo = () => {
      ctx.emit("info");
    };

    const running = computed(() => {
      if (
        toolbar.currtool.tool === props.tool &&
        toolbar.currtool.toolbox === props.toolbox
      ) {
        return toolbar.currtool.state === "running";
      } else {
        return false;
      }
    });

    const error = computed(() => {
      if (
        toolbar.currtool.tool === props.tool &&
        toolbar.currtool.toolbox === props.toolbox
      ) {
        return toolbar.currtool.state === "error";
      } else {
        return false;
      }
    });

    const finished = computed(() => {
      if (
        toolbar.currtool.tool === props.tool &&
        toolbar.currtool.toolbox === props.toolbox
      ) {
        return toolbar.currtool.state === "finished";
      } else {
        return false;
      }
    });

    const disableinfo = computed(() => {
      if (
        toolbar.currtool.tool !== props.tool ||
        toolbar.currtool.toolbox !== props.toolbox
      ) {
        return true;
      } else {
        return false;
      }
    });

    const disablerun = computed(() => {
      return toolbar.currtool.state === "running";
    });

    return {
      onclose,
      onrun,
      oninfo,
      running,
      disablerun,
      disableinfo,
      error,
      finished,
    };
  },
};
</script>

<template>
  <div class="toolcontainer">
    <div class="header">
      <div class="icon"><Icon icon="bi-arrow-left" @click="onclose()" /></div>
      <div style="width: calc(100% - 24px); float: right; height: 30px">
        <p
          style="
            display: inline-block;
            width: 100%;
            text-align: center;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          "
        >
          {{ tool }} ({{ toolbox }})
        </p>
      </div>
    </div>
    <div class="body" style="overflow-y: auto">
      <slot></slot>
    </div>
    <div class="footer">
      <div
        :style="{
          width: '100%',
          display: running || finished || error ? 'block' : 'none',
        }"
      >
        <ProgressBar
          height="5px"
          :animation="running"
          :progress="100"
          :color="error ? 'red' : 'var(--theme-color)'"
        />
      </div>
      <!-- <v-progress-linear model-value="100" :active="running || finished || error" :indeterminate="running" :color="error ? 'red' : 'var(--theme-color)'"></v-progress-linear> -->
      <button
        class="info"
        @click="oninfo()"
        style="float= left;"
        :disabled="disableinfo"
      >
        <Icon
          icon="bi-info-circle"
          size="20px"
          color="var(--text-theme-color)"
        />
      </button>
      <button class="run" @click="onrun()" :disabled="disablerun">
        Run Tool
      </button>
    </div>
  </div>
</template>

<style scoped>
.toolcontainer {
  position: relative;
  width: 100%;
  height: 100%;
}

.toolcontainer .header {
  width: 100%;
  height: 30px;
}

.toolcontainer .header .icon {
  float: left;
  cursor: pointer;
}

.toolcontainer .body {
  width: 100%;
  height: calc(100% - 80px);
  scrollbar-width: thin;
}

.toolcontainer .footer {
  width: 100%;
  height: 50px;
  position: absolute;
  bottom: 0px;
}

.toolcontainer .footer .run {
  border-radius: 5px;
  background-color: var(--theme-color);
  color: var(--text-theme-color);
  margin-top: 15px;
  padding: 5px;
  float: right;
  cursor: pointer;
}
.toolcontainer .footer .run:disabled {
  background-color: var(--button-disabled-color);
}

.toolcontainer .footer .info {
  border-radius: 5px;
  background-color: var(--theme-color);
  margin-top: 15px;
  padding: 5px;
  float: left;
  cursor: pointer;
}
.toolcontainer .footer .info:disabled {
  background-color: var(--button-disabled-color);
}
</style>