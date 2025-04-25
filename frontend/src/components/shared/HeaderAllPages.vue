<template>
  <div class="header-top">
    <LogoType />
    <span>
      <a href="#service" class="header-top__nav">Про сервіс </a>

      <router-link
        :to="{ name: 'SearchPlacePage', query: { name: 'Yarik' } }"
        class="header-top__nav"
      >
        Пошук місць
      </router-link>

      <button class="header-top__nav" @click="$emit('openAddModal')">
        Додати місце
      </button>
      <!-- <button class="header-top__nav" @click="$emit('openAddModal')">Додати місце</button> -->
      <a href="#contacts" class="header-top__nav">Контакти </a>
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
  justify-content: space-around;
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
  font-size: 12px;
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
}
.header-top__nav:hover {
  color: bisque;
  border: 2px solid bisque;
  opacity: 80%;
}
</style>
