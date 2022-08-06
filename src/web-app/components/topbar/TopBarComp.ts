import { computed, ref, reactive, onMounted, defineExpose} from 'vue';
import './TopBarComp.css'

const topbarcomp = {
    components: {  },
    props: [ "name" ],
    setup(props) {

        return {}
    },
    template: `
    <div class="topbarcomp">
        <div class="content"><slot></slot></div>
        <div class="footer">{{ name }}</div>
    </div>
    `
} 

export { topbarcomp }