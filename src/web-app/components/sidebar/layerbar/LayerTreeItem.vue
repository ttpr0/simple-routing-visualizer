<script lang="ts">
import { computed, ref, reactive, onMounted, defineExpose} from 'vue'
import { getAppState, getMapState } from '/state';
import { getMap } from '/map';
import { VIcon } from 'vuetify/components';

export default {
    components: { VIcon },
    props: ["layer"],
    setup(props) {
        const state = getAppState();
        const map = getMap();
        const map_state = getMapState();

        const item = ref(null);

        onMounted(() => {
            item.value.addEventListener("contextmenu", (e) => {
                state.contextmenu.pos = [e.pageX, e.pageY]
                state.contextmenu.display = true
                state.contextmenu.context.layer = props.layer.name;
                state.contextmenu.type = "layertree"
                e.preventDefault()
            });
        });

        const isFocus = computed(() => {
            return props.layer.name === map_state.focuslayer
        });

        const visibile = ref(map.isVisibile(props.layer.name))

        function handleDisplay()
        {
            map.toggleLayer(props.layer.name);
            visibile.value = map.isVisibile(props.layer.name);
        }

        function handleClick()
        {
            map_state.focuslayer = props.layer.name;
        }

        function handleMoveUp() {
            map.increaseZIndex(props.layer.name);
        }
        function handleMoveDown() {
            map.decreaseZIndex(props.layer.name);
        }

        return { handleDisplay, handleClick, handleMoveUp, handleMoveDown, isFocus, visibile, item }
    }
}
</script>

<template>
    <div :class="[{layertreeitem:true}, {highlight: isFocus}]">
        <div class="check">
            <input type="checkbox" :checked="visibile" @change="handleDisplay()">
        </div>
        <div class="layer" @click="handleClick()" ref="item">
            {{"  "+layer.name}}
        </div>
        <div class="arrows">
            <v-icon class="icon" @click="handleMoveDown">mdi-arrow-down-thin-circle-outline</v-icon>
            <v-icon class="icon" @click="handleMoveUp">mdi-arrow-up-thin-circle-outline</v-icon>
        </div>
    </div>
</template>

<style scoped>
.layertreeitem {
    padding: 5px 0px;
    width: calc(100% - 20px);
    height: 35px;
    margin: 5px 10px;
    color: var(--text-color);
}
.layertreeitem.highlight {
    background-color: var(--theme-color);
    color: var(--text-theme-color);
}

.layertreeitem .check {
    float: left;
    width: 25px;
    height: 25px;
}
.layertreeitem .check input {
    width: 15px;
    height: 15px;
    margin-top: 4px;
    margin-left: 5px;
}

.layertreeitem .layer {
    width: calc(100% - 75px);
    height: 25px;
    float: left;
    cursor: default;
    overflow: hidden;
    text-overflow: ellipsis;
}
  
.layertreeitem .arrows {
    float: right;
    width: 50px;
    height: 25px;
}
.layertreeitem .arrows .icon {
    cursor: pointer;
}
</style>