<template>
    <main class="homepage">
        <Container>       
            <ApartmentFilterForm class="apartments-filter"
            @submit="filter" 
            />
        </Container> 
        <Container>
        <p v-if="!filteredApartments.length"> Нічого не знайдено </p>
        <ApartmentsList v-else :items="filteredApartments">
   
        <template v-slot:apartment="{ apartment }"> 
            <ApartmentsItem 
               :key="apartment.id"
               :id="apartment.id"
               :descr="apartment.descr"
               :rating="apartment.rating"
               :imgSrc="apartment.imgUrl"
               :price="apartment.price"                
             />        
        </template> 
        </ApartmentsList>
        </Container>
    </main>
  </template>
  
  <script>
  import ApartmentsList from '../components/apartment/ApartmentsList.vue'
  import ApartmentsItem from '../components/apartment/ApartmentsItem.vue'
  import apartments from '../components/apartment/apartments'
  import ApartmentFilterForm from '../components/apartment/ApartmentFilterForm.vue'
  import Container from '../components/shared/Container.vue' 
  
  export default {
    name: 'App',
    components: {   
      ApartmentsList, 
      ApartmentsItem,   
      ApartmentFilterForm,
      Container,      
    },
   
    data() {
      return {
        text: '',
        apartments,  
        filters: {
          city: '',
          price: '',
        }  
      }
    },
    computed: {
      filteredApartments() {
      return this.filterByPrice(this.filterByCityName(this.apartments));
    }
  },
    methods: {
      filter({ city, price }) {
    if (city !== undefined) this.filters.city = city;
    if (price !== undefined) this.filters.price = price;  
  }, 
  
    filterByCityName(apartments) {  
    if (!this.filters.city) return apartments;
    return apartments.filter(apartment => 
      apartment.location?.city && apartment.location.city === this.filters.city
    );
  },
  
  filterByPrice(apartments) {  
    if (!this.filters.price) return apartments;
    return apartments.filter(apartment => 
      apartment.price && apartment.price >= this.filters.price
    );
  },
    }
  }
  
  </script>
  
  <style lang="scss" scoped>
  
  .apartments-filter {
    margin-bottom: 40px;
  }
  </style>