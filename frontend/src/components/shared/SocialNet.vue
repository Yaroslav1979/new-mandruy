<template>
  <section class="social" id="social">
    <div class="social__bgd"></div>
    <img
      class="social__picture"
      src="../../assets/png/phone.png"
      alt="picture"
      srcset=""
    />

    <div class="social-block">
      <h2 class="social-block__title">Слідкуй за нами в соцмережах</h2>

      <p class="social-block__text">
        Отримуй актуальні новини про сервіс “Мандруй” та ділись із друзями.
        Дякуємо за підтримку. Якщо ти маєш якісь пропозиції чи зауваження щодо
        функціоналу або роботи сайту, тоді напиши нам.
      </p>
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
  position: relative;
  width: 100%;
  margin: clamp(60px, 8vw, 100px) 0;

  /*
   * ФОНОВИЙ БЛОК
   */
  &__bgd {
    width: 100%;
    height: clamp(380px, 38vw, 550px);

    background-image: url("../../../public/img/landscape.jpeg");
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;

    transform: skewY(3deg);
    margin: 20px 0;
  }

  /*
   * ТЕЛЕФОН
   *
   * Телефон завжди знаходиться:
   * - зліва;
   * - вертикально по центру фону.
   */
  &__picture {
    position: absolute;

    left: clamp(30px, 20vw, 300px);

    /*
     * Центрування відносно висоти .social
     */
    top: 50%;
    transform: translateY(-50%) rotate(-2deg);

    width: clamp(230px, 28vw, 360px);
    height: auto;

    z-index: 2;
  }

  /*
   * ТЕКСТ
   *
   * Справа та вертикально по центру фону.
   */
  &-block {
    position: absolute;

    left: 55%;
    top: 50%;

    transform: translateY(-50%);

    width: clamp(280px, 32vw, 450px);

    display: flex;
    flex-direction: column;

    &__title {
      color: #000;

      font-family: e-Ukraine, sans-serif;
      font-size: clamp(20px, 2.2vw, 28px);
      font-weight: 700;
      line-height: 1.2;

      margin: 0 0 clamp(15px, 2vw, 20px);
    }

    &__text {
      color: #111;

      font-family: e-Ukraine, sans-serif;
      font-size: clamp(11px, 1.1vw, 14px);
      font-weight: 400;
      line-height: 1.4;

      margin: 0;
    }

    &__icons {
      display: flex;
      margin-top: 20px;
    }
  }
}

/* =========================================
   ПЛАНШЕТ
   ========================================= */

@media (max-width: 900px) {
  .social {
    margin: 70px 0;

    &__bgd {
      height: clamp(340px, 50vw, 450px);
    }

    &__picture {
      /*
       * Залишається зліва.
       * Вертикальне центрування не змінюємо.
       */
      left: clamp(25px, 15vw, 160px);

      top: 50%;
      transform: translateY(-50%) rotate(-2deg);

      width: clamp(210px, 30vw, 300px);
    }

    &-block {
      left: 53%;
      top: 50%;

      transform: translateY(-50%);

      width: clamp(250px, 40vw, 360px);

      &__title {
        font-size: clamp(18px, 3vw, 24px);
        line-height: 1.2;
      }

      &__text {
        font-size: clamp(10px, 1.5vw, 13px);
        line-height: 1.45;
      }
    }
  }
}

/* =========================================
   МАЛИЙ ПЛАНШЕТ
   ========================================= */

@media (max-width: 750px) {
  .social {
    &__picture {
      left: 8%;
      width: clamp(190px, 29vw, 240px);

      /*
       * Залишається вертикально по центру.
       */
      top: 50%;
      transform: translateY(-50%) rotate(-2deg);
    }

    &-block {
      left: 48%;
      width: 46%;

      &__title {
        font-size: clamp(17px, 3.2vw, 21px);
      }

      &__text {
        font-size: clamp(10px, 1.6vw, 12px);
      }
    }
  }
}

/* =========================================
   СМАРТФОН — КНИЖНА ОРІЄНТАЦІЯ
   ========================================= */

@media (max-width: 600px) and (orientation: portrait) {
  .social {
    /*
     * Робимо фон достатньо високим,
     * оскільки телефона тут вже немає.
     */
    &__bgd {
      height: 430px;
    }

    /*
     * У КНИЖНІЙ орієнтації телефон повністю прибираємо.
     */
    &__picture {
      display: none;
    }

    /*
     * Текст займає всю доступну ширину.
     */
    &-block {
      left: 16px;
      right: 16px;

      top: 50%;
      transform: translateY(-50%);

      width: auto;

      text-align: center;

      &__title {
        font-size: 20px;
        line-height: 1.25;

        margin-bottom: 15px;
      }

      &__text {
        font-size: 11px;
        line-height: 1.5;
      }

      &__icons {
        justify-content: center;
      }
    }
  }
}

/* =========================================
   СМАРТФОН — АЛЬБОМНА ОРІЄНТАЦІЯ
   ========================================= */

@media (max-width: 600px) and (orientation: landscape) {
  .social {
    &__bgd {
      /*
       * Фон стає нижчим відповідно
       * до альбомного екрана.
       */
      height: clamp(280px, 65vh, 380px);
    }

    /*
     * ТЕЛЕФОН ЗАЛИШАЄТЬСЯ.
     *
     * Він зліва і вертикально по центру фону.
     */
    &__picture {
      display: block;

      left: 8%;

      top: 50%;
      transform: translateY(-50%) rotate(-2deg);

      width: clamp(150px, 27vw, 220px);
    }

    /*
     * Текст справа від телефона.
     */
    &-block {
      left: 43%;
      right: 8%;

      top: 50%;
      transform: translateY(-50%);

      width: auto;

      &__title {
        font-size: clamp(16px, 3vw, 21px);
        line-height: 1.2;

        margin-bottom: 10px;
      }

      &__text {
        font-size: clamp(9px, 1.8vw, 12px);
        line-height: 1.4;
      }

      &__icons {
        margin-top: 10px;
      }
    }
  }
}
</style>
