<template>
  <section class="map" id="map">
    <h3 class="map__title">Інтерактивна мапа</h3>

    <div class="map__wrapper">
      <iframe
        class="map__googl-map"
        src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d111939.82082888731!2d25.89549818429925!3d50.34745209765328!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1suk!2sua!4v1694978416550!5m2!1suk!2sua"
        allowfullscreen
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
      >
      </iframe>

      <div class="map__btn">
        <a
          href="https://www.google.com/maps/@50.393338,25.9771985,11.38z?authuser=0&entry=ttu"
          target="_blank"
          rel="noopener noreferrer"
          class="map__btn-link"
        >
          <span class="map__btn-text">Google Maps</span>
          <span class="map__btn-arrow"></span>
        </a>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "ActiveMap",
};
</script>

<style lang="scss" scoped>
@import "../../assets/scss/variables.scss";

.map {
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: clamp(25px, 4vw, 48px);
  background-color: #aaa;
  padding: clamp(30px, 4vw, 48px) 20px;

  &__title {
    display: flex;
    justify-content: center;
    color: #000;
    font-family: e-Ukraine, sans-serif;
    text-align: center;
    font-size: clamp(16px, 1.8vw, 24px);
    font-weight: 700;
    line-height: 1.2;
    text-transform: uppercase;
  }

  /* Контейнер самої карти */
  &__wrapper {
    position: relative;
    width: 100%;
    max-width: 1300px;
    aspect-ratio: 1300 / 620;
  }

  &__googl-map {
    display: block;
    width: 100%;
    height: 100%;
    border: 0;
  }

  /* Кнопка поверх карти */
  &__btn {
    position: absolute;
    right: clamp(15px, 2vw, 30px);
    bottom: clamp(15px, 2vw, 30px);
    background: #000;
    border-radius: 5px;
    padding: clamp(6px, 0.8vw, 10px) clamp(12px, 1.5vw, 20px);
    z-index: 2;

    &:hover {
      opacity: 0.8;
    }
  }

  &__btn-link {
    display: flex;
    align-items: center;
    gap: clamp(6px, 0.8vw, 10px);
    text-decoration: none;
  }

  &__btn-text {
    color: #fff;
    font-family: e-Ukraine, sans-serif;
    font-size: clamp(11px, 1.2vw, 16px);
    font-weight: 500;
    line-height: 1.4;
  }

  &__btn-arrow {
    display: block;
    width: clamp(9px, 0.9vw, 12px);
    height: clamp(9px, 0.9vw, 12px);
    background-image: url("../../assets/svg/IconMapArrow.svg");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;

    flex-shrink: 0;
  }
}

@media (max-width: 600px) {
  .map {
    gap: 25px;
    padding: 30px 16px;
  }

  .map__title {
    font-size: 16px;
  }

  .map__wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
    aspect-ratio: auto;
  }

  .map__googl-map {
    width: 100%;
    height: 200px;
  }

  .map__btn {
    position: static;
    align-self: center;
    margin-top: 12px;
    padding: 7px 12px;
  }

  .map__btn-text {
    font-size: 11px;
  }

  .map__btn-arrow {
    width: 9px;
    height: 9px;
  }
}
</style>
