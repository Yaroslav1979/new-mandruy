<template>
  <div class="head">
  <HeaderAllPages />
  </div>
  <main class="place-page">
    <SectionWithHeaderSpacer>
      <Container>
        <div v-if="place" class="place-page__content">
          <PlaceMainInfo :place="place" />
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
import SectionWithHeaderSpacer from "../components/shared/SectionWithHeaderSpacer";
import PlaceMainInfo from "../components/place/PlaceMainInfo.vue";
import HeaderAllPages from "../components/shared/HeaderAllPages.vue";
import ReviewsAll from "../components/reviews/index.vue";
// import reviewsList from "../components/reviews/reviews.json";

export default {
  name: "PlacePage",
  components: {
    Container,
    PlaceMainInfo,
    HeaderAllPages,    
    ReviewsAll,
    SectionWithHeaderSpacer,
  },
  data() {
    return {
      place: null,
      reviewsList: [], // оголошено для відгуків
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
  }
}
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
}
</style>
