<template>
  <div class="wrapper-input">
    <div class="input-container">
      <input
        v-bind="$attrs"
        :type="currentType"
        @blur="blurHandler"
        class="custom-input"
        :class="{ 'custom-input--error': !isValid }"
        :value="modelValue"
        @input="updateValue"
      />
      <!-- Кнопка показати/сховати пароль -->
      <button
        v-if="$attrs.type === 'password'"
        type="button"
        class="password-toggle"
        @click="togglePasswordVisibility"
      >
        <img
          :src="
            currentType === 'password' ? hidePasswordIcon : showPasswordIcon
          "
          alt="toggle password"
        />
      </button>
    </div>

    <span v-if="!isValid" class="custom-input__error">{{ error }}</span>
  </div>
</template>

<script>
import hidePasswordIcon from "../../assets/svg/hide.svg";
import showPasswordIcon from "../../assets/svg/eye.svg";

export default {
  name: "CustomInput",
  data() {
    return {
      isValid: true,
      error: "",
      isFirstInput: true,
      showPassword: false,
      hidePasswordIcon,
      showPasswordIcon,
    };
  },
  computed: {
    currentType() {
      if (this.$attrs.type === "password") {
        return this.showPassword ? "text" : "password";
      }
      return this.$attrs.type || "text";
    },
  },
  inject: {
    form: { default: null },
  },
  inheritAttrs: false,
  props: {
    modelValue: String,
    errorMessage: {
      type: String,
      default: "",
    },
    rules: {
      type: Array,
      default: () => [],
    },
  },
  watch: {
    modelValue(value) {
      if (!value) {
        this.isValid = true;
        this.error = "";
        return;
      }
      this.validate();
    },
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
    validate(value = this.modelValue) {
      this.isValid = true;
      this.error = "";

      for (const rule of this.rules) {
        const result = rule(value);
        if (typeof result === "object") {
          if (!result.hasPassed) {
            this.isValid = false;
            this.error = result.message || this.errorMessage;
            return false;
          }
        } else if (!result) {
          this.isValid = false;
          this.error = this.errorMessage;
          return false;
        }
      }

      return true;
    },
    blurHandler() {
      if (this.isFirstInput) {
        this.validate();
      }
      this.isFirstInput = false;
    },
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    reset() {
      this.isFirstInput = true;
      this.isValid = true;
      this.error = "";
      this.$emit("update:modelValue", "");
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../assets/scss/variables";

.wrapper-input {
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
  justify-content: center;
}

.input-container {
  position: relative;
  width: 100%;
}

.custom-input {
  display: flex;
  align-items: center;
  background-color: white;
  border-radius: 8px;
  border: 2px solid $main-color;
  font-family: e-Ukraine, sans-serif;
  width: 100%;
  height: 54px;
  font-size: 16px;
  padding: 0 20px 0 20px;

  &::placeholder {
    color: gray;
  }
}

.custom-input--error {
  border-color: rgba(255, 0, 0, 0.428);
}

.custom-input__error {
  font-size: 12px;
  color: red;
  line-height: 1.3;
  margin-top: 4px;
}

.password-toggle {
  position: absolute;
  top: 50%;
  right: 15px;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;

  img {
    width: 20px;
    height: 20px;
  }
}
</style>
