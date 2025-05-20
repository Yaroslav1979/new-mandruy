<template>       
    <div class="header" :style="headerStyle">     

      <HeaderAllPages @openAddModal="$emit('openAddModal')" />

      <div class="header__hero-block">
        <h1 class="header__hero-title">Вітаємо вас на «Мандруй»</h1>
        <p class="header__hero-text">
          Наш сайт — це сервіс, призначений для пошуку відпочинкових, історичних
          та туристичних місць. Завдяки структурованій інформації, детальному
          опису, фото та координатам, будь-який турист може знайти точку
          неподалік від себе, аби відвідати її. Якщо ви знаєте цікаве місце,
          якого немає в переліку, тоді ви маєте можливість надіслати заявку на
          додання його в наш список.
        </p>
        <div class="header__hero-buttons">
          <!-- <a href="#search" class="header__hero-buttons--search"> Розпочати пошук</a> -->
          <router-link
          :to="{ name: 'SearchPlacePage', query: { name: 'Yarik' } }"
         class="header__hero-buttons--search"
        >
        Розпочати пошук 
        </router-link>
          <div>
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
  emits: ['openAddModal'],
  data() {
    return {
      bgIndex: 0,              // поточне зображення
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
  gap: 324px;
  width: 100%;
  height: 1080px;
  /* можна додати властивості позиціонування фонів,
     які НЕ змінюються від картинки до картинки */
  background-size: cover;
  background-position: center;
  transition: background-image 1s ease-in-out; // плавне згасання
}

.header__hero-block {
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  font-style: normal;
  font-family: e-Ukraine, sans-serif;
  width: 40%;
  gap: 40px;
  margin: 0px 324px;
  color: #fafafa;
  background: #212126;
  opacity: 0.7;
  padding: 40px;
  border-radius: 10px;
}
.header__hero-title {
  display: inline-flex;
  justify-content: center;
  text-align: center;
  font-size: 32px;
  font-weight: 700;
  line-height: 18px;
}
.header__hero-text {
  color: #fafafa;  
  font-size: 14px;
  font-weight: 600;
  line-height: 25px;
}
.header__hero-buttons {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 72px;
}
.header__hero-buttons--search {
  display: flex;
  padding: 12px 44px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 5px;
  border: 1px solid #6b76ff;
  background: #6b76ff;
  color: #fff;
  text-align: center;
  font-size: 19px;
  font-weight: 700;
  text-decoration: none;
}
.header__hero-buttons--search:hover {
  opacity: 70%;
  border: 2px solid #6b75ff;
  padding: 12px 47.2px;
  font-size: 18px;
}
.header__hero-buttons--learn {
  display: flex;
  position: relative;
  color: #fff;
  text-align: center;
  font-size: 19px;
  font-weight: 700;
  text-decoration: none;
}
.header__hero-buttons--learn:hover {
  opacity: 70%;
  font-size: 18px;
}
.icon {
  display: flex;
  position: absolute;
  left: 110%;
  top: 20%;
  width: 12px;
  height: 16px;
  stroke-width: 2px;
  stroke: #fff;
}
</style>
