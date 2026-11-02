<template>
  <div class="head">
    <HeaderAllPages @openAddModal="openAddModal" @edit-place="openEditModal" />
    <!-- <HeaderAllPages @openAddModal="isModalOpen = true" /> -->
  </div>

  <main class="place-page">
    <div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal">
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
            <p>
              {{
                editingPlace
                  ? "Зміни успішно збережено!"
                  : "Місце успішно додано!"
              }}
            </p>
            <button @click="closeModal">Добре</button>
          </div>
        </template>
      </div>
    </div>
    <SectionWithHeaderSpacer>
      <Container>
        <p v-if="isChangesPreview" class="changes-preview-label">
          Попередній перегляд запропонованих змін. Ця версія ще не опублікована.
        </p>
        <div v-if="place" class="place-page__content">
          <PlaceMainInfo
            :place="place"
            :rating="place.rating"
            :show-rating="!isAdminPreview"
          />
          <div class="place-page__additional-info">
            <ReviewsAll
              v-if="!isAdminPreview"
              :reviews="reviewsList"
              :placeId="place._id"
              @review-added="fetchReviews"
            />
          </div>
        </div>
        <div v-else class="place-page__loading">
          <p>Завантаження місця...</p>
        </div>
      </Container>
    </SectionWithHeaderSpacer>
  </main>
</template>

<script>
import { getPlaceById } from "../services/places.service.js";
import { getReviewsByPlaceId } from "../services/reviews.service.js";
import Container from "../components/shared/Container.vue";
import SectionWithHeaderSpacer from "../components/shared/SectionWithHeaderSpacer";
import PlaceMainInfo from "../components/place/PlaceMainInfo.vue";
import HeaderAllPages from "../components/shared/HeaderAllPages.vue";
import ReviewsAll from "../components/reviews/index.vue";
import AddPlaceForm from "../components/shared/AddPlaceForm.vue";
import axiosInstance from "../utils/axios.js";

export default {
  name: "PlacePage",
  components: {
    Container,
    PlaceMainInfo,
    HeaderAllPages,
    ReviewsAll,
    SectionWithHeaderSpacer,
    AddPlaceForm,
  },
  data() {
    return {
      place: null,
      editingPlace: null,
      isSuccess: false,
      reviewsList: [], // оголошено для відгуків
      isModalOpen: false, // ДЛЯ МОДАЛКИ
      isChangesPreview: false,
      isAdminPreview: false,
    };
  },

  async created() {
    try {
      console.log("🧭 Route params:", this.$route.params);

      const { id } = this.$route.params;

      // Перевіряємо, чи відкрито режим перегляду запропонованих змін
      this.isChangesPreview = this.$route.query.previewChanges === "true";

      // Визначаємо, чи це адміністративний попередній перегляд
      this.isAdminPreview =
        this.isChangesPreview || this.$route.query.previewNew === "true";

      // Отримуємо основні дані опублікованого місця
      const { data } = await getPlaceById(id);

      let placeData = data;

      // Якщо це перегляд запропонованих змін
      if (this.isChangesPreview) {
        const response = await axiosInstance.get("/places/pending-changes");

        const pendingPlace = response.data.find(
          (item) => String(item._id) === String(id),
        );

        if (!pendingPlace || !pendingPlace.pendingChanges) {
          throw new Error("Запропоновані зміни цього місця не знайдено.");
        }

        // Поєднуємо основний документ із запропонованими змінами
        placeData = {
          ...data,
          ...pendingPlace.pendingChanges,
          _id: data._id,
          rating: data.rating,
        };
      }

      this.place = placeData;

      console.log(
        this.isChangesPreview
          ? "Перегляд запропонованих змін:"
          : "Дані опублікованого місця:",
        this.place,
      );

      // Завантажуємо відгуки лише для звичайного перегляду
      if (!this.isAdminPreview) {
        const { data: reviewsData } = await getReviewsByPlaceId(id);
        this.reviewsList = reviewsData;
      }
    } catch (error) {
      console.error("❌ Помилка при завантаженні даних:", error);
    }
  },

  methods: {
    async fetchReviews() {
      try {
        console.log("Подія review-added отримана!🔄 Оновлення відгуків...");
        const { id } = this.$route.params;
        const { data: reviewsData } = await getReviewsByPlaceId(id);
        this.reviewsList = reviewsData;
      } catch (err) {
        console.error("❌ Помилка при оновленні відгуків:", err);
      }
    },

    // Відкриття форми редагування вибраного місця
    handleEditPlace(place) {
      this.editingPlace = place;
      this.isSuccess = false;
      this.isModalOpen = true;
    },

    // Успішне додавання нового місця
    async handleNewPlace() {
      await this.fetchApprovedPlaces();
      this.isSuccess = true;
    },

    // Успішне редагування місця
    async handlePlaceUpdated() {
      await this.fetchApprovedPlaces();
      this.isSuccess = true;
    },

    // Закриття модального вікна
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
  background-color: black;
}

.place-page {
  &__content {
    display: flex;
    align-items: flex-start;
    gap: 30px;
  }

  &__additional-info {
    // width: 30%;
    max-width: 350px;
    flex: 0 0 30%;
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
  .changes-preview-label {
    padding: 12px 16px;
    margin-bottom: 20px;
    background: #fff3cd;
    border: 1px solid #ffe69c;
    border-radius: 6px;
    color: #664d03;
    font-size: 14px;
  }
}

@media (max-width: 900px) {
  .place-page {
    &__content {
      flex-direction: column;
      align-items: stretch;
      gap: 30px;
    }

    &__additional-info {
      width: 100%;
      max-width: 100%;
      flex: none;
      margin: 0;
    }
  }
}

/* =========================
   СМАРТФОН
   ========================= */

@media (max-width: 600px) {
  .place-page {
    &__content {
      width: 100%;
    }

    &__additional-info {
      width: 100%;
      max-width: 100%;
    }
  }

  .modal-content {
    padding: 1rem;
  }
}
</style>
