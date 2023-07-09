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

        const openAttribution = () => { window.open("https://www.vecteezy.com/free-png/earth"); }

        return { openAttribution }
    }
}
</script>

<template>
    <footerbaritem text="@Earth PNGs by Vecteezy" side="right" @click="openAttribution()">
    </footerbaritem>
</template>

<style scoped>

</style>