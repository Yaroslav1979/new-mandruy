<template>
  <form v-bind="$attrs" class="form" @submit="onSubmit">
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
    onSubmit(event) {
      event.preventDefault();
      this.$emit('submit', event);
    },
    registerInput(input) {
      this.inputs.push(input);
    },
    unRegisterInput(input) {
      this.inputs = this.inputs.filter((item) => item !== input); // Виправлено
    },
    //-----------------------------------------------------
//     async validate() {
//   let isValid = true;
//   for (const input of this.inputs) {
//     const valid = await input.validate(); // якщо validate async
//     if (!valid) isValid = false;
//   }
//   return isValid;
// },
    validate() {
      return this.inputs.reduce((isValid, input) => {
        const isInputValid = input.validate(); // Викликаємо метод `validate()`
        return isValid && isInputValid;
      }, true);
    },
    //------------------------------------------------
    reset() {
      this.inputs.forEach((input) => input.reset()); // Викликаємо `reset()`
    },
  },
};
</script>

<style lang="scss" scoped></style>
