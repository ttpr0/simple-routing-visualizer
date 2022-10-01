import { computed, ref, reactive, onMounted, watch} from 'vue';
import { getAppState } from '/state';
import './SideBar.css'
import { layerbar } from './layerbar/LayerBar';
import { toolbar } from './toolbar/ToolBar';
import { filesbar } from './filebar/FilesBar';
import { VIcon } from 'vuetify/components';
import { NConfigProvider, darkTheme } from 'naive-ui';

const sidebar = {
    components: { layerbar, toolbar, filesbar, VIcon, NConfigProvider },
    props: [],
    setup() {
        const state = getAppState();

        const active = computed(() => state.sidebar.active )

        const resizer = ref(null);
        const sidebar_item = ref(null);

        onMounted(() => {
            let start_x = 0;
            let start_width = 0;
            let curr_width = 0;

            resizer.value.onmousedown = dragMouseDown;
            function dragMouseDown(e) {
                e.preventDefault();
                start_x = e.clientX;
                let width = sidebar_item.value.style.width;
                if (width === "")
                    start_width = 300;
                else
                    start_width = Number(width.replace("px", ""))
                document.body.style.cursor = "ew-resize";
                document.onmouseup = closeDragElement;
                document.onmousemove = elementDrag;
            }

            function elementDrag(e) {
                e.preventDefault();
                let curr_x = e.clientX;
                let new_width = start_width + curr_x - start_x;
                if (new_width < 200 && new_width < start_width)
                    sidebar_item.value.style.display = "none";
                else
                    sidebar_item.value.style.display = "block";
                curr_width = new_width;
                sidebar_item.value.style.width = new_width.toString() + "px";
            }

            function closeDragElement() {
                document.onmouseup = null;
                document.onmousemove = null;
                document.body.style.cursor = "default";
                if (curr_width < 200)
                {
                    state.sidebar.active = "";
                    sidebar_item.value.style.width = "300px";
                }
            }
        })

        function handleClick(item: string) {
            if (state.sidebar.active === item)
                state.sidebar.active = '';
            else
                state.sidebar.active = item;
        }

        return { active, handleClick, resizer, sidebar_item, darkTheme }
    },
    template: `
    <div class="sidebar">
        <div class="sidebar-tabs">
            <div :class="['sidebar-tab', {active: active === 'layers'}]" @click="handleClick('layers')"><v-icon size="40" color="gray" theme="x-small">mdi-layers-outline</v-icon></div>
            <div :class="['sidebar-tab', {active: active === 'symbology'}]" @click="handleClick('symbology')"><v-icon size="40" color="gray">mdi-brush</v-icon></div>
            <div :class="['sidebar-tab', {active: active === 'tools'}]" @click="handleClick('tools')"><v-icon size="40" color="gray">mdi-toolbox-outline</v-icon></div>
            <div :class="['sidebar-tab', {active: active === 'files'}]" @click="handleClick('files')"><v-icon size="40" color="gray">mdi-folder-arrow-up-down-outline</v-icon></div>
        </div>
        <div ref="sidebar_item" class="sidebar-item" v-show="active!==''">
            <div class="content">
                <n-config-provider :theme="darkTheme">
                    <div v-show="active === 'layers'"><layerbar></layerbar></div>
                    <div v-show="active === 'tools'"><toolbar></toolbar></div>
                    <div v-show="active === 'files'"><filesbar></filesbar></div>
                </n-config-provider>
            </div>
            <div ref="resizer" class="resizer">
            </div>
        </div>
    </div>
    `
} 

export { sidebar }