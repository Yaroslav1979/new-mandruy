<template>
  <div id="app">
    <h1> {{title}} </h1>
    <mainButton @click="increment">Click</mainButton>
  </div>  
</template>

<script>
import mainButton from './components/mainButton.vue'


export default {
  name: 'App',
  components: {
    mainButton   
  },
  data() {
    return {
      amountOfClick: 0,
    }
  },
  computed: {
    title() {
      return `Amount of clicks ${this.amountOfClick}`
    }
  },
  methods: {
    increment() {
      this.amountOfClick += 1
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
