


<template>
    <select
      v-bind="$attrs"
      class="custom-select"
      :value="modelValue"
      @change="onInput"
    >
      <option
        v-for="item in formattedItems"
        :key="item.value"
        :value="item.value"
        :class="{ 'placeholder-option': item.isLabel }"
      >
        {{ item.label }}
      </option>
    </select>
  </template>
  
  <script>
  export default {
    name: "CustomSelect",
    props: {
      modelValue: String,
      items: {
        type: Array,
        default: () => [], 
      },
    },
    computed: {
      formattedItems() {
        return this.items.map((item) =>
          typeof item === "object"
            ? item
            : { value: item, label: item, isLabel: false }
        );
      },
    },
    methods: {
      onInput(event) {
        this.$emit("update:modelValue", event.target.value);
      },
    },
  };
  </script>
  
  <style lang="scss" scoped>
  @import "../../assets/scss/variables";
  
  .custom-select {
    height: 40px;
    border: 1px solid $main-color;
    font-size: 18px;
    outline: none;
    padding: 8px 15px;
    cursor: pointer;
    display: inline-block;
    font-family: e-Ukraine, sans-serif;
    min-width: 220px;
    border-radius: 8px;
    font-size: 14px;
  }  
  
  /* Світліший колір лише для label */
  .placeholder-option {
    color: #A9A9A9 !important;
    font-family: e-Ukraine, sans-serif;
  }
  </style>
  
  
