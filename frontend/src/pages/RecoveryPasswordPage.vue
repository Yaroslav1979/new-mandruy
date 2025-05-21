<template>
  <div class="header">
    <HeaderAllPages />
  </div>

  <main>
    <AuthSection>
      <div class="page-modal__backdrop" @click.self="goHome">
        <div class="page-modal__content">
          <RecoveryPassword :token="$route.params.token" />
        </div>
      </div>
    </AuthSection>
  </main>
</template>

<script>
import HeaderAllPages from '@/components/shared/HeaderAllPages.vue';
import RecoveryPassword from '@/components/auth/login/RecoveryPassword.vue';
import AuthSection from '@/components/auth/AuthSection.vue';

export default {
  name: 'RecoveryPasswordPage',
  components: { HeaderAllPages, AuthSection, RecoveryPassword },
  props: ['token'],
  methods: {
    goHome() {
      this.$router.push({ name: 'home' });
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
