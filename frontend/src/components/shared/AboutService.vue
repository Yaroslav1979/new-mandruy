<template>
  <section class="about-service">
    <div class="about-service__wrapp"></div>
    <h2 class="about-service__title">ПРО СЕРВІС</h2>

    <div class="about-service__cont">
      <a href="#search" class="about-service__link">
        <span class="about-service__empty"></span>
        <img
          class="about-service__img"
          src="../../assets/svg/Group14.svg"
          alt="picture"
        />
        <h3 class="about-service__slogan">Різноманіття</h3>
        <p class="about-service__descr">
          В нашій базі можна знайти місця для таборів або недовготривалих
          мандрівок, визначні історичні пам’ятки, річки чи озера.
        </p>
      </a>

      <a href="#search" class="about-service__link">
        <span class="about-service__empty"></span>
        <img
          class="about-service__img"
          src="../../assets/svg/Group15.svg"
          alt="picture"
        />
        <h3 class="about-service__slogan">Сортування</h3>
        <p class="about-service__descr">
          Усі місця чи пам’ятки відсортовані за категоріями. Ви можете легко
          знайти те, що вам потрібно, задавши певні параметри пошуку.
        </p>
      </a>

      <a href="#map" class="about-service__link">
        <span class="about-service__empty"></span>
        <img
          class="about-service__img"
          src="../../assets/svg/Group16.svg"
          alt="picture"
        />
        <h3 class="about-service__slogan">Інтерактивна мапа</h3>
        <p class="about-service__descr">
          Кожне місце також можна переглянути на Google Мапах, що додає
          зручності для прокладання маршрутів.
        </p>
      </a>
    </div>
  </section>
</template>

<script>
export default {
  name: "AboutService",
};
</script>

<style lang="scss" scoped>
@import "../../assets/scss/variables.scss";

.about-service {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(25px, 3vw, 40px);
  flex-shrink: 0;
  padding: clamp(20px, 2vw, 30px) 0;

  &__title {
    color: #000;
    text-align: center;
    font-family: e-Ukraine, sans-serif;
    font-size: clamp(20px, 2vw, 24px);
    font-weight: 700;
    line-height: 1.2;
    text-transform: uppercase;
    margin: 0;
  }

  &__cont {
    display: flex;
    justify-content: center;
    flex-direction: row;
    align-items: stretch;

    width: 75%;
    gap: clamp(40px, 7vw, 100px);
  }

  &__link {
    display: flex;
    position: relative;
    flex-direction: column;
    align-items: center;

    /*
     * Замість width: 16%
     * картка має власну адаптивну ширину
     */
    width: clamp(180px, 18vw, 260px);

    cursor: pointer;
    text-decoration: none;
  }

  &__empty {
    display: flex;
    position: absolute;

    /*
     * 260 × 292 на великому ПК,
     * плавне зменшення на планшеті
     */
    width: clamp(180px, 18vw, 260px);
    height: clamp(205px, 20.3vw, 292px);

    flex-shrink: 0;

    top: clamp(25px, 2.2vw, 32px);

    border-radius: clamp(7px, 0.7vw, 10px);

    background: #fff;
    box-shadow: 0px 4px 150px 0px rgba(130, 130, 130, 0.2);
  }

  &__img {
    display: block;

    /*
     * 132 × 112 на ПК
     */
    width: clamp(90px, 9.2vw, 132px);
    height: clamp(76px, 7.8vw, 112px);

    margin-bottom: clamp(30px, 3.3vw, 48px);

    z-index: 1;
    flex-shrink: 0;
  }

  &__slogan {
    display: flex;
    flex-direction: column;
    justify-content: center;

    margin: 0;

    color: #000;
    text-align: center;
    font-family: e-Ukraine, sans-serif;

    font-size: clamp(13px, 1.1vw, 16px);
    font-weight: 700;
    line-height: 1.2;

    z-index: 1;
  }

  &__descr {
    display: flex;
    flex-direction: column;
    justify-content: center;

    margin: 0;

    color: #000;
    text-align: center;
    font-family: e-Ukraine, sans-serif;

    font-size: clamp(10px, 0.85vw, 12px);
    font-weight: 400;
    line-height: 1.5;

    z-index: 1;
  }

  &__link:hover &__empty {
    border: 2px solid #6b75ff;
    opacity: 80%;
  }

  &__link:hover &__slogan {
    font-size: clamp(14px, 1.15vw, 17px);
  }

  &__link:hover &__descr {
    font-size: clamp(11px, 0.9vw, 13px);
  }
}

/* =========================
   ПЛАНШЕТ
   ========================= */

@media (max-width: 900px) {
  .about-service {
    &__cont {
      width: 90%;
      gap: clamp(20px, 4vw, 50px);
    }

    &__link {
      width: clamp(160px, 25vw, 220px);
    }

    &__empty {
      width: clamp(160px, 25vw, 220px);
      height: clamp(190px, 30vw, 250px);
    }
  }
}

/* =========================
   СМАРТФОН
   ========================= */

@media (max-width: 600px) {
  .about-service {
    gap: 25px;
    padding: 20px 0;

    &__title {
      font-size: 20px;
    }

    &__cont {
      flex-direction: column;
      align-items: center;
      width: 100%;
      gap: 40px;
    }

    &__link {
      width: 260px;
      min-height: 292px;
    }

    &__empty {
      width: 260px;
      height: 292px;
      top: 32px;
    }

    &__img {
      width: 132px;
      height: 112px;
      margin-bottom: 48px;
    }

    &__slogan {
      font-size: 16px;
    }

    &__descr {
      font-size: 12px;
    }

    &__link:hover &__slogan {
      font-size: 17px;
    }

    &__link:hover &__descr {
      font-size: 13px;
    }
  }
}
</style>
