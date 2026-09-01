<template>
  <div class="header" :style="headerStyle">
    <HeaderAllPages @openAddModal="$emit('openAddModal')" />

    <div class="header__hero-block">
      <h1 class="header__hero-title">Вітаємо вас на «Мандруй»</h1>
      <p class="header__hero-text">
        Наш сайт — це сервіс, призначений для пошуку відпочинкових, історичних
        та туристичних місць. Завдяки структурованій інформації, детальному
        опису, фото та координатам, будь-який турист може знайти точку неподалік
        від себе, аби відвідати її. Якщо ви знаєте цікаве місце, якого немає в
        переліку, тоді ви маєте можливість надіслати заявку на додання його в
        наш список.
      </p>
      <div class="header__hero-buttons">
        <router-link
          :to="{ name: 'SearchPlacePage', query: { name: 'Yarik' } }"
          class="header__hero-buttons--search"
        >
          Розпочати пошук
        </router-link>
        <div class="header__hero-buttons--icon">
          <a href="#questions" class="header__hero-buttons--learn">
            Дізнатися більше
            <img
              src="../../assets/svg/arrow-more.svg"
              alt="Arrow"
              class="icon"
            />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderAllPages from "./HeaderAllPages";
import backgrounds from "../../utils/backgrounds.js";
export default {
  name: "MainHeader",
  components: {
    HeaderAllPages,
  },
  emits: ["openAddModal"],
  data() {
    return {
      bgIndex: 0, // поточне зображення
      timerId: null,
    };
  },
  computed: {
    headerStyle() {
      return {
        backgroundImage: `url(${backgrounds[this.bgIndex]})`,
      };
    },
  },

  mounted() {
    this.timerId = setInterval(() => {
      this.bgIndex = (this.bgIndex + 1) % backgrounds.length;
    }, 60_000);
  },

  beforeUnmount() {
    clearInterval(this.timerId);
  },
};
</script>

<style lang="scss" scoped>
@import "../../assets/scss/variables.scss";
.header {
  display: flex;
  flex-direction: column;
  align-content: center;
  gap: clamp(100px, 20vw, 324px);
  width: 100%;
  height: 1080px;
  /* можна додати властивості позиціонування фонів,
     які НЕ змінюються від картинки до картинки */
  background-size: cover;
  background-position: center;
  transition: background-image 1s ease-in-out; // плавне згасання
  position: relative;
}
.header__hero-block {
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  font-style: normal;
  font-family: e-Ukraine, sans-serif;

  width: min(50%, 700px);

  gap: clamp(20px, 2.8vw, 40px);
  margin: 0 clamp(20px, 17vw, 324px);

  color: #fafafa;
  background: #212126;
  opacity: 0.7;
  padding: clamp(20px, 2.8vw, 40px);
  border-radius: 10px;

  position: relative;
  z-index: 1;
}

.header__hero-title {
  display: inline-flex;
  width: 100%;
  justify-content: center;
  text-align: center;
  font-size: clamp(22px, 2.2vw, 32px);
  font-weight: 700;
  line-height: 1.2;
}

.header__hero-text {
  color: #fafafa;
  font-size: clamp(11px, 1vw, 14px);
  font-weight: 600;
  line-height: 1.8;
}

.header__hero-buttons {
  display: flex;
  flex-direction: row;
  align-items: space-around;
  gap: clamp(25px, 5vw, 72px);
}

.header__hero-buttons--search {
  display: flex;
  padding: clamp(8px, 0.8vw, 12px) clamp(20px, 3vw, 44px);
  justify-content: center;
  align-items: center;

  border-radius: 5px;
  border: 1px solid #6b76ff;
  background: #6b76ff;

  color: #fff;
  text-align: center;
  font-size: clamp(13px, 1.3vw, 19px);
  font-weight: 700;
  text-decoration: none;
}

.header__hero-buttons--learn {
  display: flex;
  align-items: center;
  gap: 4px;
  // white-space: nowrap;

  color: #fff;
  text-align: center;
  font-size: clamp(13px, 1.3vw, 19px);
  font-weight: 700;
  text-decoration: none;
}

.header__hero-buttons--learn:hover {
  opacity: 70%;
}

.header__hero-buttons--icon {
  display: flex;
  align-items: center;
}

.icon {
  display: block;
  width: 12px;
  height: 16px;
  flex-shrink: 0;
  stroke-width: 2px;
  stroke: #fff;
}

/* Смартфон */
@media (max-width: 680px) {
  .header__hero-buttons {
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }

  .header__hero-title {
    font-size: 19px;
  }
}
</style>
