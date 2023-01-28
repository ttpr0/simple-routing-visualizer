<script lang="ts">
import { computed, ref, reactive, onMounted, watch} from 'vue';
import { getAppState, getMapState } from '/state';
import { footerbaritem } from '/share_components/footer/FooterBarItem';

export default {
    components: { footerbaritem },
    props: [],
    setup() {
        const map = getMapState();
        const state = getAppState();

        const openOSM = () => { window.open("https://www.openstreetmap.org/copyright"); }

        return { openOSM }
    }
}
</script>

<template>
    <footerbaritem text="@OpenStreetMap contributors." side="right" @click="openOSM()">
    </footerbaritem>
</template>

<style scoped>

</style>