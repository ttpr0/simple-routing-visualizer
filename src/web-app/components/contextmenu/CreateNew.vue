<script lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue';
import { getAppState, getMapState } from '/state';
import { getMap } from '/map';
import { topbarbutton } from '/share_components/topbar/TopBarButton';

export default {
    components: { topbarbutton },
    props: [],
    emits: [],
    setup(props) {
        const state = getAppState();
        const map = getMap();
        const map_state = getMapState();

        function createNew() {
            console.log(state.contextmenu.context.path);
            state.contextmenu.display = false;
        }

        return { createNew }
    }
}
</script>

<template>
    <topbarbutton @click="createNew()">Create New</topbarbutton>
</template>

<style scoped>

</style>