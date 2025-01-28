<template>
  <div :id="$style.app">
    <!-- <h1> {{title}} </h1> -->
    <!-- <mainButton @click="increment" outlined>Click</mainButton> -->
    <!-- <DirectivesTest /> -->
    <ApartmentsItem 
    :descr="apartment.descr"
    :price="apartment.price"
    :rating="apartment.rating"
    imgSrc="https://picsum.photos/id/10/300/300"
    />
  </div>  
</template>

<script>
// import mainButton from './components/mainButton.vue'
// import DirectivesTest from './components/DirectivesTest.vue'
import ApartmentsItem from './components/apartment/ApartmentsItem.vue'

export default {
  name: 'App',
  components: {
    // mainButton ,
    // DirectivesTest,
    ApartmentsItem, 
  },
 
  data() {
    return {
      apartment: {
        id: '3265652',
        title: 'Lorum jbqw3r',
        descr: 'loerfqbgerfg bwergh jkwergj regjuhcvm , lwerkghodf. mksldwgo',
        price: 1258.00,
        rating: 4.5,
        lacation: {
          city: 'Rivne',          
        },
        owner: {
          name: 'Olga',
          phone: '125-25-2152',
          email: 'fr@gr.com'
        },
      },
    }
  },
  // computed: {
  //   title() {
  //     return `Amount of clicks ${this.amountOfClick}`
  //   }
  // },
  // methods: {
  //   increment() {
  //     this.amountOfClick += 1
  //   }
  // }
}
</script>

<style module>
#app {
  font-family: Montserrat, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
