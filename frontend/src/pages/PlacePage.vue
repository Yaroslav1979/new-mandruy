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
      <Container>
        <div v-if="place" class="place-page__content">
          <PlaceMainInfo :place="place" :rating="place.rating" />
          <div class="place-page__additional-info">
            <ReviewsAll
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
import SectionWithHeaderSpacer from "../components/shared/SectionWithHeaderSpacer.js";
import PlaceMainInfo from "../components/place/PlaceMainInfo.vue";
import HeaderAllPages from "../components/shared/HeaderAllPages.vue";
import ReviewsAll from "../components/reviews/index.vue";
import AddPlaceForm from "../components/shared/AddPlaceForm.vue";

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
      reviewsList: [], // оголошено для відгуків
      isModalOpen: false, // ДЛЯ МОДАЛКИ
    };
  },
  async created() {
    try {
      console.log("🧭 Route params:", this.$route.params);
      const { id } = this.$route.params;

      // Отримання даних місця
      const { data } = await getPlaceById(id);
      console.log("Дані місця з бекенду:", data);
      this.place = data;

      // Окремо — отримання відгуків
      const { data: reviewsData } = await getReviewsByPlaceId(id);
      console.log("Відгуки з бекенду:", reviewsData);
      this.reviewsList = reviewsData;
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
