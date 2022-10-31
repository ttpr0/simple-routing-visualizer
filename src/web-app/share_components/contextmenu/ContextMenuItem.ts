import { computed, ref, reactive, onMounted, defineExpose, watch} from 'vue';
import './ContextMenuItem.css'

const contextmenuitem = {
    components: {  },
    props: [ "active", "pos" ],
    emits: [ "click", "mousedown" ],
    setup(props, ctx) {

        function onClick(e) {
            ctx.emit("click", e);
        }
        function onMouseDown(e) {
            ctx.emit("mousedown", e);
        }

        const dim = reactive({
            y: 0,
            x: 0,
        })

        const self = ref(null)

        const position = computed(() => {
            const position = {}
            let maxY = window.innerHeight - 33;
            let maxX = window.innerWidth - 20;
            let posX = props.pos[0]
            let posY = props.pos[1] - 33

            if (maxX < (posX + dim.x))
                position["right"] = maxX - posX 
            else
                position["left"] = posX

            if (maxY < (posY + dim.y)) {
                if (posY > dim.y) {
                    position["bottom"] = maxY - posY
                }
                else {
                    let top = maxY - dim.y
                    if (top > 0) {
                        position["top"] = top + 33
                    }
                    else {
                        position["top"] = 33
                        position["height"] = maxY
                        position["overflow-y"] = "scroll"
                        position["overflow-x"] = "hidden"
                        position["scrollbar-width"] = "thin"
                    }
                }
            }
            else {
                position["top"] = posY + 33
            }
            
            return position
        })

        watch(self, () => {
            if (self.value !== null) {
                dim.y = self.value.scrollHeight
                dim.x = self.value.scrollWidth
            }
        })

        return { onClick, onMouseDown, position, self }
    },
    template: `
    <div ref="self" class="contextmenu" v-if="active" :style="position" @click="onClick" @mousedown="onMouseDown">
        <slot></slot>
    </div>
    `
} 

export { contextmenuitem }