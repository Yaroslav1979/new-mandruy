<template>
  <div class="head">
    <HeaderAllPages @openAddModal="isModalOpen = true" />
  </div>
  <main class="place-page">
    <div
      v-if="isModalOpen"
      class="modal-overlay"
      @click.self="isModalOpen = false"
    >
      <div class="modal-content">
        <template v-if="!isSuccess">
          <AddPlaceForm @added="handleNewPlace" />
        </template>

        <template v-else>
          <div class="success-message">
            <p>Місце успішно додано!</p>
            <button @click="closeModal">Добре</button>
          </div>
        </template>
      </div>
    </div>
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
  </main>
</template>

<script>
import SectionWithHeaderSpacer from "../components/shared/SectionWithHeaderSpacer";
import AddPlaceForm from "../components/shared/AddPlaceForm.vue";
import HeaderAllPages from "../components/shared/HeaderAllPages.vue";
import PlacesList from "../components/place/PlacesList.vue";
import PlacesItem from "../components/place/PlacesItem.vue";
import PlacesFilterForm from "../components/place/PlaceFilterForm.vue";
import axios from "axios";

export default {
  name: "SearchPlacePage",
  components: {
    HeaderAllPages,
    SectionWithHeaderSpacer,
    AddPlaceForm,
    PlacesList,
    PlacesItem,
    PlacesFilterForm,
  },
  data() {
    return {
      places: [],
      isModalOpen: false,
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
      const placesResponse = await axios.get("http://localhost:3000/api/places/approved");
      const places = placesResponse.data;

      // Вже використовується рейтинг, що приходить з сервера
      this.places = places;
    } catch (error) {
      console.error("Помилка при завантаженні місць:", error);
    }
  },

  methods: {
    filter({ region, title, categoryIds, sortBy }) {
      if (region !== undefined) this.filters.region = region;
      if (title !== undefined) this.filters.title = title;
      if (Array.isArray(categoryIds)) this.filters.categoryIds = categoryIds;
      if (sortBy !== undefined) this.filters.sortBy = sortBy;
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
      return places.filter((place) =>
        place.title.toLowerCase().includes(this.filters.title.toLowerCase())
      );
    },

    filterByCategory(places) {
      if (!this.filters.categoryIds.length) return places;
      return places.filter(
        (place) =>
          Array.isArray(place.categoryIds) &&
          place.categoryIds.some((cat) =>
            this.filters.categoryIds.includes(cat)
          )
      );
    },

    sortPlacesByTitle(places) {
      return [...places].sort((a, b) => a.title.localeCompare(b.title));
    },

    handleNewPlace(newPlace) {
      this.places.unshift(newPlace); // або this.places.push(newPlace), якщо хочеш додати в кінець списку
    },
  },
};
</script>



<style lang="scss" scoped>
.head {
  background-color: #111;
}
.place-page {
  &__content {
    display: flex;
    align-items: flex-start;
  }

  &__additional-info {
    margin-left: 30px;
    max-width: 350px;
    flex-grow: 0;
    flex-shrink: 1;
  }
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
    padding: 1rem;
    box-sizing: border-box;
  }

  .modal-content {
    background: #fff;
    padding: 2rem;
    border-radius: 16px;
    max-width: 1300px;
    width: 100%;
    box-sizing: border-box;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
    overflow-y: auto;
    max-height: 90vh;
  }
  .success-message {
  text-align: center;
  font-family: e-Ukraine, sans-serif;
  font-size: 18px;
}

.success-message button {
  margin-top: 20px;
  padding: 12px 24px;
  background-color: black;
  color: white;
  border-radius: 5px;
  border: none;
  cursor: pointer;
}
}
</style>
