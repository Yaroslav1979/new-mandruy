<template>
  <section class="contacts" id="contacts">
    <div class="contacts__bgd"></div>
    <h3 class="contacts__title">Контакти</h3>

    <div class="contacts-cont">
      <a href="https://ourwebsite.com" class="contacts__link-block">
        <img
          class="contacts__icon"
          src="../../assets/svg/iconSite.svg"
          alt="icon"
        />
        ourwebsite.com
      </a>

      <a href="mailto:ouremail1222@gmail.com" class="contacts__link-block">
        <img
          class="contacts__icon"
          src="../../assets/svg/iconMail.svg"
          alt="icon"
        />
        ouremail1222@gmail.com
      </a>

      <a href="https://t.me/telegramnickname" class="contacts__link-block">
        <img
          class="contacts__icon"
          src="../../assets/svg/iconTele.svg"
          alt="icon"
        />
        @telegramnickname
      </a>
    </div>
  </section>
</template>

<script>
export default {
  name: "ContactsUs",
};
</script>

<style lang="scss" scoped>
.contacts {
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  height: 200px;
}

/* =========================
   ФОНОВИЙ БЛОК
   ========================= */

.contacts__bgd {
  position: absolute;

  background: #f5f4f4;

  transform: skewY(3deg);

  top: 60px;
  height: clamp(400px, 45vw, 560px);

  width: 100%;
}

/* =========================
   ЗАГОЛОВОК
   ========================= */

.contacts__title {
  position: absolute;

  left: 50%;
  transform: translateX(-50%);

  top: 25px;

  margin: 0;

  color: #000;
  text-align: center;

  font-family: e-Ukraine, sans-serif;
  font-size: clamp(18px, 2vw, 24px);
  font-weight: 700;
  line-height: 1.2;

  text-transform: uppercase;
  white-space: nowrap;
}

/* =========================
   КОНТАКТИ
   ========================= */

.contacts-cont {
  display: flex;
  position: absolute;

  justify-content: space-between;
  align-items: center;

  width: min(100% - 40px, 1000px);

  left: 50%;
  transform: translateX(-50%);

  top: 100px;

  gap: clamp(10px, 2vw, 30px);
}

/* =========================
   КОНТАКТ
   ========================= */

.contacts__link-block {
  display: flex;
  align-items: center;
  justify-content: center;

  gap: clamp(8px, 1.5vw, 20px);

  padding: clamp(8px, 1vw, 12px) clamp(8px, 1vw, 10px);

  background: #fff;

  color: #000;

  font-family: e-Ukraine, sans-serif;
  font-size: clamp(10px, 1.3vw, 16px);
  font-weight: 400;
  line-height: 1.2;

  text-decoration: none;

  white-space: nowrap;

  flex: 1;
}

.contacts__icon {
  width: clamp(24px, 3vw, 40px);
  height: clamp(24px, 3vw, 40px);

  flex-shrink: 0;
}

.contacts__link-block:hover {
  border-radius: 5px;
  border: 2px solid #a5aeff;

  box-shadow: 0px 4px 190px 0px rgba(130, 130, 130, 0.25);

  opacity: 0.8;
}

/* =========================
   ПЛАНШЕТ
   ========================= */

@media (max-width: 900px) {
  .contacts {
    height: 180px;
  }

  .contacts__bgd {
    height: 420px;
  }

  .contacts-cont {
    width: calc(100% - 40px);

    gap: 12px;
  }

  .contacts__link-block {
    font-size: clamp(9px, 1.5vw, 13px);
    gap: 8px;
  }

  .contacts__icon {
    width: clamp(24px, 4vw, 34px);
    height: clamp(24px, 4vw, 34px);
  }
}

/* =========================
   СМАРТФОН
   ========================= */

@media (max-width: 600px) {
  .contacts {
    height: auto;

    padding-bottom: 40px;
  }

  .contacts__bgd {
    top: 30px;

    height: 600px;

    transform: skewY(3deg);
  }

  .contacts__title {
    position: relative;

    left: auto;
    transform: none;

    top: auto;

    margin: 40px 0 30px;

    font-size: 20px;
  }

  .contacts-cont {
    position: relative;

    top: auto;
    left: auto;
    transform: none;

    width: calc(100% - 32px);

    margin: 0 auto;

    display: flex;
    flex-direction: column;

    align-items: stretch;

    gap: 15px;
  }

  .contacts__link-block {
    width: 100%;
    box-sizing: border-box;

    justify-content: flex-start;

    padding: 12px 16px;

    font-size: 12px;

    white-space: normal;
  }

  .contacts__icon {
    width: 32px;
    height: 32px;
  }
}
</style>
