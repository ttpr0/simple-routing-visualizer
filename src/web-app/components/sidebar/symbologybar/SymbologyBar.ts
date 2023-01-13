import { computed, ref, reactive, watch, toRef, onMounted} from 'vue';
import { getAppState, getMapState } from '/state';
import { getMap } from '/map';
import { NSpace, NColorPicker } from 'naive-ui';
import './SymbologyBar.css'
import { pointsymbologybar } from './PointSymbologyBar';
import { linesymbologybar } from './LineSymbologyBar';
import { polygonsymbologybar } from './PolygonSymbologyBar';

const symbologybar = {
    components: { pointsymbologybar, linesymbologybar, polygonsymbologybar },
    props: [ ],
    setup(props) {
        const state = getAppState();
        const map = getMap();
        const map_state = getMapState();

        const layer_type = computed(() => {
            const focuslayer = map_state.focuslayer;
            const layer = map.getLayerByName(focuslayer);
            if (layer === undefined) {
                return null;
            }
            return layer.getType();
        });

        return { layer_type }
    },
    template: `
    <div class="layerbar">
        <pointsymbologybar v-if="layer_type === 'Point'"></pointsymbologybar>
        <linesymbologybar v-if="layer_type === 'LineString'"></linesymbologybar>
        <polygonsymbologybar v-if="layer_type === 'Polygon'"></polygonsymbologybar>
    </div>
    `
} 

export { symbologybar }