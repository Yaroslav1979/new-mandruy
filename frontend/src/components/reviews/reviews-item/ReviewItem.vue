<template>
  <section class="reviews-item">
    <ReviewsHeading :rating="review.rating" :author="review.author" />
    <p class="reviews-item__content">{{ review.content }}</p>
  </section>
</template>

<script>
import ReviewsHeading from "./ReviewsHeading.vue";
// import AddReviewForm from './AddReviewForm.vue';

export default {
  name: "ReviewItem",
  components: {
    ReviewsHeading,
    // AddReviewForm,
  },
  props: {
    review: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      showModal: false,
    };
  },
  methods: {
    handleAdded() {
      this.showModal = false;
      this.$emit("review-added"); // прокинемо далі, якщо потрібно оновити список
    },
  },
};
</script>

<style lang="scss" scoped>
.reviews-item {
  background: #fff;

  padding: clamp(12px, 1.5vw, 20px) clamp(14px, 1.6vw, 22px);

  line-height: 1.5;

  margin-bottom: 2px;

  font-size: clamp(12px, 1vw, 14px);

  &:last-child {
    margin-bottom: 0;
  }

  &__content {
    display: -webkit-box;
    display: box;

    margin-top: clamp(12px, 1.5vw, 20px);

    overflow: hidden;

    -webkit-box-orient: vertical;
    -webkit-line-clamp: 5;
    line-clamp: 5;

    line-height: 1.5;
  }
}

/* =========================
   СМАРТФОН
   ========================= */

@media (max-width: 600px) {
  .reviews-item {
    padding: 14px 12px;
    font-size: 13px;

    &__content {
      margin-top: 12px;
    }
  }
}
</style>
