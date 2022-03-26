import { computed, ref, reactive, onMounted, defineExpose} from 'vue';

const toolbarcomp = {
    components: { },
    props: [ "name" ],
    setup(props) {


        return {}
    },
    template: `
    <div class="toolbarcomp">
        <div class="content"><slot></slot></div>
        <div class="footer">{{ name }}</div>
    </div>
    `
} 

export { toolbarcomp }