import { computed, ref, reactive, onMounted, watch, onUnmounted} from 'vue';
import { getAppState, getMapState } from '/state';
import { NDataTable } from 'naive-ui';

const feature_info_popup = {
    components: { NDataTable },
    props: [],
    setup() {
        const state = getAppState();
        const map = getMapState();

        const data = computed(() => {
            var d = [];
            if (state.popup.feature == null)
            {
                return d;
            }
            var properties = state.popup.feature["properties"];
            for (var p in properties)
            {
              d.push({prop: p, val: String(properties[p])});
            }
            return d;
        })

        return { data }
    },
    template: `
    <div style="width: 300px; height: 235px;">
        <n-data-table
            :columns="[{title: 'Property',key: 'prop'},{title: 'Value',key: 'val'}]"
            :data="data"
            :pagination="false"
            :max-height="200"
            :width="300"
            size="small"
        />
    </div>
    `
} 

export { feature_info_popup }