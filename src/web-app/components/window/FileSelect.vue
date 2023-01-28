<script lang="ts">
import { computed, ref, reactive, onMounted, watch, onUnmounted} from 'vue';
import { getAppState } from '/state';
import FileTree from '../sidebar/filebar/FileTree.vue';
import { NInput } from 'naive-ui';

export default {
    components: { NInput, FileTree },
    props: [],
    setup() {
        const state = getAppState();

        const directories = computed(() => {
            return state.filetree.connections;
        })

        const selected_path = ref("");
        function onclick(path) {
            selected_path.value = path;
        }

        return { directories, selected_path, onclick }
    }
}
</script>

<template>
    <div class="fileselect">
        <div v-for="(value, key) in directories" :key="key">
            <FileTree :path="key + '/'" :item="directories[key]" :onclickHandler="onclick"></FileTree>
            <div class="divider"></div>
        </div>
        <n-input v-model:value="selected_path" type="text" placeholder="" />
    </div>
</template>

<style scoped>
.fileselect {
    width: 100%;
    height: 100%;
    resize: none;
    overflow-y: auto;
    padding: 5px;
    overflow-y: scroll;
    overflow-x: hidden;
    scrollbar-width: thin;
}

.fileselect .divider {
    height: 1px;
    width: 100%;
    background-color: darkgray;
    margin: 5px 0px;
}
</style>