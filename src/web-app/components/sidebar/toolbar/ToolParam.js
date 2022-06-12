import { computed, ref, reactive, watch, toRef} from 'vue';
import { VectorLayer } from '/map/VectorLayer.js';
import { getState } from '/store/state.js';
import { getMap } from '/map/maps.js';
import './ToolBar.css'
import { VIcon, VTooltip, VCheckbox, VSelect, VTextField, VSlider, VCard, VCardText } from 'vuetify/components';

const toolparam = {
    components: { VIcon, VTooltip, VCheckbox, VSelect, VTextField, VSlider, VCard, VCardText },
    emits: [ 'update:modelValue' ],
    props: [ 'modelValue', 'param' ],
    setup(props, ctx) {
        const map = getMap();

        const value = computed({
            get() {
              return props.modelValue;
            },
            set(value) {
              ctx.emit('update:modelValue', value);
            }
        });

        let layers = [];
        if (props.param.type === 'layer')
        {
            map.layers.forEach(element => {
                if (element.type === props.param.layertype)
                {
                    layers.push(element.name);
                }
            }); 
        }

        return { value, layers }
    },
    template: `
    <div class="toolparam">
        <div class="header">
            <div style="display: inline-block;">{{ param.title }}</div>
            <div style="float: right;">
                <v-tooltip location='bottom'>
                    <template v-slot:activator="{ props }">
                        <v-icon v-bind="props" size="16">mdi-information-outline</v-icon>
                    </template>
                    <span>{{ param.info }}</span>
                </v-tooltip>
            </div>
        </div>
        <div class="body">
            <div v-if="param.type==='range'">
                <input type="range" id="range" v-model="value" :min="param.values[0]" :max="param.values[1]" :step="param.values[2]">
                <label for="range">{{ value }}</label>
            </div>
            <div v-if="param.type==='check'">
                <v-checkbox v-model="value" :label="param.text" density="compact"></v-checkbox>
            </div>
            <div v-if="param.type==='select'">
                <v-select v-model="value" :items="param.options" density="compact" :label="param.text"></v-select>
            </div>
            <div v-if="param.type==='text'">
                <v-text-field v-model="value" :label="param.text" clearable density="compact"></v-text-field>
            </div>
            <div v-if="param.type==='list'">
                <v-combobox v-model="value" :items="[]" :label="param.text" multiple chips density="compact" closable-chips></v-combobox>
            </div>
            <div v-if="param.type==='layer'">
                <v-select v-model="value" :items="layers" density="compact" :label="param.text"></v-select>
            </div>
        </div>
    </div>
    `
} 

export { toolparam }