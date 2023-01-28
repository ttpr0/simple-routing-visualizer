<script lang="ts">
import { CONFIG, FOOTERCOMPS } from "/config" 
import { computed } from "vue"

export default {
    components: {  },
    props: [],
    setup() {

        const comps = computed(() => {
            const footer_conf = CONFIG["app"]["footer"]
            let comps = []
            for (let comp of footer_conf) {
                comps.push(FOOTERCOMPS[comp])
            }
            return comps
        })

        return { comps }
    }
}
</script>

<template>
    <div class="footerbar">
        <component v-for="comp in comps" :is="comp"></component>
    </div>
</template>

<style scoped>
.footerbar {
    height: 24px;
    width: 100%;
    padding: 0px;
    position: absolute;
    bottom: 0px;
    background-color: rgb(65, 163, 170);
}
</style>