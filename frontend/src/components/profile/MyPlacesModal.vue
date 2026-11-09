<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="places-modal">
      <button class="close-btn" @click="$emit('close')">×</button>

      <h2 class="modal-title">Мої місця</h2>

      <p v-if="loading" class="message">Завантаження місць...</p>
      <p v-else-if="error" class="message error">{{ error }}</p>

      <template v-else-if="places.length">
        <div v-for="place in places" :key="place._id" class="my-place">
          <PlacesItem
            :id="place._id"
            :title="place.title"
            :descr="place.descr"
            :img-src="place.imgUrls || []"
            :rating="place.rating || 0"
            :show-favorite="false"
          />

          <div class="my-place__info">
            <span class="status" :class="statusClass(place)">
              {{ statusText(place) }}
            </span>

            <div class="my-place__actions">
              <button class="action-btn" @click="$emit('edit-place', place)">
                Редагувати
              </button>

              <button
                class="action-btn action-btn--delete"
                @click="deletePlace(place)"
              >
                Видалити
              </button>
            </div>
          </div>
        </div>
      </template>

      <p v-else class="message">Ви ще не додали жодного місця.</p>
    </div>
  </div>
</template>

<script>
import axiosInstance from "../../utils/axios.js";
import PlacesItem from "../place/PlacesItem.vue";

export default {
  name: "MyPlacesModal",

  components: {
    PlacesItem,
  },

  emits: ["close", "edit-place"],

  data() {
    return {
      places: [],
      loading: true,
      error: "",
    };
  },

  mounted() {
    this.fetchMyPlaces();
  },

  methods: {
    async fetchMyPlaces() {
      this.loading = true;
      this.error = "";

      try {
        const response = await axiosInstance.get("/places/my");

        this.places = Array.isArray(response.data)
          ? response.data
          : response.data.places || [];
      } catch (error) {
        console.error("Помилка завантаження моїх місць:", error);
        this.error = "Не вдалося завантажити ваші місця.";
      } finally {
        this.loading = false;
      }
    },

    statusText(place) {
      if (place.isApproved && place.pendingChanges) {
        return "Опубліковане";
      }

      if (place.isApproved) {
        return "Опубліковане";
      }

      return "Очікує модерації";
    },

    statusClass(place) {
      if (place.isApproved && place.pendingChanges) {
        return "status--pending-changes";
      }

      return place.isApproved ? "status--approved" : "status--pending";
    },

    async deletePlace(place) {
      const confirmed = window.confirm(
        `Видалити місце «${place.title}»? Цю дію неможливо скасувати.`,
      );

      if (!confirmed) return;

      try {
        await axiosInstance.delete(`/places/${place._id}`);

        this.places = this.places.filter((item) => item._id !== place._id);
        alert("Місце успішно видалено!");
      } catch (error) {
        console.error("Помилка видалення місця:", error);
        alert("Не вдалося видалити місце.");
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

.places-modal {
  position: relative;
  width: 100%;
  max-width: 750px;
  max-height: 85vh;
  overflow-y: auto;
  padding: 30px;
  background: #fff;
  border-radius: 16px;
}

.modal-title {
  margin: 0 35px 25px 0;
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

.my-place {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 15px 0;
  border-bottom: 1px solid #ddd;
}

.my-place :deep(.places-item) {
  width: 50%;
  margin: 0;
}

.my-place__info {
  flex: 1;
  min-width: 0;
}

.status {
  display: inline-block;
  margin-bottom: 15px;
  font-size: 13px;
  line-height: 1.5;
}

.status--approved {
  color: #23833b;
}

.status--pending {
  color: #b7791f;
}

.status--pending-changes {
  color: #b7791f;
}

.my-place__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.action-btn {
  padding: 8px 12px;
  border: 1px solid #222;
  border-radius: 6px;
  background: transparent;
  cursor: pointer;
  font-size: 12px;
}

.action-btn:hover {
  background: #222;
  color: #fff;
}

.action-btn--delete {
  border-color: #c62828;
  color: #c62828;
}

.action-btn--delete:hover {
  background: #c62828;
  color: #fff;
}

@media (max-width: 600px) {
  .places-modal {
    padding: 25px 15px;
  }

  .my-place {
    flex-direction: column;
    align-items: stretch;
  }

  .my-place :deep(.places-item) {
    width: 100%;
  }
}
</style>
