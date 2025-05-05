<template>
  <div class="header">
    <HeaderAllPages />
  </div>
  
  <main class="registration">
    <AuthSection>
      <RegisterForm />
    </AuthSection>
  </main>
</template>

<script>
import HeaderAllPages from "../components/shared/HeaderAllPages.vue"
import RegisterForm from "../components/auth/registration";
import AuthSection from "../components/auth/AuthSection.vue";
export default {
  name: "RegistrationPage",

  components: {
    HeaderAllPages,
    RegisterForm,
    AuthSection,
  },
};
</script>

<style lang="scss" scoped>
.header {
  background-color: #111;
}
</style>
