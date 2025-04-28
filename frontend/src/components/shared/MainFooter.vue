<template>
  <section>
    <footer class="footer">
      <div class="footer-content__wrapper">
        <div class="footer-content">
          <p>
            <LogoType />
          </p>
          <!-- <div class="footer-label"> -->
            <p class="footer-content__descr">
              Туристично-пошуковий сервіс “Мандруй” - це корисний існтрумент для
              любителів дослідження теренів України. Шукай цікаві місця та
              додавай власні, шляхом подачі заявок адміністрації сайту.
            </p>
            <p class="footer-content__descr">2025© Мандруй. Усі права захищені</p>
          <!-- </div> -->
        </div>
      </div>

      <div class="social-block__icons">
        <div class="box-icon">
          <a href="">
            <img
              class="social-icon"
              src="../../assets/png/instagram.png"
              alt=""
            />
          </a>
        </div>
        <div class="box-icon">
          <a href="">
            <img
              class="social-icon"
              src="../../assets/png/Facebook.png"
              alt=""
            />
          </a>
        </div>
        <div class="box-icon">
          <a href="">
            <img
              class="social-icon"
              src="../../assets/png/Telegram.png"
              alt=""
            />
          </a>
        </div>
      </div>
    </footer>
  </section>
</template>


<script>
import LogoType from "./LogoType";

export default {
  name: "MainFooter",
  components: {   
    LogoType,
  },
};
</script>

<style lang="scss" scoped>
@import "../../assets/scss/variables.scss";
section {
  display: flex;
  justify-content: center;
  background-color: #111;
  padding: 48px 0;
}

.footer {
  display: flex;
  flex-direction: row;
  max-width: 1096px;
  align-content: space-between;
  align-items: center;
  position: relative;

  &-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
  
    &__wrapper {
    display: flex;
    flex-direction: row;
    max-width: 560px; 
    /* margin-top: 20px;  */
    }

    &__descr {
    display: flex;
    width: 560px;
    flex-direction: column;
    justify-content: flex-end;
    color: #fff;
    text-align: justify;
    font-family: e-Ukraine, sans-serif;
    font-size: 14px;
    line-height: 20px;
    padding-right: 100px;
    }
  }
}




  .social-block__icons {
    display: flex;
    margin-top: -20px;
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
