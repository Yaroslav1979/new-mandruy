<template>
    <div class="container">
        <slot>Default value</slot>
    </div>
</template>

<script>
    export default {
        name: 'myContainer'
    }
</script>

<style lang="scss" scoped>
.container {
    width: 75%;
    margin: 0 auto;
}
</style>