<template>
  <div class="header">
    <HeaderAllPages />
  </div>

  <main class="login">
    <AuthSection>
      <div class="page-modal__backdrop" @click.self="handleClose">
        <div class="page-modal__content">
          <LoginForm />
        </div>
      </div>
    </AuthSection>
  </main>
</template>

<script>
import HeaderAllPages from "../components/shared/HeaderAllPages.vue";
import LoginForm from "../components/auth/login";
import AuthSection from "../components/auth/AuthSection.vue";
export default {
  name: "LoginPage",

  components: {
    HeaderAllPages,
    LoginForm,
    AuthSection,
  },
  methods: {
    handleClose() {
      this.$router.push({ name: "home" }); // або куди хочеш
    },
  },
};
</script>

<style lang="scss" scoped>
.header {
  background-color: #111;
}

.page-modal__backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.page-modal__content {
  background: #fff;
  width: 450px;
  height: auto;
  max-height: 90vh;
  padding: 24px;
  border-radius: 12px;
  overflow-y: auto;
}
</style>
