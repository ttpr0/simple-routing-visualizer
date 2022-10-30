import { CONFIG, FOOTERCOMPS } from "/config" 
import "./FooterBar.css"
import { computed } from "vue"

const footerbar = {
    components: {  },
    props: [],
    setup() {

        const comps = computed(() => {
            const footer_conf = CONFIG["app"]["footer"]
            let comps = []
            for (let comp of footer_conf) {
                comps.push(FOOTERCOMPS[comp])
            }
            return comps
        })

        return { comps }
    },
    template: `
    <div class="footerbar">
        <component v-for="comp in comps" :is="comp"></component>
    </div>
    `
} 

export { footerbar }