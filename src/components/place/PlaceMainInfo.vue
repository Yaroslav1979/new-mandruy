<template>
  <article class="place-main-info">
    <div class="place-main-info__heading">
      <h1 class="place-main-info__title">{{ place.title }}</h1>
      <Rating :rating="place.rating" />
    </div>
    
    <img :src="place.imgUrl" alt="Place photo" class="place-main-info__photo" />
    <p class="place-main-info__description">{{ place.descr }}</p>
    <p class="place-main-info__description">
      <strong>Місце розташування:</strong> {{ place.location.city }}, {{ place.location.region }}
    </p>
    <p class="place-main-info__description">
      <strong>Координати:</strong> {{ place.location.coordinate }}
    </p>

    <!-- Відображення категорій -->
    <div class="place-main-info__categories">
      <div
        v-for="categoryId in place.categoryIds"
        :key="categoryId"
        class="place-main-info__category"
      >
        <img :src="getCategoryIcon(categoryId)" alt="Category icon" class="icon-ctg"  />
        <span>{{ getCategoryTitle(categoryId) }}</span>
      </div>
    </div>
  </article>
</template>

<script>
import Rating from '../StarRating.vue';
import categories from '../categories/categories.js'; // Ваш масив categories

export default {
  name: 'PlaceMainInfo',
  components: {
    Rating,
  },
  props: {
    place: {
      type: Object,
      required: true,
    },
  },
  methods: {
    getCategoryIcon(categoryId) {
      const category = categories.find(cat => cat.id === categoryId);
      return category ? category.svgUrl : '';
    },
    getCategoryTitle(categoryId) {
      const category = categories.find(cat => cat.id === categoryId);
      return category ? category.title : '';
    },
  },
};
</script>

<style lang="scss" scoped>
 @import '../../assets/scss/variables';
 strong {
    font-weight: 700; /* Застосовуємо жирний шрифт */
  }

  .place-main-info__categories {
 display: flex;
    justify-content: left;
    flex-wrap: wrap; /* Додає перенесення на новий рядок */
    gap: 12px;   
    align-items: center;
    padding: 50px 0;
}

.place-main-info__category {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 20px;
  border-radius: 100px;
  border: 2px solid #e7e6ed;
  min-width: 132px;
  color: #000;
  text-align: center;
  font-family: e-Ukraine, sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 18px;
  background-color: white;
  transition: background-color 0.3s, color 0.3s;
}
.place-main-info__category:hover {
  background-color: #000;
  color: white;
}
.place-main-info__category:hover .icon-ctg {
  filter: invert(1);
}

.place-main-info__category img {
  width: 24px;
  height: 24px;
}

    .place-main-info {

  &__heading {
    display: flex;
  }

  &__title {
    font-size: 20px;
    font-weight: 700;
    text-transform: capitalize;
    margin-bottom: 20px;
    margin-right: 20px;
  }

  &__photo {
    max-width: 100%;
  }

  &__description {
    line-height: 1.3;
    margin-top: 30px;
  }

  &__btn {
    margin-top: 20px;
    text-align: center;
  }
}
</style>