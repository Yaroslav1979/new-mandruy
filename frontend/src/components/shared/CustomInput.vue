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
}

.input-container {
  position: relative;
  width: 100%;
}

.custom-input {
  display: flex;
  align-items: center;

  width: 100%;
  height: clamp(38px, 3.5vw, 54px);

  padding: 0 clamp(35px, 4vw, 50px) 0 clamp(12px, 1.5vw, 20px);

  background-color: white;
  border-radius: clamp(6px, 0.6vw, 8px);
  border: 2px solid $main-color;

  font-family: e-Ukraine, sans-serif;
  font-size: clamp(11px, 1.2vw, 16px);

  box-sizing: border-box;

  &::placeholder {
    color: gray;
  }
}

.custom-input--error {
  border-color: rgba(255, 0, 0, 0.428);
}

.custom-input__error {
  font-size: clamp(9px, 0.9vw, 12px);
  color: red;
  line-height: 1.3;
  margin-top: 4px;
}

.password-toggle {
  position: absolute;

  top: 50%;
  right: clamp(8px, 1.2vw, 15px);

  transform: translateY(-50%);

  display: flex;
  align-items: center;
  justify-content: center;

  background: transparent;
  border: none;
  padding: 0;

  cursor: pointer;

  img {
    width: clamp(16px, 1.5vw, 20px);
    height: clamp(16px, 1.5vw, 20px);
  }
}

/* =========================================
   СМАРТФОН
   ========================================= */

@media (max-width: 600px) {
  .custom-input {
    height: 40px;

    padding-left: 12px;
    padding-right: 40px;

    font-size: 11px;

    border-radius: 6px;
  }

  .password-toggle {
    right: 10px;

    img {
      width: 17px;
      height: 17px;
    }
  }

  .custom-input__error {
    font-size: 9px;
  }
}

/* =========================================
   ДУЖЕ МАЛИЙ СМАРТФОН
   ========================================= */

@media (max-width: 450px) {
  .custom-input {
    height: 38px;
    font-size: 10px;
  }

  .password-toggle {
    right: 8px;

    img {
      width: 16px;
      height: 16px;
    }
  }
}
</style>
