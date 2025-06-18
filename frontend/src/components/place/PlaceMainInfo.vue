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
          @dblclick="enterFullscreen((index - 1 + place.imgUrls.length) % place.imgUrls.length)"
        />
      </div>
      <button @click="prevSlide" class="slider-btn left">❮</button>
      <button @click="nextSlide" class="slider-btn right">❯</button>
    </div>

    <p class="place-main-info__description">{{ place.descr }}</p>
    <p class="place-main-info__description">
      <strong>Місце розташування:</strong>
      {{ place.location?.city }}, {{ place.location?.region }}
    </p>
    <p class="place-main-info__description">
      <strong>Координати:</strong> {{ place.location?.coordinate }}
    </p>

    <!-- Відображення категорій -->
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
    </div><div v-if="isFullscreen" class="fullscreen-overlay" @click.self="exitFullscreen">
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
import Rating from "../StarRating.vue";
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
  computed: {
    loopedImages() {
      if (!this.place?.imgUrls?.length) return [];
      const imgs = this.place.imgUrls;
      return [imgs[imgs.length - 1], ...imgs, imgs[0]]; // [останнє, ...реальні, перше]
    },
  },
  data() {
    return {
      currentIndex: 1,
      isFullscreen: false,
      fullscreenIndex: 0,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.scrollToIndex(1, "auto"); // без анімації одразу на перший справжній слайд
      this.currentIndex = 1; // не забудь оновити індекс
      this.$refs.slider.addEventListener("scroll", this.handleScroll);
    });
  },
  beforeUnmount() {
    this.$refs.slider?.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    getCategoryIcon(categoryId) {
      const category = categories.find((cat) => cat.id === categoryId);
      return category ? category.svgUrl : "";
    },
    getCategoryTitle(categoryId) {
      const category = categories.find((cat) => cat.id === categoryId);
      return category ? category.title : "";
    },
    scrollToIndex(index, behavior = "smooth") {
      const slider = this.$refs.slider;
      const slideWidth = slider.children[0].offsetWidth + 10; // gap
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
      const slideWidth = slider.children[0].offsetWidth + 10;
      const scrollLeft = slider.scrollLeft;
      const totalSlides = this.loopedImages.length;

      const index = Math.round(scrollLeft / slideWidth);

      // Якщо клон останнього (тобто після реального останнього)
      if (index === totalSlides - 1) {
        // Чекаємо закінчення scroll анімації
        this.waitForScrollEnd(() => {
          this.currentIndex = 1;
          this.scrollToIndex(1, "auto"); // Миттєво без анімації
        });
      }

      // Якщо клон першого (перед реальним першим)
      else if (index === 0) {
        this.waitForScrollEnd(() => {
          this.currentIndex = totalSlides - 2;
          this.scrollToIndex(this.currentIndex, "auto");
        });
      } else {
        this.currentIndex = index;
      }
    },
    waitForScrollEnd(callback) {
      let lastScrollLeft = this.$refs.slider.scrollLeft;
      let sameCount = 0;

      const check = () => {
        const currentScrollLeft = this.$refs.slider.scrollLeft;
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
    enterFullscreen(index) {
  this.fullscreenIndex = index;
  this.isFullscreen = true;
  document.body.style.overflow = 'hidden'; // блокує прокрутку
},
exitFullscreen() {
  this.isFullscreen = false;
  document.body.style.overflow = ''; // повертає прокрутку
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
  &__heading {
    display: flex;
  }

  &__title {
    font-size: 20px;
    font-weight: 700;
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

  &__categories {
    display: flex;
    justify-content: left;
    flex-wrap: wrap; /* Додає перенесення на новий рядок */    
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

  &__photo {
    max-width: 800px;
    border-radius: 12px;
    scroll-snap-align: start;
  }
}

.place-main-info__category img {
  width: 24px;
  height: 24px;
}

.slider-container {
  position: relative;
  overflow: hidden;
  width: 650px;
  margin-bottom: 20px;
}

.slider {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  width: 100%;

  &-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: #000;
    color: white;
    border: none;
    cursor: pointer;
    padding: 8px 12px;
    z-index: 10;
    border-radius: 50%;
  }
}
.left {
  left: 10px;
}

.right {
  right: 10px;
}

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
    max-height: 100vh;
    height: 100vh;
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
</style>
