<template>
  <button 
    v-bind="attrs"
    :type="type"
    :class="['btn', { 'btn--outlined': outlined }]"
    @click="$emit('click')"
    :disabled="loading"
  > 
    <div class="btn__inner">
      <CircleLoader v-if="loading" width="24" height="24" class="btn__loader"/>
      <span v-if="!loading" class="btn__content">
        <slot></slot>
      </span>
    </div>
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
  inheritAttrs: false,
  computed: {
    attrs() {
      return this.$attrs;
    }
  }
};
</script>

<style lang="scss" scoped>
.btn {
  position: relative;
  border: none;
  background-color: transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  min-width: 150px;
  padding: 10px 20px;
  font-size: 16px;
  transition: all 0.2s ease;
  border-radius: 6px;

  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }

  &--outlined {
    background: none;
    border: 1px solid #ff662d;  
    color: #ff662d;
  }

  &__inner {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  &__loader {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__content {
    display: inline-block;
  }
}
</style>

