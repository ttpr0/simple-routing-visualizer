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

        const focuslayer = computed(() => {
            return map_state.focuslayer;
        })

        return { focuslayer }
    }
}
</script>

<template>
    <footerbaritem icon="mdi-bookmark-multiple" :text="focuslayer">
    </footerbaritem>
</template>

<style scoped>

</style>