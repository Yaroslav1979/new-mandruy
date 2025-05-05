<template>
  <div class="header">
    <HeaderAllPages />
  </div>
  <main class="login">
    <AuthSection>
      <LoginForm />
    </AuthSection>
  </main>
</template>

<script>
import HeaderAllPages from "../components/shared/HeaderAllPages.vue"
import LoginForm from "../components/auth/login";
import AuthSection from "../components/auth/AuthSection.vue";
export default {
  name: "LoginPage",

  components: {
    HeaderAllPages,
    LoginForm,
    AuthSection,
  },
};
</script>

<style lang="scss" scoped>
.header {
  background-color: #111;
}
</style>
