<template>
  <div :id="$style.app">
    <h1> {{title}} </h1>
    <!-- <mainButton @click="increment" outlined>Click</mainButton> -->
    <!-- <DirectivesTest /> -->
    <StarRating :rating="4"/>
  </div>  
</template>

<script>
// import mainButton from './components/mainButton.vue'
// import DirectivesTest from './components/DirectivesTest.vue'
import StarRating from './components/StarRating.vue'

export default {
  name: 'App',
  components: {
    // mainButton ,
    // DirectivesTest,
    StarRating 
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

<style module>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
