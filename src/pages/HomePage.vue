<template>
  <main class="homepage">
    <SectionWithHeaderSpacer>
      <AboutService />
    </SectionWithHeaderSpacer>
    <SectionWithHeaderSpacer>
      <SocialNet />
    </SectionWithHeaderSpacer>

    <SectionWithHeaderSpacer>
      <Container>
        <ApartmentFilterForm class="apartments-filter" @submit="filter" />
      </Container>
      <Container>
        <p v-if="!filteredApartments.length">Нічого не знайдено</p>
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
import ApartmentsList from "../components/apartment/ApartmentsList.vue";
import ApartmentsItem from "../components/apartment/ApartmentsItem.vue";
import categories from "../components/categories/categories.js";
import ApartmentFilterForm from "../components/apartment/ApartmentFilterForm.vue";
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
    ApartmentsList,
    ApartmentsItem,    
    AddPlaceForm,
    ApartmentFilterForm,
    Container,
    SectionWithHeaderSpacer,
    ActiveMap,    
    MainQuastions,
    ContactsUs,
  },

  data() {
    return {
      text: "",
      apartments: [],
      categories: categories || [],
      filters: {
        city: "",
        price: "",
      },
    };
  },
  computed: {
    filteredApartments() {
      return this.filterByPrice(this.filterByCityName(this.apartments));
    },
  },
  async created() {
    try {
      const { data } = await getApartmentsList();
      this.apartments = data;
    } catch (error) {
      console.error(error);
    }
  },
  methods: {
    filter({ city, price }) {
      if (city !== undefined) this.filters.city = city;
      if (price !== undefined) this.filters.price = price;
    },

    filterByCityName(apartments) {
      if (!this.filters.city) return apartments;
      return apartments.filter(
        (apartment) =>
          apartment.location?.city &&
          apartment.location.city === this.filters.city
      );
    },

    filterByPrice(apartments) {
      if (!this.filters.price) return apartments;
      return apartments.filter(
        (apartment) => apartment.price && apartment.price >= this.filters.price
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
