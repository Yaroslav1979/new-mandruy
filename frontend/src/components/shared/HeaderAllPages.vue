<template>
  <div class="header-top">
    <LogoType />
    <span>
      <router-link
        :to="{ name: 'home', query: { name: 'Yarik' } }"
        class="header-top__nav"
      >
        Про сервіс
      </router-link>

      <router-link
        :to="{ name: 'SearchPlacePage', query: { name: 'Yarik' } }"
        class="header-top__nav"
      >
        Пошук місць
      </router-link>

      <router-link
        :to="{ name: 'MapPage', query: { name: 'Yarik' } }"
        class="header-top__nav"
      >
        Мапа
      </router-link>

      <router-link
        :to="{ name: 'ContactPage', query: { name: 'Yarik' } }"
        class="header-top__nav"
      >
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

          <!-- <span v-if="user" class="header-top__username">{{ user.name }}</span> -->
        </div>

        <!-- <span>
          <button class="header-top__logout" @click="handleLogout">Вийти</button>
        </span> -->
      </div>

      <div v-else class="header-top__block">
        <router-link
          :to="{ name: 'registration-page', query: { name: 'Yarik' } }"
          class="header-top__block-login"
        >
          Реєстрація
        </router-link>
        /
        <router-link
          :to="{ name: 'login-page', query: { name: 'Yarik' } }"
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
  /* gap: 50px; */
  /* margin: 10px; */
  padding: 16px 50px;
  background: #212126;
  opacity: 0.7;

  &__nav {
    color: #fff;
    text-align: center;
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 150%;
    font-family: e-Ukraine, sans-serif;
    text-decoration: none;
    padding: 16px 0;
    width: 140px;
    height: 52px;
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
  gap: 5em;
  justify-content: center;
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
</style>
