<template>
  <section class="reviews">
    <div class="reviews__heading">
      <h2 class="reviews__title">Відгуки</h2>

      <div class="reviews__rating">
        <div>Кількість відгуків: {{ amountOfReviews }}</div>
        <div>
          Підсумковий рейтинг:
          <Rating :rating="totalRating" />
        </div>
      </div>

      <button
        v-if="!currentUser?.isBlocked"
        class="leave-review-button"
        @click="toggleModal"
      >
        {{ showModal ? "Приховати" : "Залишити відгук" }}
      </button>

      <p v-else class="reviews__blocked-message">
        Ваш обліковий запис заблоковано.
      </p>
    </div>

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

    <ReviewItem
      v-for="review in currentReviews"
      :key="review._id"
      :review="review"
      :isAdmin="isAdmin"
      @delete-review="handleDeleteReview"
      @toggle-block="handleToggleBlock"
    />

    <button
      v-if="localReviews.length > 2"
      @click="toggleReviews"
      class="reviews__show-more"
    >
      {{ buttonText }}
    </button>

    <div v-if="isAdmin" class="reviews__admin-panel">
      <h3>Заблоковані користувачі</h3>

      <p v-if="blockedUsers.length === 0">Заблокованих користувачів немає.</p>

      <div
        v-for="user in blockedUsers"
        :key="user._id"
        class="reviews__blocked-user"
      >
        <span>{{ user.name }} ({{ user.email }})</span>

        <button
          type="button"
          :disabled="actionLoading"
          @click="
            handleToggleBlock({
              userId: user._id,
              blocked: false,
            })
          "
        >
          Розблокувати
        </button>
      </div>
    </div>
  </section>
</template>

<script>
import AddReviewForm from "./AddReviewForm.vue";
import ReviewItem from "./reviews-item/ReviewItem.vue";
import Rating from "../shared/StarRating.vue";

import {
  getCurrentUser,
  deleteReview,
  setUserBlocked,
  getBlockedUsers,
} from "../../services/reviews.service.js";

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

  emits: ["review-added"],

  data() {
    return {
      localReviews: [],
      reviewsLimit: 2,
      showModal: false,
      currentUser: null,
      blockedUsers: [],
      actionLoading: false,
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
    isAdmin() {
      return this.currentUser?.role === "admin";
    },

    totalRating() {
      if (!this.localReviews.length) return 0;

      const total = this.localReviews.reduce(
        (sum, review) => sum + Number(review.rating || 0),
        0,
      );

      return (total / this.localReviews.length).toFixed(1);
    },

    amountOfReviews() {
      return this.localReviews.length;
    },

    currentReviews() {
      return this.localReviews.slice(0, this.reviewsLimit);
    },

    buttonText() {
      return this.reviewsLimit >= this.localReviews.length
        ? "Згорнути"
        : "Читати більше";
    },
  },

  async created() {
    await this.loadCurrentUser();
  },

  methods: {
    async loadCurrentUser() {
      const token = this.$store.state.auth.token;

      if (!token) {
        this.currentUser = null;
        return;
      }

      try {
        const { data } = await getCurrentUser(token);
        this.currentUser = data.user;

        if (this.isAdmin) {
          await this.loadBlockedUsers();
        }
      } catch (err) {
        console.error(
          "Помилка отримання користувача:",
          err.response?.data?.message || err.message,
        );

        this.currentUser = null;
      }
    },

    async loadBlockedUsers() {
      if (!this.isAdmin) return;

      try {
        const token = this.$store.state.auth.token;
        const { data } = await getBlockedUsers(token);

        this.blockedUsers = data;
      } catch (err) {
        console.error(
          "Помилка отримання заблокованих користувачів:",
          err.response?.data?.message || err.message,
        );
      }
    },

    toggleReviews() {
      this.reviewsLimit =
        this.reviewsLimit >= this.localReviews.length
          ? 2
          : this.localReviews.length;
    },

    toggleModal() {
      this.showModal = !this.showModal;
    },

    handleAdded() {
      this.showModal = false;
      this.$emit("review-added");
    },

    async handleDeleteReview(review) {
      if (!this.isAdmin || this.actionLoading) return;

      const confirmed = window.confirm(
        "Видалити цей відгук? Цю дію неможливо скасувати.",
      );

      if (!confirmed) return;

      this.actionLoading = true;

      try {
        const token = this.$store.state.auth.token;

        await deleteReview(this.placeId, review._id, token);

        this.$emit("review-added");
      } catch (err) {
        window.alert(
          err.response?.data?.message || "Не вдалося видалити відгук.",
        );
      } finally {
        this.actionLoading = false;
      }
    },

    async handleToggleBlock({ userId, blocked }) {
      if (!this.isAdmin || this.actionLoading || !userId) return;

      const action = blocked ? "заблокувати" : "розблокувати";

      const confirmed = window.confirm(
        `Ви дійсно хочете ${action} цього користувача?`,
      );

      if (!confirmed) return;

      this.actionLoading = true;

      try {
        const token = this.$store.state.auth.token;

        await setUserBlocked(userId, blocked, token);

        await this.loadBlockedUsers();

        // Оновлюємо дані відгуків, зокрема статус автора.
        this.$emit("review-added");
      } catch (err) {
        window.alert(
          err.response?.data?.message ||
            "Не вдалося змінити статус користувача.",
        );
      } finally {
        this.actionLoading = false;
      }
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
  width: 100%;
  box-sizing: border-box;

  &__heading {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: clamp(6px, 0.7vw, 8px);

    padding: clamp(14px, 1.5vw, 20px) clamp(12px, 1.5vw, 20px)
      clamp(8px, 1vw, 10px);
  }

  &__title {
    font-family: e-Ukraine, sans-serif;
    text-transform: uppercase;
    font-size: clamp(16px, 1.4vw, 20px);
    font-weight: 700;

    margin-bottom: clamp(6px, 0.8vw, 10px);
  }

  &__rating {
    display: flex;
    flex-direction: column;
    gap: clamp(5px, 0.6vw, 8px);
    align-items: center;
    justify-content: space-between;

    font-size: clamp(11px, 1vw, 14px);
    text-align: center;
  }

  &__show-more {
    background: none;
    border: none;
    cursor: pointer;
    width: 100%;

    padding: clamp(8px, 1vw, 12px);

    font-family: inherit;
    font-size: clamp(13px, 1.1vw, 16px);
  }

  &__admin-panel {
    margin-top: 24px;
    padding: 16px;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 8px;
  }

  &__blocked-user {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 10px;
    padding: 10px 0;
    border-bottom: 1px solid #eee;
    font-size: 12px;

    button {
      padding: 6px 10px;
      cursor: pointer;
    }
  }

  &__blocked-message {
    color: #b42318;
    font-size: 13px;
  }
}

.leave-review-button {
  display: block;

  font-family: e-Ukraine, sans-serif;

  margin: clamp(12px, 1.5vw, 20px) 0;

  border-radius: 8px;

  padding: clamp(4px, 0.5vw, 8px) clamp(8px, 0.8vw, 12px);

  font-size: clamp(11px, 1vw, 14px);

  cursor: pointer;
}

/* =========================
   СМАРТФОН
   ========================= */

@media (max-width: 600px) {
  .reviews {
    width: 100%;
    max-width: 100%;
    margin-top: 20px;
    padding: 0 12px;

    &__heading {
      padding: 16px 10px 10px;
    }

    &__title {
      font-size: 18px;
    }

    &__rating {
      font-size: 12px;
    }

    &__show-more {
      font-size: 14px;
    }
  }

  .leave-review-button {
    font-size: 12px;
  }
}
</style>
