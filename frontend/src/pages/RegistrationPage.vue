<template>
  <main class="registration">
    <AuthSection>
      <RegisterForm />
    </AuthSection>
  </main>
</template>

<script>
import RegisterForm from "../components/auth/registration";
import AuthSection from "../components/auth/AuthSection.vue";
export default {
  name: "RegistrationPage",

  components: {
    RegisterForm,
    AuthSection,
  },
};
</script>

<style lang="scss" scoped></style>
