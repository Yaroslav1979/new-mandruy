<template>
  <div id="app">
    <Notifications />  
    <div class="content"> 
      <AppHeader />
      <router-view />       
    </div>
    
    <AppFooter />    
</div> 
</template>

<script>
// import { useStore } from 'vuex';
// import { computed, onMounted } from 'vue';
import AppFooter from './components/shared/MainFooter';
import AppHeader from './components/shared/MainHeader';
import Notifications from './components/notifications';
import { mapGetters } from 'vuex';

export default {
  name: 'App',
  components: {
    AppFooter,
    AppHeader,
    Notifications
  }, 
  computed: {
    ...mapGetters('auth', ['isLoggedIn'])
  },
  mounted() {
    console.log(this.isLoggedIn);
  }
}
</script>


<style lang="scss" scoped>
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  font-family: Montserrat, Helvetica, Arial, sans-serif;
  /* -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;   */
}
.content {
  flex-grow: 1;
  /* padding-top: 120px; */
}
</style>