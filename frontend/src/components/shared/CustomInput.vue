<template>
    <div class="wrapper-input">
      <input 
        v-bind="$attrs"             
        @blur="blurHandler"
        class="custom-input" 
        :class="!isValid && 'custom-input--error'"
        :value="modelValue"
        @input="updateValue"
      />
      <span v-if="!isValid" class="custom-input__error">{{ error }}</span>
    </div>
  </template>
  
  <script>
  export default {
    name: "CustomInput",
    data() {
      return {
        isValid: true,
        error: '',
        isFirstInput: true,
      };
    },
    inject: {
      form: { default: null }
    },
    inheritAttrs: false,
    props: {
      modelValue: String,
      errorMessage: {
        type: String,
        default: '',
      },
      rules: {
        type: Array,
        default: () => [],
      }
    },
    watch: {
      modelValue(value) {
        if (!value && this.isFirstInput) return;
        if (!value) {
          this.isValid = true;
          this.error = '';
          return;
        }
        this.validate(); // викликаємо без аргументів
      }
    },
    mounted() {
      if (this.form) this.form.registerInput(this);
    },
    beforeUnmount() {
      if (this.form) this.form.unRegisterInput(this);
    },
    methods: {
      updateValue(event) {
        this.$emit("update:modelValue", event.target.value);
      },
      validate(value = this.modelValue) {  // <- дефолтне значення
        this.isValid = true;
        this.error = '';
  
        for (const rule of this.rules) {
          const result = rule(value);
          if (typeof result === 'object') {
            if (!result.hasPassed) {
              this.isValid = false;
              this.error = result.message || this.errorMessage;
              return false; // <- важливо
            }
          } else if (!result) {
            this.isValid = false;
            this.error = this.errorMessage;
            return false; // <- важливо
          }
        }
  
        return true; // <- важливо
      },
      blurHandler() {
        if (this.isFirstInput) {
          this.validate();
        }
        this.isFirstInput = false;
      },
      reset() {
        this.isFirstInput = true;
        this.isValid = true;
        this.error = '';
        this.$emit('update:modelValue', '');
      }
    }
  };
  </script>

<style lang="scss" scoped>
@import "../../assets/scss/variables";

.wrapper-input {
    display: flex;  
  justify-content: space-between;
  align-items: center;
  width: 100%; 
}
.custom-input {    
    display: flex;
  align-content: center;
  background-color: white;
  border-radius: 8px;
  border: 2px solid $main-color;
  font-family: e-Ukraine, sans-serif;
  width: 100%;
  height: 54px;
  font-size: 16px;
  padding: 0 20px;

    &::placeholder {
        color: gray;
    } 

    &__error {
        position: absolute;
        top: 100%;
        right: 0;
        width: 100%;
        font-size: 12px;
        color: red;
        border-color: rgba(255, 0, 0, 0.428);    
        line-height: 1.3;
    }
}

</style>
