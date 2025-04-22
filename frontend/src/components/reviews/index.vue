<template> 
    <section class="reviews"> 
        <div class="reviews__heading">
            <h2 class="reviews__title"> Підсумковий рейтинг </h2>
            <div class="reviews__rating"> 
                <span > Кількість відгуків: {{ amountOfReviews }}  </span>
                <Rating :rating="totalRating" />
            </div>
        </div>
        <ReviewItem 
            v-for="review in currentReviews" 
            :key="review.author" 
            :review="review" 
            @review-added="$emit('review-added')"
        />
        <button @click="toggleReviews" class="reviews__show-more"> 
            {{ buttonText }}
        </button>
        
        <!-- Кнопка для виклику форми -->
      <button class="leave-review-button" @click="showModal = true">
        Залишити відгук
      </button>
  
      <!-- Модальне вікно з формою -->
      <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
        <div class="modal-content">
          <!-- <AddReviewForm 
          :placeId="_id" 
          @review-added="handleAdded" 
          @close="showModal = false" 
          /> -->
          <AddReviewForm 
  v-if="placeId"
  :placeId="placeId" 
  @review-added="handleAdded" 
  @close="showModal = false" 
/>
        </div>
      </div>        
    </section>
</template>

<script>
import AddReviewForm from "./AddReviewForm.vue"
// import { getReviewsByPlaceId } from "../../services/reviews.service";
import ReviewItem from './reviews-item/ReviewItem.vue'
import Rating from '../StarRating'

export default {
    name: 'ReviewsAll',
    components: {
        ReviewItem,
        AddReviewForm,
        Rating,
    },
    props: {
        reviews: {
            type: Array,
            required: true
        },
        placeId: {
            type: String,
            required: true
        }
    },
    data() {
  return {
    localReviews: [], // локальна копія
    reviewsLimit: 2,
    showModal: false
  };
},
watch: {
  reviews: {
    immediate: true,
    handler(newVal) {
      this.localReviews = [...newVal];
    }
  }
},
    computed: {
      totalRating() {
  if (!this.localReviews.length) return 0;
  const total = this.localReviews.reduce((acc, review) => acc + review.rating, 0);
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
            ? 'Згорнути'
            : 'Читати більше'
        }
    },
    methods: {
  toggleReviews() {
    if (this.reviewsLimit === this.reviews.length) {
      this.reviewsLimit = 2;
      return;
    }

    this.reviewsLimit = this.reviews.length;
  },
  handleAdded() {
    // this.localReviews.unshift(newReview); // додати новий на початок
    console.log('📢 Подія review-added прокинута вгору');
  this.showModal = false;
  this.$emit('review-added'); // кидаємо подію нагору
}
  // handleAdded(newReview) {
  //   this.localReviews.unshift(newReview); // додати новий на початок
  //   this.showModal = false;
  // }
}
}
</script>


<style lang="scss" scoped>
@import '../../assets/scss/variables';

.reviews {
  margin-top: 20px;
  background: $card-bg;
  padding: 0 20px;

  &__heading {
    padding: 20px 20px 10px;
  }

  &__title {
    text-transform: uppercase;
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 10px;
  }

  &__rating {
    display: flex;
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
</style>