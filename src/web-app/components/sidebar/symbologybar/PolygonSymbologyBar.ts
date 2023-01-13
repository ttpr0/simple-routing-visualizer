import { computed, ref, reactive, watch, toRef, onMounted} from 'vue';
import { getAppState, getMapState } from '/state';
import { getMap } from '/map';
import { NSpace, NTag, NSelect, NCheckbox, NButton, NColorPicker, NInputNumber } from 'naive-ui';
import './SymbologyBar.css'
import { PolygonStyle } from '/map/style';

const polygonsymbologybar = {
    components: { NSpace, NTag, NSelect, NCheckbox, NButton, NColorPicker, NInputNumber },
    props: [ ],
    setup(props) {
        const state = getAppState();
        const map = getMap();
        const map_state = getMapState();

        const stroke_color = ref(null);
        const width = ref(null);
        const fill_color = ref(null);
        const has_fill = ref(false);

        const active = computed(() => {
            const focuslayer = map_state.focuslayer;
            const layer = map.getLayerByName(focuslayer);
            if (layer === undefined) {
                return false;
            }
            const style = layer.getStyle() as PolygonStyle;
            if (style.constructor.name !== 'PolygonStyle') {
                return false;
            }

            stroke_color.value = style.getStrokeColor();
            width.value = style.getWidth();
            fill_color.value = style.getFillColor();
            if (style.getFillColor() === null) {
                has_fill.value = false;
            }
            else {
                has_fill.value = true;
            }

            return true;
        });

        function applyChanges() {
            const newStyle = new PolygonStyle(stroke_color.value, width.value, has_fill.value ? fill_color.value : null);
            const layer = map.getLayerByName(map_state.focuslayer);
            layer.setStyle(newStyle);
        }

        return { active, applyChanges, stroke_color, width, fill_color, has_fill }
    },
    template: `
    <n-space vertical v-if="active">
        <p>stroke-color:</p>
        <n-color-picker v-model:value="stroke_color" size="small"/>
        <p>width:</p>
        <n-input-number v-model:value="width"/>
        <n-checkbox v-model:checked="has_fill">{{ 'has fill' }}</n-checkbox>
        <p v-if="has_fill">fill-color:</p>
        <n-color-picker v-if="has_fill" v-model:value="fill_color" size="small"/>
        <n-button @click="applyChanges()">Apply</n-button>
    </n-space>
    `
} 

export { polygonsymbologybar }