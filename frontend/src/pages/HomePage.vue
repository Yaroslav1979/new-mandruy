<template>
  <AppHeader />
  <main class="homepage">
    <SectionWithHeaderSpacer>
      <AboutService />
    </SectionWithHeaderSpacer>

    <SocialNet />

    <SectionWithHeaderSpacer>

      <PlacesFilterForm class="places-filter" @submit="filter" />

      <p v-if="!filteredPlaces.length">Нічого не знайдено</p>

      <PlacesList v-else :items="filteredPlaces">
        <template v-slot:place="{ place }">
          <PlacesItem
            :key="place._id"
            :id="place._id"
            :descr="place.descr"
            :rating="place.rating"
            :imgSrc="place.imgUrls"
            :title="place.title"
          />
        </template>
      </PlacesList>
    </SectionWithHeaderSpacer>

    <ActiveMap />

    <AddPlaceForm :categories="categories" @added="handleNewPlace"/>

    <MainQuastions />

    <ContactsUs />
  </main>
</template>

<script>
import AppHeader from "../components/shared/MainHeader";
import AboutService from "../components/shared/AboutService.vue";
import SocialNet from "../components/shared/SocialNet.vue";
import PlacesList from "../components/place/PlacesList.vue";
import PlacesItem from "../components/place/PlacesItem.vue";
import PlacesFilterForm from "../components/place/PlaceFilterForm.vue";
import SectionWithHeaderSpacer from "../components/shared/SectionWithHeaderSpacer.vue";
import MainQuastions from "../components/shared/questions/MainQuastions.vue";
import ActiveMap from "../components/shared/ActiveMap.vue";
import AddPlaceForm from "../components/shared/AddPlaceForm.vue";
import ContactsUs from "../components/shared/ContactsUs.vue";
import axios from "axios";

export default {
  name: "App",
  components: {
    AboutService,
    SocialNet,
    PlacesList,
    PlacesItem,
    AddPlaceForm,
    PlacesFilterForm,
    AppHeader,
    SectionWithHeaderSpacer,
    ActiveMap,
    MainQuastions,
    ContactsUs,
  },

  data() {
    return {
      places: [],
      filters: {
        title: "",
        region: "",
        categoryIds: [],
        sortBy: "",
      },
    };
  },
  computed: {
    filteredPlaces() {
  let result = this.filterByRegionName(this.places);
  result = this.filterByTitle(result);
  result = this.filterByCategory(result);

  if (this.filters.sortBy === "title") {
    result = this.sortPlacesByTitle(result);
  }

  return result;
},
  },
  async created() {
  try {
    const response = await axios.get("http://localhost:3000/api/places");
    this.places = response.data; // ВАЖЛИВО: тут лежить масив місць з бази (MongoDB Atlas)
  } catch (error) {
    console.error("Помилка при завантаженні місць:", error);
  }
},

  methods: {
    filter({ region, title, categoryIds, sortBy }) {
  if (region !== undefined) this.filters.region = region;
  if (title !== undefined) this.filters.title = title;
  if (Array.isArray(categoryIds)) this.filters.categoryIds = categoryIds;
  if (sortBy !== undefined) this.filters.sortBy = sortBy; // нове
},
  

  filterByRegionName(places) {
      if (!this.filters.region) return places;
      return places.filter(
        (place) =>
          place.location?.region &&
          place.location.region === this.filters.region
      );
  },

  filterByTitle(places) {
      if (!this.filters.title) return places;
      return places.filter(
        (place) => place.title.toLowerCase().includes(this.filters.title.toLowerCase())
      );
    },

    filterByCategory(places) {
      if (!this.filters.categoryIds.length) return places;
      return places.filter(place => 
        Array.isArray(place.categoryIds) &&
        place.categoryIds.some(cat => this.filters.categoryIds.includes(cat))
      );
    },

    sortPlacesByTitle(places) {
     return [...places].sort((a, b) => a.title.localeCompare(b.title));
  },

  handleNewPlace(newPlace) {
  this.places.unshift(newPlace); // або this.places.push(newPlace), якщо хочеш додати в кінець списку
}

  },  
};
</script>

<style lang="scss" scoped>

.homepage {
  width: 100%;
  margin: 0 auto;
}
</style>


