<template>
    <div class="container">
        <slot>Defoult value</slot>
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