<template>
  <div class="header">
    <HeaderAllPages />
  </div>

  <main class="registration">
    <AuthSection>
      <div class="page-modal" @click.self="handleClose">
        <div class="page-modal__content">
          <ConfirmEmail />
        </div>
      </div>
    </AuthSection>
  </main>
</template>

<script>
import HeaderAllPages from "../components/shared/HeaderAllPages.vue";
import ConfirmEmail from "../components/auth/registration/ConfirmEmail.vue";
import AuthSection from "../components/auth/AuthSection.vue";
export default {
  name: "RegistrationPage",

  components: {
    HeaderAllPages,
    ConfirmEmail,
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
@import "../assets/scss/variables";
.header {
  background-color: #111;
}

.page-modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;

  &__content {
  background: #fff;
  width: 450px;
  height: auto;
  max-height: 90vh;
  padding: 24px;
  border-radius: 12px;
  overflow-y: auto;
}
}

</style>
