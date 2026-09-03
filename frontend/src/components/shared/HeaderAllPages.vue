<template>
  <div class="header-top">
    <LogoType />

    <!-- Десктопна навігація -->
    <span class="header-top__desktop">
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

        <div class="header-top__user">
          <div
            class="header-top__avatar-circle"
            @click="showProfileModal = true"
          >
            {{ userInitial }}
          </div>

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

    <!-- Кнопка бургеру на смартфоні -->
    <button
      class="header-top__burger"
      @click="showMenu = !showMenu"
      :aria-expanded="showMenu"
      aria-label="Відкрити меню"
    >
      <img src="../../../src/assets/png/burger-menu-67.png" alt="Меню" />
    </button>

    <!-- Мобільне меню -->
    <div v-if="showMenu" class="header-top__mobile-menu">
      <router-link
        :to="{ name: 'home' }"
        class="header-top__mobile-link"
        @click="showMenu = false"
      >
        Про сервіс
      </router-link>

      <router-link
        :to="{ name: 'SearchPlacePage' }"
        class="header-top__mobile-link"
        @click="showMenu = false"
      >
        Пошук місць
      </router-link>

      <router-link
        :to="{ name: 'MapPage' }"
        class="header-top__mobile-link"
        @click="showMenu = false"
      >
        Мапа
      </router-link>

      <router-link
        :to="{ name: 'ContactPage' }"
        class="header-top__mobile-link"
        @click="showMenu = false"
      >
        Контакти
      </router-link>

      <!-- Додати місце тільки для авторизованого користувача -->
      <button
        v-if="isAuthenticated"
        class="header-top__mobile-add"
        @click="
          $emit('openAddModal');
          showMenu = false;
        "
      >
        Додати місце
      </button>

      <!-- Реєстрація / Вхід для неавторизованого -->
      <div v-else class="header-top__mobile-auth">
        <router-link
          :to="{ name: 'registration-page' }"
          class="header-top__mobile-link"
          @click="showMenu = false"
        >
          Реєстрація
        </router-link>

        <router-link
          :to="{ name: 'login-page' }"
          class="header-top__mobile-link"
          @click="showMenu = false"
        >
          Вхід
        </router-link>
      </div>
    </div>
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
      showMenu: false,
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
  padding: 16px clamp(20px, 3.5vw, 50px);
  background: #212126;

  // opacity: 0.7;

  position: relative;
  z-index: 1000;

  &__nav {
    display: flex;
    align-items: center;
    justify-content: center;

    width: clamp(90px, 9vw, 140px);
    height: clamp(40px, 3.5vw, 52px);
    padding: 0;

    color: #fff;
    text-align: center;
    font-size: clamp(11px, 1vw, 14px);
    font-style: normal;
    font-weight: 500;
    line-height: 150%;
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
    gap: clamp(8px, 1.2vw, 16px);
    align-items: center;
    color: #fafafa;

    &-login {
      color: #fafafa;
      font-family: e-Ukraine, sans-serif;
      text-transform: uppercase;
      font-weight: 600;
      font-size: clamp(10px, 1vw, 14px);

      &:hover {
        color: bisque;
        opacity: 80%;
      }
    }
  }
}

.header-top > .header-top__desktop {
  display: flex;
  gap: clamp(15px, 3vw, 80px);
  justify-content: center;
  align-items: center;
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
  font-size: clamp(10px, 1vw, 14px);
  font-weight: 500;
  padding: clamp(7px, 0.8vw, 12px) clamp(6px, 0.7vw, 8px);
  cursor: pointer;

  &:hover {
    opacity: 80%;
  }
}

.header-top__burger {
  display: none;

  border: none;
  padding: 0;
  margin: 0;
  background: transparent;
  cursor: pointer;

  img {
    display: block;
    width: 32px;
    height: 32px;
    object-fit: contain;
  }
}

.header-top__mobile-menu {
  display: none;

  position: absolute;
  top: 100%;
  right: 0;
  z-index: 1001;
}

@media (max-width: 900px) {
  .header-top {
    padding: 12px 20px;
  }

  .header-top > .header-top__desktop {
    gap: 12px;
  }

  .header-top__nav {
    width: 85px;
    height: 42px;
    font-size: 11px;
  }

  .header-top__block {
    gap: 8px;
  }

  .header-top__add {
    font-size: 11px;
    padding: 8px 6px;
  }
}

@media (max-width: 750px) {
  .header-top {
    position: relative;
    padding: 12px 16px;
  }

  .header-top > .header-top__desktop {
    display: none;
  }

  .header-top__burger {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .header-top__mobile-menu {
    position: absolute;
    top: 100%;
    right: 0;
    z-index: 100;

    display: flex;
    flex-direction: column;
    align-items: stretch;

    min-width: 220px;
    padding: 16px;

    background: #212126;
    border-radius: 0 0 10px 10px;
    box-shadow: 0 8px 20px rgba(0, 0, 0);
  }

  .header-top__mobile-link {
    padding: 12px 10px;

    color: #fff;
    font-family: e-Ukraine, sans-serif;
    font-size: 14px;
    font-weight: 500;
    text-decoration: none;

    border-bottom: 1px solid rgba(255, 255, 255, 0.2);

    &:hover {
      color: bisque;
    }
  }

  .header-top__mobile-add {
    margin-top: 10px;
    padding: 12px 10px;

    color: #fff;
    font-family: e-Ukraine, sans-serif;
    font-size: 14px;
    font-weight: 500;

    background: #6b76ff;
    border: none;
    border-radius: 6px;
    cursor: pointer;

    &:hover {
      opacity: 0.8;
    }
  }

  .header-top__mobile-auth {
    display: flex;
    flex-direction: column;
  }
}
</style>
