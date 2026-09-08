<template>
  <div class="star-rating">
    <span
      v-for="index in starLimit"
      :key="index"
      class="star star--outlined"
    ></span>
    <div class="star-rating__colored" :style="`width: ${ratingWidth};`">
      <span
        v-for="index in starLimit"
        :key="index"
        class="star star--colored"
      ></span>
    </div>
  </div>
</template>

<script>
export default {
  name: "StarRating",
  props: {
    rating: {
      type: Number,
      default: 0,
    },
    starLimit: {
      type: Number,
      default: 5,
    },
  },
  computed: {
    ratingWidth() {
      return (this.rating / this.starLimit) * 100 + "%";
    },
  },
};
</script>

<style lang="scss" scoped>
.star-rating {
  position: relative;
  display: inline-flex;

  /*
   * Не дозволяємо рейтингу стискатися
   * всередині flex-контейнера непередбачувано.
   */
  flex-shrink: 0;

  &__colored {
    display: inline-flex;

    position: absolute;

    width: 0;
    height: 100%;

    top: 0;
    left: 0;

    overflow: hidden;
  }
}

.star {
  display: inline-flex;

  /*
   * ПК: 16px
   * планшет: плавно зменшується
   */
  width: clamp(11px, 1.15vw, 16px);
  height: clamp(10px, 1.08vw, 15px);

  /*
   * Також зменшуємо проміжок
   */
  margin: 0 clamp(1px, 0.2vw, 3px);

  flex-shrink: 0;

  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;

  &--colored {
    background-image: url("/src/assets/Star_rating-yellow.svg");
  }

  &--outlined {
    background-image: url("/src/assets/Star_rating-empty.svg");
  }
}

/* =========================
   СМАРТФОН
   ========================= */

@media (max-width: 600px) {
  .star {
    width: 14px;
    height: 13px;
    margin: 0 2px;
  }
}
</style>
