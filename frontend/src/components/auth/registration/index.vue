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
        name="confirmPassword"
        :rules="confirmPassword"
        class="registration__input"
      />
      <Button 
              type="submit" 
              class="registration__btn"   
              :loading="loading" 
              :disabled="loading"
              >
        Зареєструватися
      </Button>
    </Form>
  </AuthContainer>
  <SuccessModal v-if="showSuccessModal" @close="handleSuccessModalClose" />
</template>

<script>
// import axios  from "../../../utils/axios";
import Form from "../../shared/form";
import CustomInput from "../../shared/CustomInput";
import Button from "../../mainButton";
import AuthContainer from "../AuthContainer.vue";
import MainTitle from "../../shared/MainTitle";
import SuccessModal from '../../SuccessModal.vue'
// import { registerUser } from '../../../services/auth.service'
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
    SuccessModal,
  },

  data() {
    return {
      showSuccessModal: false,
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
      if (this.loading) return; 
      const { form } = this.$refs;
      const isFormValid = form.validate();
      if (!isFormValid) return;

      try {
        this.loading = true;
        const { name, email, password } = this.formData;

        await this.$store.dispatch('auth/registration', { name, email, password });
         this.showSuccessModal = true;
         this.$router.push({ name: "home" });
        form.reset();
      } catch (error) {
        this.$notify({
          type: 'error',
          title: 'Помилка',
          text: error.response?.data?.message || error.message,
        });
      } finally {
        this.loading = false;
      }
    },
    handleSuccessModalClose() {
      this.showSuccessModal = false;
      this.$router.push({ name: 'account' });
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
