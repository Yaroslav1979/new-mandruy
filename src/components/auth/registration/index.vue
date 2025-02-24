<template>
  <AuthContainer class="registration">
    <MainTitle class="registration__title">Реєстрація</MainTitle>
    <Form ref="form" class="registration__form" @submit.prevent="handleSubmit">
      <CustomInput
        v-model="formData.name"
        placeholder="Ім'я"
        autocomplete="username"
        name="name"
        :rules="nameRules"
        class="registration__input"
      />
     
      <CustomInput
        v-model="formData.email"
        placeholder="Ваш email"
        autocomplete="email"
        name="email"
        :rules="emailRules"
        class="registration__input"
      />
      <CustomInput
        v-model="formData.password"
        placeholder="Ваш пароль"
        autocomplete="current-password"
        type="password"
        name="password"
        :rules="passwordRules"
        class="registration__input"
      />
      <CustomInput
        v-model="formData.confirmPassword"
        placeholder="Повторіть пароль"
        autocomplete="current-password"
        type="password"
        name="password"
        :rules="confirmPassword"
        class="registration__input"
      />
      <Button type="submit" class="registration__btn" :loading="loading">Увійти</Button>
    </Form>
  </AuthContainer>
</template>

<script>
import Form from "../../shared/form";
import CustomInput from "../../shared/CustomInput";
import Button from "../../mainButton";
import AuthContainer from "../AuthContainer.vue";
import MainTitle from "../../shared/MainTitle";
import { registerUser } from '../../../services/auth.service'
import {
  emailValidation,
  passwordValidation,
  isRequired,
} from "../../../utils/validationRules";
export default {
  name: "RegistrationForm",
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
        name: '',
        email: '',
        password: '', 
        confirmPassword: ''       
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
    nameRules() {
      return [this.rules.isRequired];
    },
    emailRules() {
      return [this.rules.isRequired, this.rules.emailValidation];
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
    ]
    },
  },
  methods: {
    async handleSubmit() {
        const isFormValid = this.$refs.form.validate();
        const { name, password, email } = this.formData;

        if (isFormValid) {
            try {
                this.loading = true;
                const { data } = await registerUser({ name, password, email });
                console.log(data);
                
                // Очищуємо всі поля
                this.formData.reset();
            } catch (error) {
                console.error(error);
            } finally {
              this.loading = false
            }
        }
    },
    resetForm() {
        this.formData.name = '';
        this.formData.email = '';
        this.formData.password = '';
        this.formData.confirmPassword = '';

        // Очищуємо валідацію у кожному input
        this.$nextTick(() => {
            Object.values(this.$refs).forEach((ref) => {
                if (ref && typeof ref.reset === 'function') {
                    ref.reset();
                }
            });
        });
      }
    } 
};

</script>

<style lang="scss" scoped>
.registration {
  &__form {
    display: flex;
    flex-direction: column;
  }

  &__title {
    text-align: center;
  }

  &__input {
    margin-bottom: 20px;
    width: 100%;
  }

  &__btn {
    margin-top: 15px;
    width: 100%;
  }
}
</style>
