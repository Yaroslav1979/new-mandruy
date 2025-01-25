<template>
    <button v-on="listeners" v-bind:type="type" v-bind:class="{btn: true, 'btn--outlined': outlined}">
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
            },
            outlined: {
                type: Boolean,
                default: false,
            }
        }
    }
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