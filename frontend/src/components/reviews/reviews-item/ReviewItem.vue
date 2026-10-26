<template>
  <section class="reviews-item">
    <ReviewsHeading :rating="review.rating" :author="review.author" />

    <p class="reviews-item__content">
      {{ review.content }}
    </p>

    <div v-if="isAdmin" class="reviews-item__admin">
      <button
        type="button"
        class="reviews-item__admin-button reviews-item__admin-button--delete"
        @click="$emit('delete-review', review)"
      >
        Видалити відгук
      </button>

      <button
        v-if="reviewUserId"
        type="button"
        class="reviews-item__admin-button"
        @click="
          $emit('toggle-block', {
            userId: reviewUserId,
            blocked: !review.userId.isBlocked,
          })
        "
      >
        {{
          review.userId.isBlocked ? "Розблокувати автора" : "Заблокувати автора"
        }}
      </button>
    </div>
  </section>
</template>

<script>
import ReviewsHeading from "./ReviewsHeading.vue";

export default {
  name: "ReviewItem",

  components: {
    ReviewsHeading,
  },

  props: {
    review: {
      type: Object,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },

  emits: ["delete-review", "toggle-block"],

  computed: {
    reviewUserId() {
      const user = this.review.userId;

      if (!user) return null;

      return typeof user === "object" ? user._id : user;
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
    margin-top: clamp(12px, 1.5vw, 20px);
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 5;
    line-clamp: 5;
    line-height: 1.5;
  }

  &__admin {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 14px;
  }

  &__admin-button {
    padding: 7px 10px;
    border: 1px solid #aaa;
    border-radius: 6px;
    background: #fff;
    color: #222;
    font: inherit;
    font-size: 12px;
    cursor: pointer;

    &:hover {
      background: #eee;
    }

    &--delete {
      border-color: #b42318;
      color: #b42318;
    }
  }
}

@media (max-width: 600px) {
  .reviews-item {
    padding: 14px 12px;
    font-size: 13px;

    &__content {
      margin-top: 12px;
    }

    &__admin-button {
      font-size: 11px;
    }
  }
}
</style>
