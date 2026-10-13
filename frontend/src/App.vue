<template>
  <div id="app">
    <!-- <Notifications />   -->
    <div class="content">
      <router-view />
    </div>

    <AppFooter />
  </div>
</template>

<script>
import AppFooter from "./components/shared/MainFooter";
import { mapGetters } from "vuex";

export default {
  name: "App",
  components: {
    AppFooter,
  },
  computed: {
    ...mapGetters("auth", ["isLoggedIn"]),
  },
  mounted() {
    console.log(this.isLoggedIn);
  },
};
</script>

<style lang="scss">
@font-face {
  font-family: "e-Ukraine";
  src: url("@/assets/fonts/e-Ukraine-Regular.woff2") format("opentype");
  font-weight: 400; /* Regular */
  font-style: normal;
}

/* e-Ukraine Bold */
@font-face {
  font-family: "e-Ukraine";
  src: url("@/assets/fonts/e-Ukraine-Bold.woff2") format("opentype");
  font-weight: 700; /* Bold */
  font-style: normal;
}

#app {
  margin: 0px;
  max-width: 1920px;
  font-family: e-Ukraine, sans-serif;
}
.content {
  flex-grow: 1;
}
</style>
