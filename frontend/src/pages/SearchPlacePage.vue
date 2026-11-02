<template>
  <div class="head">
    <HeaderAllPages @openAddModal="openAddModal" @edit-place="openEditModal" />
  </div>
  <main class="place-page">
    <div
      v-if="isModalOpen"
      class="modal-overlay"
      @click.self="isModalOpen = false"
    >
      <div class="modal-content">
        <template v-if="!isSuccess">
          <AddPlaceForm
            :place-to-edit="editingPlace"
            @added="handleNewPlace"
            @updated="handlePlaceUpdated"
            @close="closeModal"
          />
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

      <PlacesList v-else :items="visiblePlaces">
        <template v-slot:place="{ place }">
          <PlacesItem
            :key="place._id"
            :id="place._id"
            :descr="place.descr"
            :rating="place.rating"
            :imgSrc="place.imgUrls"
            :title="place.title"
            :is-favorite="favoriteIds.includes(place._id)"
            @toggle-favorite="toggleFavorite"
          />
        </template>
      </PlacesList>

      <div v-if="filteredPlaces.length > 10" class="places-pagination">
        <button
          v-if="visiblePlaces.length < filteredPlaces.length"
          class="places-pagination__button"
          type="button"
          @click="showMore"
        >
          Показати більше
        </button>

        <button
          v-else
          class="places-pagination__button"
          type="button"
          @click="collapsePlaces"
        >
          Згорнути
        </button>
      </div>
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
import axiosInstance from "../utils/axios.js";

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
      isSuccess: false,
      editingPlace: null,

      displayedCount: 10,

      // ID місць, які користувач додав до обраного
      favoriteIds: [],

      // ID місць, для яких зараз виконується запит
      favoriteRequests: [],

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

    visiblePlaces() {
      return this.filteredPlaces.slice(0, this.displayedCount);
    },
  },

  async created() {
    await this.fetchPlaces();
    await this.fetchFavorites();
  },

  methods: {
    // =========================
    // ЗАВАНТАЖЕННЯ МІСЦЬ
    // =========================

    async fetchPlaces() {
      try {
        const response = await axiosInstance.get("/places/approved");
        this.places = response.data;
      } catch (error) {
        console.error("Помилка при завантаженні місць:", error);
      }
    },

    // =========================
    // ЗАВАНТАЖЕННЯ ОБРАНОГО
    // =========================

    async fetchFavorites() {
      // Якщо користувач не авторизований, обране не завантажуємо
      if (!localStorage.getItem("token")) {
        this.favoriteIds = [];
        return;
      }

      try {
        const response = await axiosInstance.get("/places/favorites");

        const favorites = Array.isArray(response.data)
          ? response.data
          : response.data.favorites || [];

        this.favoriteIds = favorites
          .map((favorite) => {
            // Підтримуємо як Favorite з populated placeId,
            // так і безпосередньо масив місць
            const place = favorite.placeId || favorite.place || favorite;

            return place?._id ? String(place._id) : null;
          })
          .filter(Boolean);
      } catch (error) {
        console.error("Помилка при завантаженні обраного:", error);
      }
    },

    // =========================
    // ДОДАВАННЯ / ВИДАЛЕННЯ ОБРАНОГО
    // =========================

    async toggleFavorite(placeId) {
      const id = String(placeId);

      // Не дозволяємо повторні запити для одного місця
      if (this.favoriteRequests.includes(id)) {
        return;
      }

      // Перевіряємо авторизацію
      if (!localStorage.getItem("token")) {
        alert("Щоб додавати місця в обране, увійдіть у свій акаунт.");
        return;
      }

      const isFavorite = this.favoriteIds.includes(id);

      this.favoriteRequests.push(id);

      try {
        if (isFavorite) {
          await axiosInstance.delete(`/places/${id}/favorite`);

          this.favoriteIds = this.favoriteIds.filter(
            (favoriteId) => favoriteId !== id,
          );
        } else {
          await axiosInstance.post(`/places/${id}/favorite`);

          this.favoriteIds.push(id);
        }
      } catch (error) {
        console.error("Помилка зміни обраного:", error);

        if (error.response?.status === 401) {
          alert("Ваша сесія завершилася. Увійдіть в акаунт повторно.");
        } else if (error.response?.status === 403) {
          alert("У вас немає дозволу виконати цю дію.");
        } else {
          alert("Не вдалося змінити список обраного.");
        }
      } finally {
        this.favoriteRequests = this.favoriteRequests.filter(
          (requestId) => requestId !== id,
        );
      }
    },

    // =========================
    // ФІЛЬТРАЦІЯ
    // =========================

    filter({ region, title, categoryIds, sortBy }) {
      if (region !== undefined) this.filters.region = region;
      if (title !== undefined) this.filters.title = title;

      if (Array.isArray(categoryIds)) {
        this.filters.categoryIds = categoryIds;
      }

      if (sortBy !== undefined) this.filters.sortBy = sortBy;

      this.displayedCount = 10;
    },

    filterByRegionName(places) {
      if (!this.filters.region) return places;

      return places.filter(
        (place) =>
          place.location?.region &&
          place.location.region === this.filters.region,
      );
    },

    filterByTitle(places) {
      if (!this.filters.title) return places;

      return places.filter((place) =>
        place.title.toLowerCase().includes(this.filters.title.toLowerCase()),
      );
    },

    filterByCategory(places) {
      if (!this.filters.categoryIds.length) return places;

      return places.filter(
        (place) =>
          Array.isArray(place.categoryIds) &&
          place.categoryIds.some((cat) =>
            this.filters.categoryIds.includes(cat),
          ),
      );
    },

    sortPlacesByTitle(places) {
      return [...places].sort((a, b) => a.title.localeCompare(b.title));
    },

    // =========================
    // ПАГІНАЦІЯ
    // =========================

    showMore() {
      this.displayedCount += 10;
    },

    collapsePlaces() {
      this.displayedCount = 10;
    },

    // =========================
    // РЕДАГУВАННЯ АВТОРОМ СВОГО МІСЦЯ
    // =========================

    openAddModal() {
      this.editingPlace = null;
      this.isSuccess = false;
      this.isModalOpen = true;
    },

    openEditModal(place) {
      this.editingPlace = { ...place };
      this.isSuccess = false;
      this.isModalOpen = true;
    },

    handlePlaceUpdated(updatedPlace) {
      const index = this.places.findIndex(
        (place) => place._id === updatedPlace._id,
      );

      if (index !== -1) {
        this.places.splice(index, 1, updatedPlace);
      }

      this.closeModal();
    },

    // =========================
    // ДОДАВАННЯ МІСЦЯ
    // =========================

    handleNewPlace(newPlace) {
      this.places.unshift(newPlace);
      this.isSuccess = true;
    },

    closeModal() {
      this.isModalOpen = false;
      this.isSuccess = false;
      this.editingPlace = null;
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

  .places-pagination {
    display: flex;
    justify-content: center;
    margin-top: 30px;
    padding-bottom: 30px;

    &__button {
      padding: 12px 30px;

      border: none;
      border-radius: 6px;

      background-color: #111;
      color: #fff;

      font-family: e-Ukraine, sans-serif;
      font-size: 16px;

      cursor: pointer;

      transition: opacity 0.2s;

      &:hover {
        opacity: 0.8;
      }
    }
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
