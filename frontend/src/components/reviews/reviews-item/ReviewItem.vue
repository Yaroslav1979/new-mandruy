<template>
    <section class="reviews-item">
      <ReviewsHeading
        :rating="review.rating"
        :author="review.author"
      />
      <p class="reviews-item__content">{{ review.content }}</p>       
    </section>
  </template>
  
  <script>
  import ReviewsHeading from './ReviewsHeading.vue';
  // import AddReviewForm from './AddReviewForm.vue';
  
  export default {
    name: 'ReviewItem',
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
        this.$emit('review-added'); // прокинемо далі, якщо потрібно оновити список
      },
    },
  };
  </script>
  
  <style lang="scss" scoped>
  .reviews-item {
    background: #fff;
    padding: 20px 22px;
    line-height: 1.5;
    margin-bottom: 2px;
  
    &:last-child {
      margin-bottom: 0;
    }
  
    &__content {
      display: -webkit-box;
      display: box; 
      margin-top: 20px;
      overflow: hidden;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 5;
      line-clamp: 5; 
    }
  }
  
  .leave-review-button {
    margin-top: 20px;
    padding: 8px 12px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
  
    &:hover {
      background-color: #0056b3;
    }
  }
  
  /* Модальне вікно */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .modal-content {
    background: white;
    padding: 24px;
    border-radius: 12px;
    max-width: 500px;
    width: 90%;
  }
  </style>
  