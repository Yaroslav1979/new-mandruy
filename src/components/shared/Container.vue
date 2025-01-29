<template>
    <div class="container">
        <slot></slot>
    </div>
</template>

<script>
    export default {
        name: 'myContainer'
    }
</script>

<style lang="scss" scoped>
.container {
    max-width: 1110px;
    margin: 0 auto;
}
</style>