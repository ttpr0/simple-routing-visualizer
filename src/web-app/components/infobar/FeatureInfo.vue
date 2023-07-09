<script lang="ts">
import { computed, ref, reactive, onMounted, watch, onUnmounted} from 'vue';
import { getAppState, getMapState } from '/state';
import { NDataTable } from 'naive-ui';
import Icon from "/share_components/bootstrap/Icon.vue";

export default {
    components: { NDataTable, Icon },
    props: [],
    setup() {
        const state = getAppState();
        const map = getMapState();

        const index = ref(0);

        const features = computed(() => {
            index.value = 0;
            return state.featureinfo.features;
        });

        const hasNext = computed(() => {
            return index.value < features.value.length - 1;
        });

        const hasPrev = computed(() => {
            return index.value > 0;
        });

        function next() {
            if (hasNext.value) index.value++;
        }

        function prev() {
            if (hasPrev.value) index.value--;
        }

        const feature = computed(() => {
            if (features.value.length > index.value) {
                let feature = features.value[index.value];
                state.popup.pos = feature.geometry.coordinates;
                state.popup.display = true;
                return feature;
            }
            else {
                state.popup.display = false;
                return null;
            }
        });

        onUnmounted(() => {
            state.popup.display = false;
            state.window.context.features = [];
        });

        const data = computed(() => {
            var d = [];
            if (feature.value == null)
            {
                return d;
            }
            var properties = feature.value["properties"];
            for (var p in properties)
            {
              d.push({prop: p, val: String(properties[p])});
            }
            return d;
        })

        return { data, next, prev, hasNext, hasPrev };
    }
}
</script>

<template>
    <div class="featureinfo">
        <div class="body">
            <n-data-table
                :columns="[{title: 'Property',key: 'prop'},{title: 'Value',key: 'val'}]"
                :data="data"
                :pagination="false"
                size="small"
            />
        </div>
        <div class="footer">
            <div class="footerpart">
                <button :class="{disabled: !hasPrev}" :disabled="!hasPrev" @click="prev()"><Icon icon="bi-arrow-left" size="24px" /></button>
            </div>
            <div class="footerpart">
                <button :class="{disabled: !hasNext}" :disabled="!hasNext" @click="next()"><Icon icon="bi-arrow-right" size="24px" /></button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.featureinfo {
    width: 100%;
    height: 100%;
    resize: none;
    padding: 5px;
}

.footer {
    padding-top: 5px;
}
.footer .footerpart {
    display: inline-block;
    width: 50%;
}
.footer button {
    width: 100%;
    color: var(--theme-color);
    display: flex;
    justify-content: center;
}
.footer button.disabled {
    color: var(--text-color);
}
.footer button:hover {
    background-color: var(--bg-hover-color);
}
.footer button.disabled:hover {
    background-color: var(--bg-color);
}

.body {
    height: calc(100% - 29px);
    overflow-y: scroll;
    scrollbar-width: thin;
}
</style>