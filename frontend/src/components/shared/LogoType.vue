<template>
    <!-- <img  src="../../assets/svg/logo.svg" alt="logo" class="logo" /> -->
    <router-link
        :to="{ name: 'home', query: { name: 'Yarik' } }"        
      >
      <img  src="../../assets/svg/logo.svg" alt="logo" class="logo" />
      </router-link>
</template>

<script>
    export default {
        name: "LogoType",
    }
</script>

<style lang="scss" scoped>
.logo {
  padding: 4px 16px 4px 16px;
  /* border: 1px solid white; */
  border-radius: 16px;
  cursor: pointer;
}
.logo:hover {
  opacity: 70%;
  color: bisque;
  border: 1px solid bisque;
  padding: 3px 15px 3px 15px;
}
</style>