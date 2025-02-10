<template>
    <button 
        v-bind="$attrs"
        v-bind:type="type"
        v-bind:class="{ btn: true, 'btn--outlined': outlined }"
        @click="$emit('click')"
        > 
        <slot></slot>
    </button>
</template>

<script>
export default {
    name: "MainButton",
    props: {
        type: {
            type: String,
            default: "button",
        },
        outlined: {
            type: Boolean,
            default: false,
        }
    },
    inheritAttrs: false // Виключає передачу всіх атрибутів, якщо потрібно контролювати вручну
};
</script>

<style lang="scss" scoped>
.btn {
    display: inline-block;
    font-size: 18px;
    background: #ff662d;
    color: #fff;
    cursor: pointer;
    min-width: 220px;
    border: 1px solid transparent;
    padding: 8px 15px;

    &--outlined {
        background: none;
        border: 1px solid #ff662d;  
        color: #ff662d;     
    }
}
</style>
