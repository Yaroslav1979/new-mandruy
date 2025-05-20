<template>
  <AuthContainer>
    <MainTitle class="login__title">Встановити новий пароль</MainTitle>

    <Form ref="form" class="login__form" @submit.prevent="handleSubmit">
      <CustomInput
        v-model="formData.password"
        placeholder="Новий пароль"
        type="password"
        name="password"
        :rules="passwordRules"
        class="login__input"
      />
      <CustomInput
        v-model="formData.confirmPassword"
        placeholder="Повторіть пароль"
        type="password"
        name="confirmPassword"
        :rules="confirmPassword"
        class="login__input"
      />
      <Button type="submit" 
      class="login__btn" 
      :loading="loading"
      >
      Змінити пароль
    </Button>

    </Form>
  </AuthContainer>
</template>

<script>
import Form from "../../shared/form";
import CustomInput from "../../shared/CustomInput";
import Button from "../../mainButton";
import AuthContainer from "../AuthContainer.vue";
import MainTitle from "../../shared/MainTitle";
// import SuccessModal from '../../SuccessModal.vue';
import {
  passwordValidation,
  isRequired,
} from "../../../utils/validationRules";

export default {
  name: "RecoveryPasswordForm",
  components: {
    Form,
    CustomInput,
    Button,
    AuthContainer,
    MainTitle,
    // SuccessModal,
    
  },
  props: {
    token: { type: String, required: true }, // приходить із маршруту
  },
  data() {
    return {
      loading: false,
      formData: {
        password: "",
        confirmPassword: "",
      },
    };
  },
  computed: {
     rules() {
      return {
        
        passwordValidation,
        isRequired,
      };
    },
    passwordRules() {
      return [this.rules.isRequired, this.rules.passwordValidation];
    },
    confirmPassword() {
      return [
        (val) => ({
        hasPassed: val === this.formData.password,
        message: 'Паролі не збігаються'
      }),
      ];
    },
  },
  methods: {
    async handleSubmit() {
      const { form } = this.$refs;
      if (!form.validate() || this.loading) return;

      try {
        this.loading = true;
        await this.$axios.post(`/reset-password/${this.token}`, {
          password: this.formData.password,
        });
        this.$notify({ type: "success", text: "Пароль змінено" });
        this.$router.push({ name: "login" });
      } catch (e) {
        this.$notify({
          type: "error",
          text: e.response?.data?.message || e.message,
        });
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../../assets/scss/variables";
.login {
  &__form {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  &__title {
    text-align: center;
  }

  &__input {
    margin-bottom: 20px;
    width: 100%;
  }

  &__btn {
    border: 2px solid $main-color;
    font-family: e-Ukraine, sans-serif;
    background-color: #6b76ff;
    color: white;
    font-size: 16px;
    padding: 8px;
    border-radius: 12px;
    margin-top: 15px;
    width: 100%;

    &--fogot {
      font-family: e-Ukraine, sans-serif;
    }
  }
}
</style>
