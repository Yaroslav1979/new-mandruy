<template>
  <AuthContainer class="registration">
    <MainTitle class="registration__title">
      Підтвердження вашого email
    </MainTitle>

    <Form
      ref="form"
      class="registration__form"
      @submit.prevent="submitCode"
    >
      <CustomInput
        v-model="code"
        class="registration__input"
        placeholder="Введіть код з email"
        maxlength="3"
        autocomplete="one-time-code"
        :rules="[isRequired]"
      />

      <Button
        type="submit"
        class="registration__btn"
        :loading="loading"
        :disabled="loading"
      >
        Продовжити
      </Button>
    </Form>
  </AuthContainer>

  <SuccessModal
    v-if="showSuccessModal"
    @close="handleSuccessModalClose"
  />
</template>

<script>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useStore } from 'vuex';

import Form from "../../shared/form";
import CustomInput from "../../shared/CustomInput";
import Button from "../../mainButton";
import AuthContainer from "../AuthContainer.vue";
import MainTitle from "../../shared/MainTitle";
import SuccessModal from '../../SuccessModal.vue';

import { 
  isRequired,
} from "../../../utils/validationRules";

export default {
  name: 'ConfirmEmail',

  components: {
    Form,
    CustomInput,
    Button,
    AuthContainer,
    MainTitle,
    SuccessModal,
  },

  setup() {
    // Composition‑API усередині Options‑компонента
    const route  = useRoute();
    // const router = useRouter();
    const store  = useStore();
    const router = useRouter();
    const email  = route.query.email || '';   // e‑mail із query‑рядка
    const code   = ref('');
    const loading = ref(false);
    const showSuccessModal = ref(false);
    const errorMessage = ref('');

    async function submitCode() {
      if (loading.value) return;
      loading.value = true;

      try {
        await store.dispatch('auth/confirmEmail', {
          email,
          code: code.value.trim(),
        });

        // показуємо модалку «Вітаємо! Реєстрація успішна!»
        showSuccessModal.value = true;
      } catch (err) {
        errorMessage.value = err.response?.data?.message || 'Сталася помилка';
        // повідомлення про помилку
        // this.$notify або будь‑який ваш toast
        console.error(err);
      } finally {
        loading.value = false;
      }
    }

    function handleSuccessModalClose() {
      showSuccessModal.value = false;
      // router.push('/'); 
      const returnRoute = localStorage.getItem('preRegistrationRoute') || '/';
localStorage.removeItem('preRegistrationRoute');

// Перевірка безпеки (щоб не перейти кудись зовні)
if (!returnRoute.startsWith('/')) {
  router.push('/');
} else {
  router.push(returnRoute);
}     
    }

    return {
      email,
      code,
      loading,
      showSuccessModal,
      submitCode,
      handleSuccessModalClose,
      isRequired,
    };
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
