import { createApp, ref, reactive, onMounted, watch} from '/lib/vue.js'
import { layerbar } from '/components/LayerBar.js';
import { selectbar } from '/components/SelectBar.js';

const dragablewindow = {
    components: { },
    props: ["name", "pos"],
    emits: ["onclose"],
    setup(props) {
        const window = ref(null);
        const windowheader = ref(null);

        var posX = 0, posY = 0, screenX = 0, screenY = 0;

        onMounted(() => {
            window.value.style.top = props.pos[1];
            window.value.style.left = props.pos[0];

            windowheader.value.onmousedown = (e) => {
                posX = window.value.offsetLeft;
                posY = window.value.offsetTop;
                screenX = e.screenX;
                screenY = e.screenY;
                window.value.draggable = true;
            }

            window.value.ondragstart = (e) => {
                window.value.classList.add('hide');
            }

            window.value.ondragend = (e) => {
                window.value.draggable = false;
                var top = (posY + e.screenY - screenY);
                var left = (posX + e.screenX - screenX);
                if (top < 0)
                {
                    window.value.style.top = 0 + "px";
                }
                else
                {
                    window.value.style.top = top + "px";
                }
                if (left < 0)
                {
                    window.value.style.left = 0 + "px";
                }
                else
                {
                    window.value.style.left = left + "px";
                }
                window.value.classList.remove('hide');
            }
        })

        return { window, windowheader }
    },
    template: `
    <div class="dragablewindow" draggable="false" ref="window">
        <div class="dragablewindow-header" ref="windowheader">
            <div class="dragablewindow-header-name">{{ name }}</div>
            <button class="dragablewindow-header-close" @click="$emit('onclose')">&times;</button>
        </div>
        <div class="dragablewindow-body">
            <slot></slot>
        </div>
    </div>
    `
} 

export { dragablewindow }