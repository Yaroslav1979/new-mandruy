<template>
  <div class="contacts">
    <!-- <div class="contacts-block"> -->
    <div class="contacts__bgd"></div>
    <h3 class="contacts__title" id="contacts">Контакти</h3>

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

      <a
        href="https://t.me/telegramnickname" class="contacts__link-block">
        <img
          class="contacts__icon"
          src="../../assets/svg/iconTele.svg"
          alt="icon"
        />
        @telegramnickname
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: "ContactsUs",
};
</script>

<style lang="scss" scoped>
.contacts {
  background-color: #000;
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  height: 800px;
}

.contacts__bgd {
  display: flex;
  position: absolute;
  background: #f5f4f4;
  transform: skewY(-3deg);
  top: 60px;
  bottom: 100px;
  height: 560px;
  width: 100%;
}

.contacts__title {
  display: flex;
  position: absolute;
  left: 47%;
  top: 35%;
  color: #000;
  text-align: center;
  font-family: e-Ukraine, sans-serif;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 18px;
  text-transform: uppercase;
}

.contacts-cont {
  display: flex;
  position: absolute;
  justify-content: space-between;
  width: 1000px;
  left: 25%;
  top: 45%;
}

.contacts__link-block {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 12px 10px;
  background: #fff;   
  color: #000;
  font-family: e-Ukraine, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 18px;
  text-decoration: none;
}

.contacts__link-block:hover {
  border-radius: 5px;
  border: 2px solid #a5aeff;
  box-shadow: 0px 4px 190px 0px rgba(130, 130, 130, 0.25);
  padding: 8px;
  opacity: 80%;
}

/* .contacts__icon {
  display: block;
  width: 42px;
  height: 42px;
  flex-shrink: 0;
} */
 
</style>
