import { computed, ref, reactive, watch, toRef} from 'vue';
import { getMapState } from '/state';
import './ToolParam.css'
import { VIcon } from 'vuetify/components';
import { NSlider, NSpace, NSelect, NInput, NPopover, NDynamicTags, NCheckbox, NTag } from 'naive-ui';

const toolparam = {
    components: { VIcon, NSlider, NSpace, NSelect, NInput, NPopover, NDynamicTags, NCheckbox, NTag },
    emits: [ 'update:modelValue' ],
    props: [ 'modelValue', 'param' ],
    setup(props, ctx) {
        const map_state = getMapState();

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
            map_state.layers.forEach(element => {
                if (element.type === props.param.layertype || props.param.layertype === 'any')
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
                <n-popover trigger="hover" placement="right">
                    <template #trigger>
                        <v-icon size="16">mdi-information-outline</v-icon>
                    </template>
                    <span>{{ param.info }}</span>
                </n-popover>
            </div>
        </div>
        <div class="body">
            <div v-if="param.type==='range'">
                <n-space vertical>
                    <n-slider v-model:value="value" :min="param.values[0]" :max="param.values[1]" :step="param.values[2]"/>
                </n-space>
            </div>
            <div v-if="param.type==='check'">
                <n-space vertical>
                    <n-checkbox v-model:checked="value">{{ '       ' + param.text }}</n-checkbox>
                </n-space>
            </div>
            <div v-if="param.type==='select'">
                <n-space vertical>
                    <n-select v-model:value="value" :options="param.values.map((item) => { return {label: item, value: item} })" />
                </n-space>
            </div>
            <div v-if="param.type==='multiselect'">
                <n-space vertical>
                    <n-select v-model:value="value" multiple :options="param.values.map((item) => { return {label: item, value: item} })" />
                </n-space>
            </div>
            <div v-if="param.type==='text'">
                <n-space vertical>
                    <n-input v-model:value="value" type="text" placeholder="param.text" />
                </n-space>
            </div>
            <div v-if="param.type==='list'">
                <n-dynamic-tags v-model:value="value" />
            </div>
            <div v-if="param.type==='layer'">
                <n-space vertical>
                    <n-select v-model:value="value" :options="layers.map((item) => { return {label: item, value: item} })" />
                </n-space>
            </div>
            <div v-if="param.type==='closeable_tag'">
                <n-tag closable @close="param.onClose()">
                    {{ value }}
                </n-tag>
            </div>
        </div>
    </div>
    `
} 

export { toolparam }