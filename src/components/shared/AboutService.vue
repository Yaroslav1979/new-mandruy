<template>
  <section class="about-service">
    <h2 class="about-service__title" id="service">ПРО СЕРВІС</h2>

    <div class="about-service__cont">
      <a href="#{{id}}" class="about-service__link">
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

      <a href="#{{id}}" class="about-service__link">
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

      <a href="#{{id}}" class="about-service__link">
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
.about-service {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 100%;
  height: 100%;
  flex-shrink: 0;
  background: #f5f4f4;
  padding: 100px 0; 
}
.about-service__title {
  color: #000;
  text-align: center;
  font-family: e-Ukraine, sans-serif;
  font-size: 24px;
  font-weight: 700;
  line-height: 18px;
  text-transform: uppercase;
  margin-bottom: 52px;
}
.about-service__cont {
  display: flex;
  justify-content: center;
  flex-direction: row;
  width: 75%;
  gap: 100px;
}
.about-service__empty {
  display: flex;
  position: absolute;
  background-color: white;
  width: 260px;
  height: 292px;
  flex-shrink: 0;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0px 4px 150px 0px rgba(130, 130, 130, 0.2);
  top: 32px;
}

.about-service__link {
  display: flex;
  position: relative;
  flex-direction: column;
  width: 16%;
  align-items: center;
  cursor: pointer;
  text-decoration: none;
}
.about-service__link:hover .about-service__empty {
  border: 2px solid #6b75ff;
  opacity: 80%;
}
.about-service__link:hover .about-img {
  width: 148px;
  height: 124px;
}

.about-service__link:hover .about-slogan {
  /* opacity: 70%; */
  font-size: 17px;
}
.about-service__link:hover .about-descr {
  /* opacity: 70%; */
  font-size: 13px;
}

.about-service__img {
  display: flex;
  margin-bottom: 48px;
  width: 132px;
  height: 112px;
  z-index: 1;
}

.about-service__slogan {
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: #000;
  text-align: center;
  font-family: e-Ukraine, sans-serif;
  font-size: 16px;
  font-weight: 700;
  line-height: 18px;
  z-index: 1;
}

.about-service__descr {
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-shrink: 0;
  color: #000;
  text-align: center;
  font-family: e-Ukraine, sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
  z-index: 1;
}
</style>
