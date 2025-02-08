<template>
  <div id="app">
    <h1> {{ text }} </h1>
    <Container>
      <ApartmentFilterForm class="apartments-filter" @submit="(data) => logger(data)" />

    </Container> 
      <!-- <CustomSelect :items="['name', 'label', 'salary']" /> -->
    <!-- <mainButton @click="increment" outlined>Click</mainButton> -->
    <!-- <DirectivesTest /> -->
     <!-- <input type="text" v-model="text"> -->
     <!-- <CustomInput v-model="text" /> -->
   
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
         <!-- @click.native="handlItemClick"         -->
      </template>
    </ApartmentsList>
  </div>  
</template>

<script>
// import mainButton from './components/mainButton.vue'
// import DirectivesTest from './components/DirectivesTest.vue'
import ApartmentsList from './components/apartment/ApartmentsList.vue'
import ApartmentsItem from './components/apartment/ApartmentsItem.vue'
// import CustomInput from './components/shared/CustomInput.vue'
// import CustomSelect from './components/shared/CustomSelect.vue'
import apartments from './components/apartment/apartments'
import ApartmentFilterForm from './components/apartment/ApartmentFilterForm.vue'
import Container from './components/shared/Container.vue'

export default {
  name: 'App',
  components: {
    // mainButton ,
    // DirectivesTest,
    ApartmentsList, 
    ApartmentsItem,
    // CustomInput,
    // CustomSelect,
    ApartmentFilterForm,
    Container
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
  methods: {
   logger(value) {
      console.log(value, '--form value');
    }
  }
}
</script>

<style lang="scss" scoped>
#app {
  font-family: Montserrat, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.apartments-filter {
  margin-bottom: 40px;
}
</style>
