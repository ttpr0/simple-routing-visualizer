import { computed, ref, reactive, watch, toRef} from 'vue';
import { VectorLayer } from '/map/VectorLayer';
import { getState } from '/store/state';
import { getMap } from '/map/maps';
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
                <input type="checkbox" v-model="value" id="cbx" :checked="param.default">
                <label for="cbx">{{ '       ' + param.text }}</label>
            </div>
            <div v-if="param.type==='select'">
                <select v-model="value">
                    <option v-for="opt in param.values">{{ opt }}</option>
                </select>
            </div>
            <div v-if="param.type==='text'">
                <input type="text" v-model="value" :placeholder="param.text">
            </div>
            <div v-if="param.type==='list'">
                <v-combobox v-model="value" :items="[]" :label="param.text" multiple chips density="compact" closable-chips></v-combobox>
            </div>
            <div v-if="param.type==='layer'">
                <select v-model="value">
                    <option v-for="layer in layers">{{ layer }}</option>
                </select>
            </div>
        </div>
    </div>
    `
} 

export { toolparam }