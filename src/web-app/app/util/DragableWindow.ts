import { createApp, ref, reactive, onMounted, watch} from 'vue'
import "./DragableWindow.css"
import { VIcon } from 'vuetify/components';

const dragablewindow = {
    components: { VIcon },
    props: [ "icon", "name", "pos"],
    emits: ["onclose"],
    setup(props) {
        const window = ref(null);
        const windowheader = ref(null);

        var posX = props.pos[0], posY = props.pos[1], prevX = 0, prevY = 0;

        onMounted(() => {
            window.value.style.top = posY;
            window.value.style.left = posX;

            windowheader.value.onmousedown = dragMouseDown;
            
            function dragMouseDown(e) {

                e.preventDefault();
                // get the mouse cursor position at startup:
                prevX = e.clientX;
                prevY = e.clientY;
                document.onmouseup = closeDragElement;
                // call a function whenever the cursor moves:
                document.onmousemove = elementDrag;
            }
            function elementDrag(e) {

                e.preventDefault();
                // calculate the new cursor position:
                posX = posX + (e.clientX - prevX);
                posY = posY + (e.clientY - prevY);
                prevX = e.clientX;
                prevY = e.clientY;
                // set the element's new position:
                if (posY < 0)
                    posY = 0;
                if (posY > (document.body.clientHeight-window.value.offsetHeight))
                    posY = document.body.clientHeight - window.value.offsetHeight;
                window.value.style.top = posY + "px";
                window.value.style.left = posX + "px";
            }
            function closeDragElement() {
                /* stop moving when mouse button is released:*/
                document.onmouseup = null;
                document.onmousemove = null;
            }
        })

        return { window, windowheader }
    },
    template: `
    <div class="dragablewindow" ref="window">
        <div class="dragablewindow-header" ref="windowheader">
            <div class="dragablewindow-header-info"><v-icon size=20 color="white">{{ icon }}</v-icon></div>
            <div class="dragablewindow-header-name">{{ name }}</div>
            <div class="dragablewindow-header-close" @click="$emit('onclose')"><v-icon size=24 color="white">mdi-close</v-icon></div>
        </div>
        <div class="dragablewindow-body">
            <slot></slot>
        </div>
    </div>
    `
} 

export { dragablewindow }