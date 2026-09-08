<template>
  <article class="place-main-info" v-if="place">
    <div class="place-main-info__heading">
      <h1 class="place-main-info__title">{{ place.title }}</h1>
      <Rating :rating="rating || 0" />
    </div>

    <!-- Слайдер -->
    <div class="slider-container" v-if="place.imgUrls && place.imgUrls.length">
      <div class="slider" ref="slider">
        <img
          v-for="(img, index) in loopedImages"
          :key="index"
          :src="`http://localhost:3000${img}`"
          alt="Place photo"
          class="place-main-info__photo"
          @dblclick="
            enterFullscreen(
              (index - 1 + place.imgUrls.length) % place.imgUrls.length,
            )
          "
        />
      </div>

      <button @click="prevSlide" class="slider-btn left">❮</button>
      <button @click="nextSlide" class="slider-btn right">❯</button>
    </div>

    <p class="place-main-info__description">
      {{ place.descr }}
    </p>

    <p class="place-main-info__description">
      <strong>Місце розташування:</strong>
      {{ place.location?.city }}, {{ place.location?.region }}
    </p>

    <p class="place-main-info__description">
      <strong>Координати:</strong>
      {{ place.location?.coordinate }}
    </p>

    <!-- Категорії -->
    <div
      class="place-main-info__categories"
      v-if="place.categoryIds && place.categoryIds.length"
    >
      <div
        v-for="categoryId in place.categoryIds"
        :key="categoryId"
        class="place-main-info__category"
      >
        <img
          :src="getCategoryIcon(categoryId)"
          alt="Category icon"
          class="icon-ctg"
        />

        <span>{{ getCategoryTitle(categoryId) }}</span>
      </div>
    </div>

    <!-- FULLSCREEN -->
    <div
      v-if="isFullscreen"
      class="fullscreen-overlay"
      @click.self="exitFullscreen"
    >
      <div class="fullscreen-content">
        <img
          :src="`http://localhost:3000${place.imgUrls[fullscreenIndex]}`"
          alt="Fullscreen photo"
          class="fullscreen-image"
        />

        <button @click="prevFullscreen" class="slider-btn left">❮</button>

        <button @click="nextFullscreen" class="slider-btn right">❯</button>

        <button class="close-btn" @click="exitFullscreen">×</button>
      </div>
    </div>
  </article>
</template>

<script>
import Rating from "../shared/StarRating.vue";
import categories from "../categories/categories.js";

export default {
  name: "PlaceMainInfo",

  components: {
    Rating,
  },

  props: {
    place: {
      type: Object,
      required: true,
    },

    rating: {
      type: Number,
      required: false,
      default: 0,
    },
  },

  data() {
    return {
      currentIndex: 1,
      isFullscreen: false,
      fullscreenIndex: 0,
    };
  },

  computed: {
    loopedImages() {
      if (!this.place?.imgUrls?.length) {
        return [];
      }

      const imgs = this.place.imgUrls;

      return [imgs[imgs.length - 1], ...imgs, imgs[0]];
    },
  },

  mounted() {
    this.$nextTick(() => {
      if (!this.$refs.slider) return;

      this.scrollToIndex(1, "auto");

      this.currentIndex = 1;

      this.$refs.slider.addEventListener("scroll", this.handleScroll);
    });
  },

  beforeUnmount() {
    this.$refs.slider?.removeEventListener("scroll", this.handleScroll);
  },

  methods: {
    // =========================
    // КАТЕГОРІЇ
    // =========================

    getCategoryIcon(categoryId) {
      const category = categories.find((cat) => cat.id === categoryId);

      return category ? category.svgUrl : "";
    },

    getCategoryTitle(categoryId) {
      const category = categories.find((cat) => cat.id === categoryId);

      return category ? category.title : "";
    },

    // =========================
    // СЛАЙДЕР
    // =========================

    getSlideWidth() {
      const slider = this.$refs.slider;

      if (!slider || !slider.children.length) {
        return 0;
      }

      const slide = slider.children[0];

      return slide.offsetWidth + 10;
    },

    scrollToIndex(index, behavior = "smooth") {
      const slider = this.$refs.slider;
      const slideWidth = this.getSlideWidth();

      if (!slider || !slideWidth) {
        return;
      }

      slider.scrollTo({
        left: index * slideWidth,
        behavior,
      });
    },

    nextSlide() {
      this.currentIndex++;
      this.scrollToIndex(this.currentIndex);
    },

    prevSlide() {
      this.currentIndex--;
      this.scrollToIndex(this.currentIndex);
    },

    handleScroll() {
      const slider = this.$refs.slider;
      const slideWidth = this.getSlideWidth();

      if (!slider || !slideWidth) {
        return;
      }

      const scrollLeft = slider.scrollLeft;
      const totalSlides = this.loopedImages.length;

      const index = Math.round(scrollLeft / slideWidth);

      // Перейшли на клон першої картинки
      if (index === totalSlides - 1) {
        this.waitForScrollEnd(() => {
          this.currentIndex = 1;

          this.scrollToIndex(1, "auto");
        });

        return;
      }

      // Перейшли на клон останньої картинки
      if (index === 0) {
        this.waitForScrollEnd(() => {
          this.currentIndex = totalSlides - 2;

          this.scrollToIndex(this.currentIndex, "auto");
        });

        return;
      }

      this.currentIndex = index;
    },

    waitForScrollEnd(callback) {
      const slider = this.$refs.slider;

      if (!slider) return;

      let lastScrollLeft = slider.scrollLeft;
      let sameCount = 0;

      const check = () => {
        const currentScrollLeft = slider.scrollLeft;

        if (currentScrollLeft === lastScrollLeft) {
          sameCount++;

          if (sameCount > 2) {
            callback();
            return;
          }
        } else {
          sameCount = 0;
          lastScrollLeft = currentScrollLeft;
        }

        requestAnimationFrame(check);
      };

      requestAnimationFrame(check);
    },

    // =========================
    // FULLSCREEN
    // =========================

    enterFullscreen(index) {
      this.fullscreenIndex = index;
      this.isFullscreen = true;

      document.body.style.overflow = "hidden";
    },

    exitFullscreen() {
      this.isFullscreen = false;

      document.body.style.overflow = "";
    },

    nextFullscreen() {
      if (this.fullscreenIndex < this.place.imgUrls.length - 1) {
        this.fullscreenIndex++;
      } else {
        this.fullscreenIndex = 0;
      }
    },

    prevFullscreen() {
      if (this.fullscreenIndex > 0) {
        this.fullscreenIndex--;
      } else {
        this.fullscreenIndex = this.place.imgUrls.length - 1;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../assets/scss/variables";

strong {
  font-weight: 700;
}

.place-main-info {
  width: 100%;
  min-width: 0;

  &__heading {
    display: flex;
    align-items: center;
    justify-content: flex-start;

    width: 100%;
    min-width: 0;

    gap: clamp(8px, 1.5vw, 20px);

    margin-bottom: 20px;
  }

  &__title {
    font-size: clamp(16px, 1.8vw, 20px);
    font-weight: 700;

    margin: 0;

    min-width: 0;

    flex: 1 1 auto;
  }

  /*
   * КОЖНА КАРТИНКА = ОДИН ПОВНИЙ СЛАЙД
   */
  &__photo {
    display: block;

    width: 100%;
    max-width: 100%;

    flex: 0 0 100%;

    border-radius: 12px;

    object-fit: cover;

    scroll-snap-align: start;
  }

  &__description {
    line-height: 1.3;
    margin-top: 30px;
  }

  &__categories {
    display: flex;
    justify-content: left;
    flex-wrap: wrap;

    gap: 12px;

    align-items: center;

    padding: 50px 0;
  }

  &__category {
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
}

.place-main-info__category img {
  width: 24px;
  height: 24px;
}

/* =========================
   СЛАЙДЕР
   ========================= */

.slider-container {
  position: relative;

  overflow: hidden;

  width: 100%;
  max-width: 100%;

  margin-bottom: 20px;
}

.slider {
  display: flex;

  gap: 10px;

  overflow-x: auto;

  scroll-snap-type: x mandatory;

  width: 100%;

  min-width: 0;

  scrollbar-width: none;
}

.slider::-webkit-scrollbar {
  display: none;
}

/* =========================
   КНОПКИ СЛАЙДЕРА
   ========================= */

.slider-btn {
  position: absolute;

  top: 50%;

  transform: translateY(-50%);

  display: flex;
  align-items: center;
  justify-content: center;

  width: clamp(30px, 3vw, 40px);
  height: clamp(30px, 3vw, 40px);

  padding: 0;

  background: #000;
  color: white;

  border: none;
  border-radius: 50%;

  font-size: clamp(14px, 1.5vw, 20px);

  cursor: pointer;

  z-index: 10;
}

.left {
  left: clamp(6px, 1vw, 10px);
}

.right {
  right: clamp(6px, 1vw, 10px);
}

/* =========================
   FULLSCREEN
   ========================= */

.fullscreen {
  &-overlay {
    position: fixed;

    top: 0;
    left: 0;

    width: 100vw;
    height: 100vh;

    background: rgba(0, 0, 0, 0.85);

    display: flex;
    justify-content: center;
    align-items: center;

    z-index: 9999;

    backdrop-filter: blur(10px);
  }

  &-content {
    position: relative;

    max-width: 100vw;
    max-height: 100vh;

    display: flex;
    justify-content: center;
    align-items: center;
  }

  &-image {
    max-width: 100vw;
    max-height: 100vh;

    width: auto;
    height: auto;

    object-fit: contain;

    border-radius: 12px;
  }
}

.close-btn {
  position: absolute;

  top: 15px;
  right: 20px;

  width: 40px;

  font-size: 30px;
  color: white;

  background: grey;

  border-radius: 20px;
  border: 1px solid white;

  cursor: pointer;

  z-index: 10;
}

.fullscreen-overlay .slider-btn {
  background: rgba(0, 0, 0, 0.6);

  font-size: 24px;
}

/* =========================
   СМАРТФОН
   ========================= */

@media (max-width: 600px) {
  .place-main-info {
    width: 100%;

    &__heading {
      flex-wrap: wrap;
    }

    &__title {
      font-size: 18px;
      margin-bottom: 10px;
    }

    &__description {
      font-size: 13px;
      margin-top: 20px;
    }

    &__categories {
      gap: 8px;
      padding: 30px 0;
    }

    &__category {
      min-width: auto;
      padding: 6px 12px;
      font-size: 11px;
    }

    &__category img {
      width: 18px;
      height: 18px;
    }
  }

  .slider-container {
    width: 100%;
  }

  .place-main-info__photo {
    width: 100%;
    max-width: 100%;
    flex: 0 0 100%;
  }
}
</style>
