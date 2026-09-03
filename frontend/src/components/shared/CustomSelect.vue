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
          : { value: item, label: item, isLabel: false },
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
  display: inline-block;

  width: clamp(150px, 15vw, 220px);
  min-width: 0;
  height: clamp(32px, 2.8vw, 40px);

  padding: clamp(5px, 0.6vw, 8px) clamp(8px, 1vw, 15px);

  border: 1px solid $main-color;
  border-radius: 8px;

  outline: none;
  cursor: pointer;

  font-family: e-Ukraine, sans-serif;
  font-size: clamp(10px, 1vw, 14px);
  font-weight: 400;

  background-color: #fff;
  color: #111;

  box-sizing: border-box;
}

/* Колір placeholder */
.placeholder-option {
  color: #a9a9a9 !important;
  font-family: e-Ukraine, sans-serif;
}

/* =========================================
   ПЛАНШЕТ
   ========================================= */

@media (max-width: 900px) {
  .custom-select {
    width: clamp(130px, 16vw, 180px);
    height: 36px;

    padding: 6px 10px;

    font-size: 11px;
    border-radius: 7px;
  }
}

/* =========================================
   СМАРТФОН
   ========================================= */

@media (max-width: 600px) {
  .custom-select {
    width: 100%;
    min-width: 0;
    height: 36px;

    padding: 6px 8px;

    font-size: 11px;

    border-radius: 7px;
  }
}

/* =========================================
   ДУЖЕ МАЛИЙ СМАРТФОН
   ========================================= */

@media (max-width: 450px) {
  .custom-select {
    height: 34px;

    padding: 5px 7px;

    font-size: 10px;

    border-radius: 6px;
  }
}
</style>
