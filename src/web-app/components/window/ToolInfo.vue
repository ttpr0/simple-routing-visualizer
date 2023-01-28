<script lang="ts">
import { computed, ref, reactive, onMounted, watch, onUnmounted} from 'vue';
import { getToolbarState } from '/state';

export default {
    components: { },
    props: [],
    setup() {
        const toolbar = getToolbarState();

        const toolinfo = computed(() => {
            return toolbar.toolinfo;
        });

        return { toolinfo }
    }
}
</script>

<template>
    <div class="tooltext">
        <span v-html="toolinfo.text"></span>
    </div>
</template>

<style scoped>
.tooltext {
    width: 100%;
    height: 100%;
    resize: none;
    overflow-y: auto;
    padding: 5px;
    overflow-y: scroll;
    overflow-x: hidden;
    scrollbar-width: thin;
}
</style>