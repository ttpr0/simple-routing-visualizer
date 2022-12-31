import { computed, ref, reactive, onMounted, watch, onUnmounted} from 'vue';
import { getToolbarState } from '/state';
import "./ToolInfo.css"

const basic_tool_info = {
    components: { },
    props: [],
    setup() {
        const toolbar = getToolbarState();

        const toolinfo = computed(() => {
            return toolbar.toolinfo;
        });

        return { toolinfo }
    },
    template: `
    <div class="tooltext">
        <span v-html="toolinfo.text"></span>
    </div>
    `
} 

export { basic_tool_info }