<template>
  <AuthContainer class="login">
    <MainTitle class="login__title">Вхід</MainTitle>
    <Form ref="form" class="login__form" @submit.prevent="handleSubmit">
      <CustomInput
        v-model="formData.email"
        placeholder="Ваш email"
        autocomplete="email"
        name="email"
        :rules="emailRules"
        class="login__input"
      />
      <CustomInput
        v-model="formData.password"
        placeholder="Ваш пароль"
        autocomplete="current-password"
        type="password"
        name="password"
        :rules="passwordRules"
        class="login__input"
      />
      <Button type="submit" class="login__btn" :loading="loading">Увійти</Button>
      <span> 
        Забули пароль?
      <RouterLink      
      :to="{ name: 'recovery-password-page', params: { token: 'init' } }"
    >
      <span class="login__btn--fogot">Відновити </span> 
    </RouterLink>
      </span>
      

      
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
} from "../../../utils/validationRules";

export default {
  name: "LoginForm",
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
      formData: {
        email: "",
        password: "",
      },
    };
  },
  computed: {
    rules() {
      return {
        emailValidation,
        passwordValidation,
        isRequired,
      };
    },
    emailRules() {
      return [this.rules.isRequired, this.rules.emailValidation];
    },
    passwordRules() {
      return [this.rules.isRequired, this.rules.passwordValidation];
    },
  },
  methods: {
    async handleSubmit() {
      const { form } = this.$refs;
      // const isFormValid = await form.validate();
      // const isFormValid = form.validate();
      const isFormValid = await form.validate?.() ?? true;

      if (!isFormValid || this.loading) return;

      try {
        this.loading = true;
console.log('Submitting login form', this.formData);

        await this.$store.dispatch("auth/login", this.formData); // 👈 Vuex login
       const role = this.$store.state.auth.user.role;
if (role === 'admin') {
  this.$router.push({ name: 'admin' }); // наприклад
} else {
  this.$router.push({ name: 'home' });
}

        form.reset();
      } catch (error) {
        console.error("Login error", error);
        this.$notify({
          type: "error",
          title: "Відбулася помилка",
          text: error.response?.data?.message || error.message,
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
   
  }
}
.login__btn--fogot {  
      text-decoration: none;
      color: #111;
    }

</style>
