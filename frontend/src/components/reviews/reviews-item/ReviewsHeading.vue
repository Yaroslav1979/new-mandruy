<template>
  <div class="reviews-heading">
    <Avatar />
    <div class="reviews-heading__content">
      <span class="reviews-heading__author"> {{ author }} </span>
      <Rating :rating="rating" />
    </div>
  </div>
</template>

<script>
import Rating from "../../StarRating.vue";
import Avatar from "./ReviewsAvatar.vue";
export default {
  name: "ReviewsHeading",
  components: {
    Rating,
    Avatar,
  },
  props: {
    author: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
  },
};
</script>

<style lang="scss" scoped>
.reviews-heading {
  display: flex;
  align-items: center;

  &__content {
    display: flex;
    flex-direction: column;

    gap: clamp(2px, 0.4vw, 4px);
  }

  &__author {
    font-family: e-Ukraine, sans-serif;
    font-size: clamp(12px, 1vw, 14px);
    line-height: 1.3;
  }
}

.reviews-heading :deep(svg) {
  width: clamp(28px, 2.4vw, 34px);
  height: clamp(28px, 2.4vw, 34px);

  margin-right: clamp(10px, 1.3vw, 18px);

  flex-shrink: 0;
}

/* Смартфон */
@media (max-width: 600px) {
  .reviews-heading :deep(svg) {
    width: 30px;
    height: 30px;
    margin-right: 12px;
  }

  .reviews-heading__author {
    font-size: 12px;
  }
}
</style>
