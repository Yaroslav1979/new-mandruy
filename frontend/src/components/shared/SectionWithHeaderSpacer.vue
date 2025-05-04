<template>
    <div class="section-spacer">
        <slot> </slot> 
    </div>
</template>

<script>
    export default {
        name: "SectionSpacer"
    }
</script>

<style lang="scss" scoped>

.section-spacer {   
    padding: 50px;    
    background-color: #f5f4f4; 
}
</style>