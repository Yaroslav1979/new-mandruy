<template>
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
  </template>
  
  <script>
  import { postReview } from '../../services/reviews.service.js';
  
  export default {
    name: 'AddReviewForm',
    props: {
      placeId: {
        type: String,
        required: true,
      },
    },
    data() {
      return {
        author: '',
        content: '',
        rating: 5,
      };
    },
    methods: {
      async submitReview() {
    try {
        console.log('Sending review:', {
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
        this.$emit('review-added', {
            author: this.author,
            content: this.content,
            rating: this.rating,
        });
    } catch (error) {
        console.error('Error submitting review:', error);
    }
}
},
  };
  </script>
  
  <style lang="scss" scoped>
  .review-form {
    display: flex;
    flex-direction: column;
   
    gap: 12px;
    margin-bottom: 24px;
  
    &__input,
    &__textarea,
    &__submit,
    select {
      padding: 8px;
      font-size: 14px;
      border: 1px solid #ccc;
      border-radius: 6px;
      font-family: e-Ukraine, sans-serif;
    }
  
    &__textarea {
      resize: vertical;
      min-height: 80px;
    }
  
    &__submit {
      background-color: #000000;
      color: white;
      border: none;
      cursor: pointer;
  
      &:hover {
        /* background-color: #0056b3; */
        opacity: 0.7;
      }
    }
  }
  </style>