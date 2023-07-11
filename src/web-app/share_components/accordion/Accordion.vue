<script>

function sleep (ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default {
    components: {
    },
    props: {
    },
    emits: [
    ],
    setup() {

        return {};
    }
};
</script>

<template>
    <div class="accordion">
        <slot />
    </div>
</template>

<style lang="scss" scoped>
.accordion {
  font-family: Arial, sans-serif;
  color: #333;
}
</style>
