<template>
    <Container>
    <!-- <router-link to="/"> --> 
    <div class="header">
      <div class="header-top">
        <LogoType />
        <span>
          <a href="#" class="header-top__nav">Про сервіс </a>
          <a href="#" class="header-top__nav">Пошук місць </a>
          <a href="#" class="header-top__nav">Додати місце </a>
          <a href="#" class="header-top__nav">Контакти </a>
        </span>
      </div>

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
          <a href="#" class="header__hero-buttons--search"> Розпочати пошук</a>
          <div>
            <a href="#" class="header__hero-buttons--learn">
              Дізнатися більше
              <img
                src="../../assets/svg/arrow-more.svg"
                alt="logo"
                class="icon"
              />
            </a>
          </div>
        </div>
      </div>
    </div>   
    <!-- </router-link> -->
  </Container>
</template>

<script>
import Container from "../shared/Container.vue";
import LogoType from "./LogoType";
export default {
  name: "MainHeader",
  components: {
    Container,
    LogoType,
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
  background: url(../../assets/synevir.jpg);
  width: 100%;
  height: 1080px;
}

.header-top {
  display: flex;
  justify-content: space-around;
  margin: 10px;
  padding: 16px 50px;
}

.header-top > span {
  display: flex;
  gap: 100px;
  justify-content: center;
}
.header-top__nav {
  color: #fff;
  text-align: center;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 150%;
  font-family: e-Ukraine, sans-serif;
  text-decoration: none;
  padding: 16px 0;
  width: 140px;
  height: 52px;
  border-radius: 30px;
  border: 1px solid #fafafa;
  box-shadow: 0px 4px 99px 0px #454753;
}

.header-top__nav:hover {
  color: bisque;
  border: 2px solid bisque;
  opacity: 80%;
}
.header__hero-block {
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  /* font-family: e-Ukraine, sans-serif; */
  font-style: normal;
  width: 35%;
  gap: 40px;
  margin: 0px 324px;
  color: #fff;
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
  color: #fff;
  font-size: 12px;
  font-weight: 400;
  line-height: 20px;
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
