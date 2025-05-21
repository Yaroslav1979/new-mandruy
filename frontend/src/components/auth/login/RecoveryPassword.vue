<template>
  <AuthContainer>
    <MainTitle class="login__title">
      {{ stage === 'email' ? 'Вкажіть ваш email' : 'Зміна пароля' }}
    </MainTitle>

    <Form ref="form" class="login__form" @submit.prevent="handleSubmit">
      <template v-if="stage === 'email'">
        <CustomInput
          v-model="formData.email"
          name="email"
          placeholder="Ваш email"
          autocomplete="email"
          :rules="emailRules"
          class="registration__input"
        />
        <p>*На вашу електронну пошту буде надіслано лист з кодом для відновлення пароля</p>
      </template>

      <template v-else>
        <CustomInput
          v-model="formData.code"
          name="code"
          placeholder="Код з email або посилання"
          :rules="requiredRule"
          class="registration__input"
        />
        <CustomInput
          v-model="formData.newPassword"
          name="newPassword"
          type="password"
          placeholder="Новий пароль"
          :rules="passwordRule"
          class="registration__input"
        />
      </template>

      <Button type="submit" class="login__btn" :loading="loading">
        {{ stage === 'email' ? 'Надіслати' : 'Змінити пароль' }}
      </Button>
    </Form>

    <SuccessModal
      v-if="showSuccess"
      :message="'Пароль успішно змінений!'"
      @close="goToAccount"
    />
  </AuthContainer>
</template>

<script>
import Form from "../../shared/form";
import CustomInput from "../../shared/CustomInput";
import Button from "../../mainButton";
import AuthContainer from "../AuthContainer.vue";
import MainTitle from "../../shared/MainTitle";
import SuccessModal from '../../SuccessModal.vue';
import {
  isRequired,
  emailValidation,
  passwordValidation
} from "../../../utils/validationRules";
import { mapActions } from "vuex";

export default {
  name: "RecoveryPasswordForm",
  components: {
    Form,
    CustomInput,
    Button,
    AuthContainer,
    MainTitle,
    SuccessModal,
  },
  data() {
    return {
      stage: "email", // "email" або "reset"
      loading: false,
      formData: {
        email: "",
        code: "", // код з email
        newPassword: "",
      },
      showSuccess: false,
      emailRules: [isRequired, emailValidation],
      requiredRule: [isRequired],
      passwordRule: [isRequired, passwordValidation],
    };
  },
  methods: {
    ...mapActions("auth", ["requestPasswordReset", "resetPassword", "login"]),

    async handleSubmit() {
  if (this.loading) return;
  this.loading = true;
  try {
    if (this.stage === "email") {
      await this.requestPasswordReset({ email: this.formData.email });
      this.stage = "reset";
    } else {
      const token = this.formData.code.trim();

      await this.resetPassword({
        token,
        password: this.formData.newPassword,
      });

      await this.login({
        email: this.formData.email,
        password: this.formData.newPassword,
      });

      this.showSuccess = true;
    }
  } catch (err) {
    console.error("Помилка відновлення пароля:", err);
    alert(err.response?.data?.message || "Сталася помилка");
  } finally {
    this.loading = false;
  }
},

    goToAccount() {
      this.$router.push("/"); // Змініть маршрут за потреби
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
