<script lang="ts">
import { computed, ref, reactive, watch, toRef} from 'vue';
import { VectorLayer } from '/map/VectorLayer';
import { getAppState } from '/state';
import FileTree from './FileTree.vue';
import { NButton } from 'naive-ui';
import { getConnectionManager } from '/components/sidebar/filebar/ConnectionManager';
import { FileAPIConnection } from '/components/sidebar/filebar/FileAPIConnection';

export default {
    components: { NButton, FileTree },
    props: [ ],
    setup(props) {
        const state = getAppState();
        const connmanager = getConnectionManager();

        const directories = computed(() => {
            return state.filetree.connections;
        })

        async function newConnection() {
            let conn = new FileAPIConnection();
            await connmanager.addConnection(conn);
        }

        return { directories, newConnection }
    }
}
</script>

<template>
    <div class="filesbar">
        <div v-for="(value, key) in directories" :key="key">
            <FileTree :path="key + '/'" :item="directories[key]" :onclickHandler="() => {}"></FileTree>
            <div class="divider"></div>
        </div>
        <n-button @click="newConnection" dashed>
            + new Connection
        </n-button>
    </div>
</template>

<style scoped>
.filesbar {
    font-size: 16;
    height: 100%;
    width: 100%;
    background-color: transparent;
    padding: 20px;
    overflow-y: none;
    overflow-x: hidden;
    scrollbar-width: thin;
}

.filesbar .divider {
    height: 1px;
    width: 100%;
    background-color: darkgray;
    margin: 15px 0px;
}
</style>