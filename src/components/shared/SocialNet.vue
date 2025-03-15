<template>
  <section class="social" id="social">
    <div class="social__bgd"></div>
    <img class="social__picture" src="../../assets/png/phone.png" alt="picture" srcset="" />

    <div class="social-block">
      <h2 class="social-block__title">Слідкуй за нами в соцмережах</h2>

      <p class="social-block__text">
        Отримуй актуальні новини про сервіс “Мандруй” та ділись із друзями.
        Дякуємо за підтримку. Якщо ти маєш якісь пропозиції чи зауваження щодо
        функціоналу або роботи сайту, тоді напиши нам.
      </p>

      <div class="social-block__icons">
        <div class="box-icon">
          <a href="">
            <img class="social-icon" src="../../assets/png/instagram.png" alt="" />
          </a>
        </div>
        <div class="box-icon">
          <a href="">
            <img class="social-icon" src="../../assets/png/Facebook.png" alt="" />
          </a>
        </div>
        <div class="box-icon">
          <a href="">
            <img class="social-icon" src="../../assets/png/Telegram.png" alt="" />
          </a>
        </div>
      </div>
    </div>
</section>
</template>

<script>
export default {
  name: "SocialNet",
};
</script>

<style lang="scss" scoped>
@import "../../assets/scss/variables.scss";

.social {
  display: flex;
  position: relative;
  margin: 100px 0;
  &__bgd {
    display: flex;
    width: 100%;
    height: 460px;
    top: 0px;
    flex-shrink: 0;
    background-color: #000;
    transform: skewY(3deg);
    margin: 20px 0;
  }

  &-block {
    display: flex;
    flex-direction: column;
    position: absolute;
    left: 880px;
    top: 160px;
    width: 30%;

      &__title {
      color: #fff;
      font-family: e-Ukraine, sans-serif;
      font-size: 28px;
      font-weight: 700;
      line-height: normal;
      margin-bottom: 20px;
    }

    &__text {
      color: #bcbcbc;
      font-family: e-Ukraine, sans-serif;
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 140%;
    }
      &__icons {
      display: flex;
      margin-top: -20px;
    }
  }
}

  .social__picture {
  position: absolute;
  top: -68px;
  left: 400px;
  width: 360px;
  height: 668px;
  transform: rotate(-2.001eg);
  flex-shrink: 0;


  &:last-of-type {
    position: absolute;
    top: -80px;
    left: 388px;
    width: 384px;
    height: 668px;
    transform: rotate(-2.001eg);
    flex-shrink: 0;
  }
}

.box-icon {
  display: flex;
  position: relative;
  width: 60px;
  height: 60px;
}

.social-icon {
  display: flex;
  position: absolute;
  align-self: center;
  left: 20px;
  width: 200px;
  height: 200px;
}

</style>
