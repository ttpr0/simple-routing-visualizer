import { createApp, ref, reactive, onMounted, watch} from 'vue'
import "./DragableWindow.css"
import { VIcon } from 'vuetify/components';
import { NConfigProvider, darkTheme } from 'naive-ui';

const dragablewindow = {
    components: { VIcon, NConfigProvider },
    props: [ "icon", "name", "pos"],
    emits: [ "onclose" ],
    setup(props) {
        const window = ref(null);
        const windowheader = ref(null);
        const resizerheight = ref(null);
        const resizerwidth = ref(null);
        const resizer = ref(null);

        const dim = reactive({
            y: 0,
            x: 0,
        })
        watch(window, () => {
            if (window.value !== null) {
                dim.y = window.value.height
                dim.x = window.value.width
            }
        })

        let posX = props.pos[0];
        let posY = props.pos[1];
        let width = 300;
        let heigth = 400 + 30;

        onMounted(() => {
            window.value.style.width = width.toString() + "px";
            window.value.style.height = heigth.toString() + "px";
            posX = getPosX(posX);
            posY = getPosY(posY);
            window.value.style.top = posY;
            window.value.style.left = posX;

            // drag attributes
            let prevX = 0;
            let prevY = 0;
            
            // drag functions
            function getPosX(posX) {
                if (posX < 0) {
                    return 0;
                }
                let w = Number(window.value.style.width.replace("px", ""));
                if (posX+w/2 > document.body.clientWidth) {
                    return document.body.clientWidth - w/2;
                }
                return posX;
            }
            function getPosY(posY) {
                if (posY < 0) {
                    return 0;
                }
                let h = Number(window.value.style.height.replace("px", ""));
                if (posY+h/2 > document.body.clientHeight) {
                    return document.body.clientHeight - h/2;
                }
                return posY;
            }
            function dragElement(e) {
                e.preventDefault();
                prevX = e.clientX;
                prevY = e.clientY;
                document.onmouseup = closeDrag;
                document.onmousemove = dragDrag;
            }
            function dragDrag(e) {
                e.preventDefault();
                posX = posX + (e.clientX - prevX);
                posY = posY + (e.clientY - prevY);
                prevX = e.clientX;
                prevY = e.clientY;
                posX = getPosX(posX);
                posY = getPosY(posY);
                window.value.style.top = posY;
                window.value.style.left = posX;
            }
            function closeDrag() {
                document.onmouseup = null;
                document.onmousemove = null;
            }

            // add dragable
            windowheader.value.onmousedown = dragElement;

            // resizer attributes
            let start_x = 0;
            let start_y = 0;
            let start_width = 0;
            let start_height = 0;

            // resizer functions
            function resizeWidth(e) {
                e.preventDefault();
                start_x = e.clientX;
                let width = window.value.style.width;
                start_width = Number(width.replace("px", ""));
                document.body.style.cursor = "ew-resize";
                document.onmouseup = closeResize;
                document.onmousemove = dragWidth;
            }
            function resizeHeight(e) {
                e.preventDefault();
                start_y = e.clientY;
                let height = window.value.style.height;
                start_height = Number(height.replace("px", ""));
                document.body.style.cursor = "ns-resize";
                document.onmouseup = closeResize;
                document.onmousemove = dragHeight;
            }
            function resizeBoth(e) {
                e.preventDefault();
                start_x = e.clientX;
                let width = window.value.style.width;
                start_width = Number(width.replace("px", ""));
                start_y = e.clientY;
                let height = window.value.style.height;
                start_height = Number(height.replace("px", ""));
                document.body.style.cursor = "nw-resize";
                document.onmouseup = closeResize;
                document.onmousemove = (e) => {
                    dragWidth(e);
                    dragHeight(e);
                };
            }
            function dragWidth(e) {
                e.preventDefault();
                let curr_x = e.clientX;
                let new_width = start_width + curr_x - start_x;
                if (new_width < 200) {
                    return;
                }
                window.value.style.width = new_width.toString() + "px";
            }
            function dragHeight(e) {
                e.preventDefault();
                let curr_y = e.clientY;
                let new_height = start_height + curr_y - start_y;
                if (new_height < 230) {
                    return;
                }
                window.value.style.height = new_height.toString() + "px";
            }
            function closeResize() {
                document.onmouseup = null;
                document.onmousemove = null;
                document.body.style.cursor = "default";
            }

            // add resizers
            resizerwidth.value.onmousedown = resizeWidth;
            resizerheight.value.onmousedown = resizeHeight;
            resizer.value.onmousedown = resizeBoth;
        })

        return { window, windowheader, resizer, resizerheight, resizerwidth, darkTheme }
    },
    template: `
    <div class="dragablewindow" ref="window">
        <div class="dragablewindow-header" ref="windowheader">
            <div class="dragablewindow-header-info"><v-icon size=22 color="white">{{ icon }}</v-icon></div>
            <div class="dragablewindow-header-name">{{ name }}</div>
            <div class="dragablewindow-header-close" @click="$emit('onclose')"><v-icon size=24 color="white">mdi-close</v-icon></div>
        </div>
        <div class="dragablewindow-body">
            <n-config-provider :theme="darkTheme">
                <slot></slot>
            </n-config-provider>
        </div>
        <div class="resizer-right" ref="resizerwidth"></div>
        <div class="resizer-bottom" ref="resizerheight"></div>
        <div class="resizer-corner" ref="resizer"></div>
    </div>
    `
} 

export { dragablewindow }