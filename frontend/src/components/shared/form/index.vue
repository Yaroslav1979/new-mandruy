<template>
  <form v-bind="$attrs" class="form">
    <slot></slot>
  </form>
</template>

<script>
export default {
  
  name: "FormPage",
  provide() {
    return {
      form: this,
    };
  },
  data() {
    return {
      inputs: [],
    };
  },
  methods: {
    registerInput(input) {
      this.inputs.push(input);
    },
    unRegisterInput(input) {
      this.inputs = this.inputs.filter((item) => item !== input); // Виправлено
    },
    validate() {
      return this.inputs.reduce((isValid, input) => {
        const isInputValid = input.validate(); // Викликаємо метод `validate()`
        return isValid && isInputValid;
      }, true);
    },
    reset() {
      this.inputs.forEach((input) => input.reset()); // Викликаємо `reset()`
    },
  },
};
</script>

<style lang="scss" scoped></style>
