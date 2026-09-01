<template>
  <div class="places-item">
    <div class="places-item__inner">
      <div class="places-item__photo-container">
        <img
          v-if="imgSrc.length"
          :src="`http://localhost:3000/uploads/${imgSrc[0].replace(
            /^.*[\\/]/,
            '',
          )}`"
          alt="Place photo"
          class="place-item__photo"
        />
      </div>
      <h2 class="places-item__title">
        {{ title }}
      </h2>

      <div class="places-item__content">
        <p class="places-item__description">
          {{ descr }}
        </p>

        <br />

        <Rating :rating="rating" />

        <router-link
          :to="{ name: 'PlacePage', params: { id } }"
          class="places-item__link"
        >
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import Rating from "../StarRating.vue";
export default {
  name: "PlacesItem",
  components: {
    Rating,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
    descr: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
    imgSrc: {
      type: Array,
      default: () => [],
    },
    rating: {
      type: Number,
      default: 0,
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../assets/scss/variables.scss";

.places-item {
  width: 50%;
  padding: 0 clamp(8px, 1.2vw, 15px);
  margin-bottom: clamp(16px, 2.5vw, 30px);
  box-sizing: border-box;

  &__inner {
    position: relative;
    display: flex;
    flex-direction: column;
  }

  &__photo-container {
    width: 100%;
    aspect-ratio: 5 / 3;

    border-radius: clamp(8px, 1.3vw, 16px);
    overflow: hidden;

    display: flex;
    align-items: center;
    justify-content: center;

    background-color: #f5f5f5;
  }

  &__photo {
    width: 100%;
    height: 100%;

    object-fit: cover;

    border-radius: clamp(8px, 1.3vw, 16px);

    display: block;
  }

  &__content {
    position: absolute;

    top: 0;
    left: 0;

    width: 100%;
    height: 100%;

    box-sizing: border-box;

    padding: clamp(20px, 3vw, 40px);

    border-radius: clamp(8px, 1.3vw, 16px);

    opacity: 0;

    transition: opacity 0.4s;

    background: rgba(#0f1d2d, 0.7);

    color: #fff;
    text-align: left;

    font-size: clamp(11px, 1.1vw, 16px);
    line-height: 1.4;

    cursor: pointer;

    z-index: 1;

    &:hover {
      opacity: 1;
    }
  }

  &__description {
    margin-top: clamp(25px, 3.5vw, 50px);

    max-height: calc(1em * 1.4 * 3);

    overflow: hidden;

    font-size: clamp(11px, 1.1vw, 16px);
    line-height: 1.4;
  }

  &__title {
    position: absolute;

    color: #fff;

    background-color: rgba(68, 68, 68, 0.5);

    display: inline-block;

    clip-path: polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%);

    padding: clamp(6px, 0.8vw, 10px) clamp(12px, 1.5vw, 20px);

    left: clamp(15px, 3vw, 40px);
    top: clamp(10px, 1.5vw, 20px);

    font-size: clamp(13px, 1.5vw, 20px);
    font-weight: 400;
    font-style: italic;

    z-index: 1;

    /*
     * Щоб довгий заголовок не вилазив
     * за межі картки.
     */
    max-width: calc(100% - 60px);
    box-sizing: border-box;

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__link {
    position: absolute;

    top: 0;
    left: 0;

    width: 100%;
    height: 100%;
  }
}

/* =========================
   СМАРТФОН
   ========================= */

@media (max-width: 600px) {
  .places-item {
    width: 100%;

    padding: 0 8px;

    margin-bottom: 20px;
  }

  .places-item__photo-container {
    aspect-ratio: 5 / 3;
    border-radius: 10px;
  }

  .places-item__photo {
    border-radius: 10px;
  }

  .places-item__content {
    padding: 20px;

    border-radius: 10px;

    font-size: 12px;
  }

  .places-item__description {
    margin-top: 35px;

    font-size: 12px;
  }

  .places-item__title {
    left: 15px;
    top: 10px;

    padding: 6px 12px;

    font-size: 14px;

    max-width: calc(100% - 30px);
  }
}
</style>
