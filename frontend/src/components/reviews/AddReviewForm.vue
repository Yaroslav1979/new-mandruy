<template>
  <div v-if="isBlocked" class="review-form__blocked">
    Ваш обліковий запис заблоковано. Ви не можете залишати відгуки.
  </div>

  <div v-else-if="isAuthenticated">
    <form @submit.prevent="submitReview" class="review-form">
      <CustomTextarea
        v-model="content"
        placeholder="Ваш відгук"
        :rows="5"
        :maxlength="1000"
      />

      <div class="review-form__rating">
        <label>Оцінка:</label>

        <select v-model.number="rating">
          <option v-for="n in 5" :key="n" :value="n">
            {{ n }}
          </option>
        </select>
      </div>

      <p v-if="errorMessage" class="review-form__error">
        {{ errorMessage }}
      </p>

      <button type="submit" class="review-form__submit" :disabled="submitting">
        {{ submitting ? "Надсилання..." : "Надіслати" }}
      </button>
    </form>
  </div>

  <div v-else>Зареєструйтеся або увійдіть, щоб залишати відгуки.</div>
</template>

<script>
import { postReview, getCurrentUser } from "../../services/reviews.service.js";
import CustomTextarea from "../shared/CustomTextArea.vue";

export default {
  name: "AddReviewForm",

  components: {
    CustomTextarea,
  },

  props: {
    placeId: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      content: "",
      rating: 5,
      submitting: false,
      isBlocked: false,
      errorMessage: "",
    };
  },

  computed: {
    isAuthenticated() {
      return !!this.$store.state.auth.token;
    },
  },

  async created() {
    if (!this.isAuthenticated) return;

    try {
      const token = this.$store.state.auth.token;
      const { data } = await getCurrentUser(token);

      this.isBlocked = Boolean(data.user.isBlocked);
    } catch (err) {
      console.error(
        "Не вдалося перевірити статус користувача:",
        err.response?.data?.message || err.message,
      );
    }
  },

  methods: {
    async submitReview() {
      if (this.submitting || !this.isAuthenticated || this.isBlocked) {
        return;
      }

      if (!this.content.trim()) {
        this.errorMessage = "Введіть текст відгуку.";
        return;
      }

      this.submitting = true;
      this.errorMessage = "";

      try {
        const token = this.$store.state.auth.token;

        await postReview({
          placeId: this.placeId,
          content: this.content.trim(),
          rating: this.rating,
          token,
        });

        this.content = "";
        this.rating = 5;

        this.$emit("review-added");
      } catch (err) {
        this.errorMessage =
          err.response?.data?.message || "Не вдалося надіслати відгук.";

        if (err.response?.status === 403) {
          this.isBlocked = true;
        }
      } finally {
        this.submitting = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.review-form {
  display: flex;
  flex-direction: column;
  gap: clamp(8px, 1vw, 12px);
  margin-bottom: clamp(16px, 2vw, 24px);
  width: 100%;

  &__blocked,
  &__error {
    color: #b42318;
    font-size: 12px;
  }

  &__submit:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &__input,
  &__textarea,
  &__submit,
  select {
    width: 100%;
    box-sizing: border-box;
    padding: clamp(6px, 0.8vw, 8px);
    font-size: clamp(11px, 1vw, 14px);
    border: 1px solid #ccc;
    border-radius: 6px;
    font-family: e-Ukraine, sans-serif;
  }

  &__textarea {
    resize: vertical;
    min-height: clamp(70px, 6vw, 80px);
  }

  &__submit {
    background-color: #000000;
    color: white;
    border: none;
    cursor: pointer;

    &:hover {
      opacity: 0.7;
    }
  }
}
</style>
