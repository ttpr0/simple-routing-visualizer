<script>

function sleep (ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default {
    components: {
    },
    props: {
        "title": {
            type: String,
            default: ""
        },
        "opened": Boolean,
        "status": {
            type: String,
            default: ""
        }
    },
    emits: [
        "click"
    ],
    data () {
        return {
            collapsing: false
        };
    },
    computed: {
        buttonStyle () {
            if (this.status === "deactivated") {
                return {"background-color": "rgba(220,220,220,0.3)"};
            }
            if (this.status === "valid") {
                return {"background-color": "rgba(144,228,144,0.3)"};
            }
            if (this.status === "invalid") {
                return {"background-color": "rgba(255,0,0,0.3)"};
            }
            return {};
        }
    },
    watch: {
        async opened (newVal) {
            this.$refs.content.classList = "accordion-content collapsing";
            this.collapsing = true;
            this.$refs.content.style.height = newVal === true ? this.$refs.content.scrollHeight : "0px";
            await sleep(300);
            this.collapsing = false;
            if (newVal === true) {
                this.$refs.content.classList = "accordion-content show";
            }
            else {
                this.$refs.content.classList = "accordion-content collapse";
            }
        }
    },
    mounted () {
        if (this.opened) {
            this.$refs.content.classList = "accordion-content show";
            this.$refs.content.style.height = this.$refs.content.scrollHeight;
        }
        else {
            this.$refs.content.classList = "accordion-content collapse";
            this.$refs.content.style.height = "0px";
        }
    },
    methods: {
        buttonClick () {
            if (this.collapsing) {
                return;
            }
            this.$emit("click");
        }
    }
};
</script>

<template>
    <div class="accordion-item">
        <button class="accordion-header" :style="buttonStyle" :disabled="status==='deactivated'" @click="buttonClick()">{{ title }}</button>
        <div ref="content">
            <div class="wrapper">
                <slot />
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.accordion-item {
  border: 1px solid #ccc;
  margin-bottom: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Add shadow effect */
}

.accordion-header {
  background-color: #f5f5f5;
  padding: 10px;
  cursor: pointer;
  width: 100%;
  box-sizing: border-box;
}

.accordion-content {
  padding: 0px;
}

.accordion-content .wrapper {
  padding: 10px;
}

.accordion-conent.collapse {
    display: none;
}

.accordion-conent.show {
    display: block;
}

.accordion-conent.collapsing {
    display: block;
    transition-property: height;
    transition-duration: 0.3s;
    transition-timing-function: linear;
}
</style>
