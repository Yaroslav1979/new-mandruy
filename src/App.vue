<template>
  <div :id="$style.app">
    <h1> {{ text }} </h1>
      
    <!-- <mainButton @click="increment" outlined>Click</mainButton> -->
    <!-- <DirectivesTest /> -->
     <!-- <input type="text" v-model="text"> -->
     <CustomInput v-model="text" />
   <ApartmentsList :items="apartments">
    <!-- <template v-slot:title>New title</template> -->
    <template v-slot:apartment="{ apartment }"> 
      <ApartmentsItem 
              :key="apartment.id"
              :descr="apartment.descr"
              :rating="apartment.rating"
              :imgSrc="apartment.imgUrl"
              :price="apartment.price"            
         />
      </template>
    </ApartmentsList>
  </div>  
</template>

<script>
// import mainButton from './components/mainButton.vue'
// import DirectivesTest from './components/DirectivesTest.vue'
import ApartmentsList from './components/apartment/ApartmentsList.vue'
import ApartmentsItem from './components/apartment/ApartmentsItem.vue'
import CustomInput from './components/shared/CustomInput.vue'
import apartments from './components/apartment/apartments'

export default {
  name: 'App',
  components: {
    // mainButton ,
    // DirectivesTest,
    ApartmentsList, 
    ApartmentsItem,
    CustomInput,
  },
 
  data() {
    return {
      text: '',
      apartments,      
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
