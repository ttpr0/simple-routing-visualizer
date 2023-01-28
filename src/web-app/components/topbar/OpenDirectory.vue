<script lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { getAppState, getMapState, getToolbarState } from '/state';
import { topbarbutton } from '/share_components/topbar/TopBarButton';
import { getConnectionManager } from '/components/sidebar/filebar/ConnectionManager';
import { FileAPIConnection } from '/components/sidebar/filebar/FileAPIConnection';

export default {
    components: { topbarbutton },
    props: [],
    emits: [],
    setup(props) {
      const state = getAppState();
      const map = getMapState();
      const toolbar = getToolbarState();
      const connmanager = getConnectionManager();

      async function openFolder() {
        let conn = new FileAPIConnection();
        await connmanager.addConnection(conn);
      }

      return { openFolder }
    }
}
</script>

<template>
    <topbarbutton @click="openFolder">Open Directory</topbarbutton>
</template>

<style scoped>

</style>