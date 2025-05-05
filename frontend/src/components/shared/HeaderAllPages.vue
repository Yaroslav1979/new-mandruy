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
      <!-- <a href="#service" class="header-top__nav">Про сервіс </a> -->

      
      
      <router-link
        :to="{ name: 'SearchPlacePage', query: { name: 'Yarik' } }"
        class="header-top__nav"
      >
        Пошук місць
      </router-link>

      <button class="header-top__nav" @click="$emit('openAddModal')">
        Додати місце
      </button>

      <router-link
        :to="{ name: 'MapPage', query: { name: 'Yarik' } }"
        class="header-top__nav"
      >
        Мапа
      </router-link>
      <!-- <button class="header-top__nav" @click="$emit('openAddModal')">Додати місце</button> -->
      <router-link
        :to="{ name: 'ContactPage', query: { name: 'Yarik' } }"
        class="header-top__nav"
      >
      Контакти
      </router-link>

      <div class="header-top__block">
        <router-link
        :to="{ name: 'registration-page', query: { name: 'Yarik' } }"
        class="header-top__block-login"      >
      
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

export default {
  name: "HeaderAllPages",
  components: {
    LogoType,
  },
  emits: ["openAddModal"],
};
</script>

<style lang="scss" scoped>
@import "../../assets/scss/variables.scss";

.header-top {
  display: flex;
  justify-content: space-between;
  /* margin: 10px; */
  padding: 16px 50px;
}

.header-top > span {
  display: flex;
  gap: 100px;
  justify-content: center;
}

.header-top__nav {
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

.header-top__block {
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
</style>
