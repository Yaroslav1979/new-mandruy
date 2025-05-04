<template>
  <section class="reviews">
    <div class="reviews__heading">
      <h2 class="reviews__title">Відгуки</h2>
      <div class="reviews__rating">
        <div> Кількість відгуків: {{ amountOfReviews }} </div>
        <div>Підсумковий рейтинг: <Rating :rating="totalRating" /></div>
      </div>
      <!-- Кнопка для виклику форми -->
     <button class="leave-review-button" @click="toggleModal">
      {{ showModal ? "Приховати" : "Залишити відгук" }}
    </button>
    </div>
     
    <!-- Модальне вікно з формою -->
    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="modal-content">
        <AddReviewForm
          v-if="placeId"
          :placeId="placeId"
          @review-added="handleAdded"
          @close="showModal = false"
        />
      </div>
    </div>
    <!-- Відгуки -->
    <ReviewItem
      v-for="review in currentReviews"
      :key="review.author"
      :review="review"
      @review-added="$emit('review-added')"
    />
    <button @click="toggleReviews" class="reviews__show-more">
      {{ buttonText }}
    </button>
  </section>
</template>

<script>
import AddReviewForm from "./AddReviewForm.vue";
import ReviewItem from "./reviews-item/ReviewItem.vue";
import Rating from "../StarRating";

export default {
  name: "ReviewsAll",
  components: {
    ReviewItem,
    AddReviewForm,
    Rating,
  },
  props: {
    reviews: {
      type: Array,
      required: true,
    },
    placeId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      localReviews: [], // локальна копія
      reviewsLimit: 2,
      showModal: false,
    };
  },
  watch: {
    reviews: {
      immediate: true,
      handler(newVal) {
        this.localReviews = [...newVal];
      },
    },
  },
  computed: {
    totalRating() {
      if (!this.localReviews.length) return 0;
      const total = this.localReviews.reduce(
        (acc, review) => acc + review.rating,
        0
      );
      return (total / this.localReviews.length).toFixed(1); // округлимо до 1 знаку
    },
    amountOfReviews() {
      return this.localReviews.length;
    },
    currentReviews() {
      return this.localReviews.slice(0, this.reviewsLimit);
    },
    buttonText() {
      return this.reviewsLimit === this.reviews.length
        ? "Згорнути"
        : "Читати більше";
    },
  },
  methods: {
    toggleReviews() {
      if (this.reviewsLimit === this.reviews.length) {
        this.reviewsLimit = 2;
        return;
      }
      this.reviewsLimit = this.reviews.length;
    },
    toggleModal() {
  this.showModal = !this.showModal;
},
    handleAdded() {     
      this.showModal = false;
      this.$emit("review-added"); // кидаємо подію нагору
    },    
  },
};
</script>

<style lang="scss" scoped>
@import "../../assets/scss/variables";

.reviews {
  margin-top: 20px;
  background: $card-bg;
  padding: 0 20px;
  width: 300px;

  &__heading {
    display: flex;    
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 20px 20px 10px;
  }

  &__title {
    font-family: e-Ukraine, sans-serif;
    text-transform: uppercase;
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 10px;
  }

  &__rating {
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: center;
    justify-content: space-between;
  }

  &__show-more {
    background: none;
    border: none;
    cursor: pointer;
    width: 100%;
    padding: 12px;
    font-family: inherit;
    font-size: 16px;
  }
}
.leave-review-button {
  display: block;
  font-family: e-Ukraine, sans-serif;
  margin: 20px 0;
  border-radius: 8px;
  padding: 4px;
}
</style>
