<template>
  <div class="header-top">
    <div class="burger" @click="burgerOpen = !burgerOpen">☰</div>

    <div v-if="burgerOpen" class="mobile-menu">
      <router-link :to="{ name: 'home' }">Про сервіс</router-link>
      <router-link :to="{ name: 'SearchPlacePage' }">Пошук місць</router-link>
      <router-link :to="{ name: 'MapPage' }">Мапа</router-link>
      <router-link :to="{ name: 'ContactPage' }">Контакти</router-link>

      <div v-if="isAuthenticated">
        <button @click="$emit('openAddModal')">Додати місце</button>
        <button @click="handleLogout">Вийти</button>
      </div>

      <div v-else>
        <router-link :to="{ name: 'registration-page' }"
          >Реєстрація</router-link
        >
        <router-link :to="{ name: 'login-page' }">Вхід</router-link>
      </div>
    </div>

    <LogoType />
    <span>
      <router-link :to="{ name: 'home' }" class="header-top__nav">
        Про сервіс
      </router-link>

      <router-link :to="{ name: 'SearchPlacePage' }" class="header-top__nav">
        Пошук місць
      </router-link>

      <router-link :to="{ name: 'MapPage' }" class="header-top__nav">
        Мапа
      </router-link>

      <router-link :to="{ name: 'ContactPage' }" class="header-top__nav">
        Контакти
      </router-link>

      <div v-if="isAuthenticated" class="header-top__wrapper">
        <button class="header-top__add" @click="$emit('openAddModal')">
          Додати місце
        </button>
        <br />

        <div class="header-top__user">
          <div
            class="header-top__avatar-circle"
            @click="showProfileModal = true"
          >
            {{ userInitial }}
          </div>

          <!-- Модалка профілю -->
          <ProfileModal
            v-if="showProfileModal"
            :user="user"
            @close="showProfileModal = false"
            @logout="handleLogout"
          />
        </div>
      </div>

      <div v-else class="header-top__block">
        <router-link
          :to="{ name: 'registration-page' }"
          class="header-top__block-login"
        >
          Реєстрація
        </router-link>
        /
        <router-link
          :to="{ name: 'login-page' }"
          class="header-top__block-login"
        >
          Вхід
        </router-link>
      </div>
    </span>
  </div>
</template>

<script>
import LogoType from "./LogoType";
import ProfileModal from "../auth/ProfileModal.vue";

export default {
  name: "HeaderAllPages",
  components: {
    LogoType,
    ProfileModal,
  },
  emits: ["openAddModal"],
  data() {
    return {
      showProfileModal: false,
      burgerOpen: false,
    };
  },

  computed: {
    user() {
      return this.$store.state.auth.user;
    },
    isAuthenticated() {
      return !!this.$store.state.auth.token;
    },
    userInitial() {
      return this.user?.name?.[0]?.toUpperCase() || "";
    },
  },

  methods: {
    handleLogout() {
      this.$store.dispatch("auth/logout");
      this.$router.push({ name: "home" });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../assets/scss/variables.scss";

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px clamp(16px, 5vw, 50px); // адаптивні відступи
  background: #212126;
  opacity: 0.7;

  &__nav {
    display: flex;
    align-items: center; // вертикальне центрування
    justify-content: center; // горизонтальне центрування

    height: 52px; // залишаєш висоту
    padding: 0 16px; // тільки горизонтальні відступи
    width: 140px;
    color: #fff;
    font-size: 14px;
    font-weight: 500;
    line-height: 1; // важливо
    font-family: e-Ukraine, sans-serif;
    text-decoration: none;
    border-radius: 30px;
    border: 1px solid #fafafa;
    box-shadow: 0px 4px 99px 0px #454753;
    background: transparent;
    cursor: pointer;

    &:hover {
      color: bisque;
      border: 2px solid bisque;
      opacity: 80%;
    }
  }

  &__block {
    display: flex;
    gap: 16px;
    align-items: center;
    color: #fafafa;

    &-login {
      color: #fafafa;
      font-family: e-Ukraine, sans-serif;
      text-transform: uppercase;
      font-weight: 600;
      font-size: 14px;

      &:hover {
        color: bisque;
        /* border: 2px solid bisque; */
        opacity: 80%;
      }
    }
  }
}

.header-top > span {
  display: flex;
  gap: clamp(10px, 3vw, 40px); // замість 5em
  justify-content: center;
  align-items: center;
  flex-wrap: nowrap;
}
.header-top__wrapper {
  display: flex;
  align-items: center;
  gap: 16px;
}
.header-top__user {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}
.header-top__avatar-circle {
  width: 32px;
  height: 32px;
  background: #007bff;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  &:hover {
    opacity: 0.7;
  }
}

.header-top__username {
  color: #fff;
  font-size: 14px;
}

.header-top__add {
  border-radius: 8px;
  border-color: #fafafa;
  font-family: e-Ukraine, sans-serif;
  font-size: 14px;
  font-weight: 500;
  padding: 12px 8px;
  cursor: pointer;
  /* background-color: transparent; */

  &:hover {
    /* color: bisque; */
    /* border: 2px solid bisque; */
    opacity: 80%;
  }
}

.burger {
  display: none;
  font-size: 24px;
  color: white;
  cursor: pointer;
}

/* мобільне меню */
.mobile-menu {
  position: absolute;
  top: 70px;
  right: 20px;
  background: #212126;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  z-index: 1000;

  a,
  button {
    color: white;
    text-decoration: none;
    background: none;
    border: none;
    text-align: left;
    cursor: pointer;
  }
}

/* 🔻 breakpoint */
@media (max-width: 1200px) {
  .header-top > span {
    display: none; // ховаємо меню
  }

  .burger {
    display: block;
  }
}
</style>
