<template>
  <div class="places-item">
    <div class="places-item__inner">
      <div class="places-item__photo-container">
        <img
          v-if="imgSrc.length"
          :src="imgSrc[0]"
          alt="Place photo"
          class="places-item__photo"
        />
      </div>

      <h2 class="places-item__title">
        {{ title }}
      </h2>

      <!-- Кнопка додавання / видалення з обраного -->
      <button
        v-if="showFavorite"
        class="places-item__favorite"
        :class="{ 'places-item__favorite--active': isFavorite }"
        :aria-label="isFavorite ? 'Видалити з обраного' : 'Додати в обране'"
        :title="isFavorite ? 'Видалити з обраного' : 'Додати в обране'"
        @click.stop.prevent="$emit('toggle-favorite', id)"
      >
        <svg
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M12 21s-8-4.8-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 6.2-8 11-8 11Z"
          />
        </svg>
      </button>

      <div class="places-item__content">
        <p class="places-item__description">
          {{ descr }}
        </p>

        <br />

        <Rating :rating="rating" />

        <router-link
          :to="{
            name: 'PlacePage',
            params: { id },
            query: previewChanges
              ? { previewChanges: 'true' }
              : previewNew
              ? { previewNew: 'true' }
              : {},
          }"
          class="places-item__link"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Rating from "../shared/StarRating.vue";

export default {
  name: "PlacesItem",

  components: {
    Rating,
  },

  emits: ["toggle-favorite"],

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
    isFavorite: {
      type: Boolean,
      default: false,
    },
    showFavorite: {
      type: Boolean,
      default: true,
    },
    previewChanges: {
      type: Boolean,
      default: false,
    },
    previewNew: {
      type: Boolean,
      default: false,
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

  &__favorite {
    position: absolute;
    top: clamp(10px, 1.5vw, 20px);
    right: clamp(15px, 3vw, 40px);
    z-index: 3;
    width: 38px;
    height: 38px;
    padding: 8px;
    border: none;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.9);
    cursor: pointer;
    transition: transform 0.2s, background 0.2s;

    svg {
      width: 100%;
      height: 100%;
      fill: transparent;
      stroke: #222;
      stroke-width: 1.8;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    &:hover {
      transform: scale(1.1);
    }

    &--active svg {
      fill: #e53935;
      stroke: #e53935;
    }
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
    max-width: calc(100% - 100px);
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

@media (max-width: 700px) {
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
    max-width: calc(100% - 75px);
  }

  .places-item__favorite {
    top: 10px;
    right: 15px;
    width: 34px;
    height: 34px;
  }
}
</style>
