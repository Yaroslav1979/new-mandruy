<template>
    <button 
        v-bind="attrs"
        :type="type"
        :class="{ 'btn': true, 'btn--outlined': outlined }"
        @click="$emit('click')"
        :disabled="loading"
        > 
        <CircleLoader v-if="loading" width="38" height="38" class="btn__loader"/>
        <span class="btn__content" :class="contentStyle">
            <slot></slot>
        </span>
    </button>
</template>

<script>
import CircleLoader from './loaders/CircleLoader.vue'
export default {
    name: "MainButton",
    components: {
        CircleLoader,
    },
    props: {
        type: {
            type: String,
            default: "button",
        },
        outlined: {
            type: Boolean,
            default: false,
        },
        loading: {
            type: Boolean,
            default: false
        }
    },
    inheritAttrs: false, // Виключає передачу всіх атрибутів, якщо потрібно контролювати вручну
    computed: {
        // Вручну прив'язуємо успадковані атрибути до кнопки
        attrs() {
            return this.$attrs;
        },
        contentStyle () {            
        return {
            'btn__content--hidden': this.loading
        }
        }
    }
};
</script>

<style lang="scss" scoped>
.btn {
    position: relative;
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

    &__content {
        &--hidden {
            opacity: 0;
        }
    }
    &__loader {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    } 
}
</style>
