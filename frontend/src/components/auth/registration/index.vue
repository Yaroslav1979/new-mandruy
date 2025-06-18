<template>
  <AuthContainer class="registration">
    <MainTitle class="registration__title">Реєстрація</MainTitle>

    <Form
      ref="form"
      class="registration__form"
      @submit.prevent="handleSubmit"
    >
      <!-- Ім’я -->
       <div> 
      <CustomInput
        v-model="formData.name"
        name="name"
        placeholder="Ваше ім'я/нік"
        autocomplete="username"
        :rules="nameRules"
        class="registration__input"
      />
      <p class="registration__input--note">* максимальна довжина імені/ніка 20 символів</p>
      </div>
      
    <!-- Email -->
      <CustomInput
        v-model="formData.email"
        name="email"
        placeholder="Ваш email"
        autocomplete="email"
        :rules="emailRules"
        class="registration__input"
      />

      <!-- Пароль -->
      <CustomInput
        v-model="formData.password"
        name="password"
        type="password"
        placeholder="Ваш пароль"
        autocomplete="new-password"
        :rules="passwordRules"
        class="registration__input"
      />

      <!-- Підтвердження пароля -->
      <CustomInput
        v-model="formData.confirmPassword"
        name="confirmPassword"
        type="password"
        placeholder="Повторіть пароль"
        autocomplete="new-password"
        :rules="confirmPasswordRules"
        class="registration__input"
      />

      <Button
        type="submit"
        class="registration__btn "
        :loading="loading"
        :disabled="loading"
      >
        Зареєструватися
      </Button>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </Form>
  </AuthContainer>
</template>
<script>


import Form from "../../shared/form";
import CustomInput from "../../shared/CustomInput";
import Button from "../../mainButton";
import AuthContainer from "../AuthContainer.vue";
import MainTitle from "../../shared/MainTitle";

import {
  emailValidation,
  passwordValidation,
  isRequired,
  charLimit
} from "../../../utils/validationRules";

export default {
  name: 'RegistrationForm',

  components: {
    Form,
    CustomInput,
    Button,
    AuthContainer,
    MainTitle,
  },
  

  data() {
    return {
      loading: false,
      errorMessage: '',
      formData: {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      },
    };
  },

  computed: {
    nameRules() { return [isRequired, charLimit(20)]; },
    emailRules() { return [isRequired, emailValidation]; },
    passwordRules() { return [isRequired, passwordValidation]; },
    confirmPasswordRules() {
      return [
        (val) => ({
          hasPassed: val === this.formData.password,
          message:   'Паролі не збігаються',
        }),
      ];
    },
  },

  methods: {
    async handleSubmit() {
  if (this.loading) return;

  const isValid = this.$refs.form.validate();
  if (!isValid) return;

  this.loading = true;
  this.errorMessage = ''; // очищення перед запитом
  const { name, email, password } = this.formData;

  try {
    await this.$store.dispatch('auth/registration', { name, email, password });

    this.$router.push({
      name: 'confirm-email-page',
      query: { email },
    });

    this.resetForm();
  } catch (e) {
    if (e.response && e.response.status === 409) {
      this.errorMessage = 'Користувач з таким email вже існує';
    } else {
      this.errorMessage = e.response?.data?.message || 'Сталася помилка при реєстрації';
    }
  } finally {
    this.loading = false;
  }
},
    resetForm() {
      this.formData = {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      };
      this.$nextTick(() =>
        Object.values(this.$refs).forEach((r) => r?.reset?.())
      );
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../../assets/scss/variables";
.registration {
  font-family: e-Ukraine, sans-serif;
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
    &--note {
      color: #222;
      font-size: 12px;
    }
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
  }
}
</style>
