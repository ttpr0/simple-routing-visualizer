<script lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue';
import { getAppState, getMapState } from '/state';
import { getMap } from '/map';
import { topbarbutton } from '/share_components/topbar/TopBarButton';
import { getConnectionManager } from '/components/sidebar/filebar/ConnectionManager';
import { getKeyFromPath } from '/util/file_api';

export default {
    components: { topbarbutton },
    props: [],
    emits: [],
    setup(props) {
        const state = getAppState();
        const connmanager = getConnectionManager();

        function refreshConnection() {
            const key = getKeyFromPath(state.contextmenu.context.path);
            connmanager.refreshConnection(key);
            state.contextmenu.display = false;
        }

        return { refreshConnection }
    }
}
</script>

<template>
    <topbarbutton @click="refreshConnection()">Refresh</topbarbutton>
</template>

<style scoped>

</style>