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
            любителів дослідження теренів України. Шукай цікаві місця та додавай
            власні заповнивши форму.
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

  padding: clamp(30px, 4vw, 48px) 20px;
}

.footer {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  width: 100%;
  max-width: 1096px;

  position: relative;

  gap: clamp(30px, 6vw, 100px);

  &-content {
    display: flex;
    flex-direction: column;

    gap: clamp(12px, 1.8vw, 20px);

    &__wrapper {
      display: flex;
      flex-direction: row;

      width: 100%;
      max-width: 560px;
    }

    &__descr {
      display: flex;
      width: 100%;

      flex-direction: column;
      justify-content: flex-end;

      color: #fff;
      text-align: justify;

      font-family: e-Ukraine, sans-serif;
      font-size: clamp(10px, 1.1vw, 14px);
      line-height: 1.45;

      padding-right: clamp(20px, 7vw, 100px);
      margin: 0;
    }
  }
}

/* =========================
   СОЦІАЛЬНІ ІКОНКИ
   ========================= */

.social-block__icons {
  display: flex;
  align-items: center;

  gap: clamp(0px, 1vw, 15px);

  margin-top: -20px;
}

.box-icon {
  display: flex;
  position: relative;

  /*
   * Контейнер залишається приблизно таким,
   * як у початковому варіанті.
   */
  width: clamp(50px, 5vw, 60px);
  height: clamp(50px, 5vw, 60px);

  flex-shrink: 0;
}

.social-icon {
  display: flex;
  position: absolute;

  /*
   * ВАЖЛИВО:
   * PNG більший за контейнер, як у початковому варіанті.
   */
  width: clamp(130px, 13vw, 200px);
  height: clamp(130px, 13vw, 200px);

  left: 50%;
  top: 50%;

  transform: translate(-50%, -50%);

  object-fit: contain;
}

/* =========================
   СМАРТФОН
   ========================= */

@media (max-width: 600px) {
  section {
    padding: 30px 16px;
  }

  .footer {
    flex-direction: column;
    align-items: center;

    gap: 30px;

    max-width: 100%;
  }

  .footer-content {
    width: 100%;
    align-items: flex-start;

    gap: 15px;

    &__wrapper {
      width: 100%;
      max-width: 100%;
    }

    &__descr {
      width: 100%;

      padding-right: 0;

      font-size: 11px;
      line-height: 1.5;

      text-align: left;
    }
  }

  .social-block__icons {
    display: flex;
    align-items: center;

    gap: clamp(0px, 1vw, 15px);

    margin-top: -20px;
  }

  .box-icon {
    position: relative;

    width: clamp(70px, 6vw, 90px);
    height: clamp(70px, 6vw, 90px);

    flex-shrink: 0;
  }

  .social-icon {
    position: absolute;

    width: clamp(130px, 13vw, 200px);
    height: clamp(130px, 13vw, 200px);

    /*
   * Центруємо великий PNG відносно контейнера
   */
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    object-fit: contain;
  }

  @media (max-width: 600px) {
    .social-block__icons {
      margin-top: 10px;
      gap: 5px;
    }

    .box-icon {
      width: 65px;
      height: 65px;
    }

    .social-icon {
      width: 120px;
      height: 120px;
    }
  }
}
</style>

<!-- <style lang="scss" scoped>
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


</style> -->
