<template>
  <main class="homepage">
    <SectionWithHeaderSpacer>
      <AboutService />
    </SectionWithHeaderSpacer>    
      <SocialNet />  
    <SectionWithHeaderSpacer>
      <Container>
        <PlacesFilterForm class="apartments-filter" @submit="filter" />
      </Container>
      <!-- <Container> -->
        <p v-if="!filteredPlaces.length">Нічого не знайдено</p>
        <PlacesList v-else :items="filteredPlaces">
          <template v-slot:apartment="{ apartment }">
            <PlacesItem
              :key="apartment.id"
              :id="apartment.id"
              :descr="apartment.descr"
              :rating="apartment.rating"
              :imgSrc="apartment.imgUrl"
              :title="apartment.title"
            />
          </template>
        </PlacesList>
      <!-- </Container> -->
    </SectionWithHeaderSpacer>
    <ActiveMap />

    <section>
      

  <AddPlaceForm :categories="categories" />


    </section>
    
    <MainQuastions />
    <ContactsUs />
  </main>
</template>

<script>
import AboutService from "../components/shared/AboutService.vue";
import SocialNet from "../components/shared/SocialNet.vue";
import PlacesList from "../components/place/PlacesList.vue";
import PlacesItem from "../components/place/PlacesItem.vue";
import categories from "../components/categories/categories.js";
import PlacesFilterForm from "../components/place/PlaceFilterForm.vue";
import Container from "../components/shared/Container.vue";
import { getApartmentsList } from "../services/apartments.service";
import SectionWithHeaderSpacer from "../components/shared/SectionWithHeaderSpacer.vue";
import MainQuastions from "../components/shared/MainQuastions.vue";
import ActiveMap from "../components/shared/ActiveMap.vue";
import AddPlaceForm from "../components/shared/AddPlaceForm.vue";
import ContactsUs from "../components/shared/ContactsUs.vue";

export default {
  name: "App",
  components: {
    AboutService,
    SocialNet,
    PlacesList,
    PlacesItem,    
    AddPlaceForm,
    PlacesFilterForm,
    Container,
    SectionWithHeaderSpacer,
    ActiveMap,    
    MainQuastions,
    ContactsUs,
  },

  data() {
    return {
      text: "",
      places: [],
      categories: categories || [],
      filters: {
        city: "",
        price: "",
      },
    };
  },
  computed: {
    filteredPlaces() {
      return this.filterByPrice(this.filterByCityName(this.places));
    },
  },
  async created() {
    try {
      const { data } = await getApartmentsList();
      this.places = data;
    } catch (error) {
      console.error(error);
    }
  },
  methods: {
    filter({ city, price }) {
      if (city !== undefined) this.filters.city = city;
      if (price !== undefined) this.filters.price = price;
    },

    filterByCityName(places) {
      if (!this.filters.city) return places;
      return places.filter(
        (place) =>
          place.location?.city &&
          place.location.city === this.filters.city
      );
    },

    filterByPrice(places) {
      if (!this.filters.price) return places;
      return places.filter(
        (place) => place.price && place.price >= this.filters.price
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.apartments-filter {
  margin-bottom: 40px;
}
</style>
