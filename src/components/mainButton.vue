<template>
    <button v-on="listeners" v-bind:type="type">
        <slot type="button"></slot>
    </button>
</template>

<script>
    export default {
        name: `mainButton`,
        props: {
            type: {
                type: String,
                default: 'button',
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>