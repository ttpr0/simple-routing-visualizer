<script lang="ts">
import { computed, ref, reactive, onMounted, watch} from 'vue';
import { getAppState, getMapState } from '/state';
import { footerbaritem } from '/share_components/footer/FooterBarItem';

export default {
    components: { footerbaritem },
    props: [],
    setup() {
        const map_state = getMapState();
        const state = getAppState();

        const position = computed(() => map_state.map_position )

        return { position }
    }
}
</script>

<template>
    <footerbaritem icon="bi-zoom-in" side="left" :text="position[1]">
    </footerbaritem>
</template>

<style scoped>

</style>