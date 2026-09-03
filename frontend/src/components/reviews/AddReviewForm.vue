<template>
  <div v-if="isAuthenticated">
    <form @submit.prevent="submitReview" class="review-form">
      <input
        type="text"
        v-model="author"
        placeholder="Ваше ім'я"
        required
        class="review-form__input"
      />
      <textarea
        v-model="content"
        placeholder="Ваш відгук"
        required
        class="review-form__textarea"
      ></textarea>
      <div class="review-form__rating">
        <label>Оцінка:</label>
        <select v-model="rating">
          <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
        </select>
      </div>
      <button type="submit" class="review-form__submit">Надіслати</button>
    </form>
  </div>
  <div v-else>Зареєструйтеся щоб залишати відгуки</div>
</template>

<script>
import { postReview } from "../../services/reviews.service.js";

export default {
  name: "AddReviewForm",
  props: {
    placeId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      author: "",
      content: "",
      rating: 5,
    };
  },
  computed: {
    isAuthenticated() {
      return !!this.$store.state.auth.token;
    },
  },
  methods: {
    async submitReview() {
      try {
        console.log("Sending review:", {
          author: this.author,
          content: this.content,
          rating: this.rating,
          placeId: this.placeId,
        });
        await postReview({
          author: this.author,
          content: this.content,
          rating: this.rating,
          placeId: this.placeId,
        });
        this.$emit("review-added", {
          author: this.author,
          content: this.content,
          rating: this.rating,
        });
      } catch (error) {
        console.error("Error submitting review:", error);
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
