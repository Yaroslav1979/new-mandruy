<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="favorites-modal">
      <button class="close-btn" @click="$emit('close')">×</button>

      <h2 class="modal-title">Обрані місця</h2>

      <p v-if="loading" class="message">Завантаження обраних місць...</p>

      <p v-else-if="error" class="message error">
        {{ error }}
      </p>

      <div v-else-if="places.length" class="favorites-list">
        <PlacesItem
          v-for="place in places"
          :key="place._id"
          :id="place._id"
          :title="place.title"
          :descr="place.descr"
          :img-src="place.imgUrls || []"
          :rating="place.rating || 0"
          :is-favorite="true"
          @toggle-favorite="removeFavorite"
        />
      </div>

      <p v-else class="message">У вас поки немає обраних місць.</p>
    </div>
  </div>
</template>

<script>
import axiosInstance from "../../utils/axios.js";
import PlacesItem from "../place/PlacesItem.vue";

export default {
  name: "FavoritesModal",

  components: {
    PlacesItem,
  },

  emits: ["close"],

  data() {
    return {
      places: [],
      loading: true,
      error: "",
    };
  },

  mounted() {
    this.fetchFavorites();
  },

  methods: {
    async fetchFavorites() {
      this.loading = true;
      this.error = "";

      try {
        const response = await axiosInstance.get("/places/favorites");

        const favorites = Array.isArray(response.data)
          ? response.data
          : response.data.favorites || [];

        this.places = favorites
          .map((favorite) => favorite.placeId || favorite)
          .filter((place) => place && place._id);
      } catch (error) {
        console.error("Помилка завантаження обраного:", error);
        this.error = "Не вдалося завантажити обрані місця.";
      } finally {
        this.loading = false;
      }
    },

    async removeFavorite(placeId) {
      try {
        await axiosInstance.delete(`/places/${placeId}/favorite`);

        this.places = this.places.filter((place) => place._id !== placeId);
      } catch (error) {
        console.error("Помилка видалення з обраного:", error);
        alert("Не вдалося видалити місце з обраного.");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1001;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.favorites-modal {
  position: relative;
  width: 100%;
  max-width: 850px;
  max-height: 85vh;
  overflow-y: auto;
  padding: 30px;
  background: #fff;
  border-radius: 16px;
}

.modal-title {
  margin: 0 35px 20px 0;
  font-size: 22px;
  font-weight: 500;
}

.close-btn {
  position: absolute;
  top: 12px;
  right: 18px;
  border: none;
  background: transparent;
  font-size: 28px;
  cursor: pointer;
}

.message {
  text-align: center;
  padding: 25px 0;
}

.error {
  color: #c62828;
}

.favorites-list {
  display: flex;
  flex-wrap: wrap;
}

@media (max-width: 600px) {
  .favorites-modal {
    padding: 25px 12px;
  }
}
</style>
