<template>
    <section class="map" id="map">
          <h3 class="map__title">Інтерактивна мапа</h3>
          <iframe class="map__googl-map" src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d111939.82082888731!2d25.89549818429925!3d50.34745209765328!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1suk!2sua!4v1694978416550!5m2!1suk!2sua" width="1300" height="620" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade">
           </iframe>
           <div class="map__btn">
              <a href="https://www.google.com/maps/@50.393338,25.9771985,11.38z?authuser=0&entry=ttu" target="_blank" rel="noopener noreferrer" class="map__btn-link">
                <button class="map__btn-text">Google Maps</button>
                <span class="map__btn-arrow"></span>
              </a>             
            </div>    
      </section>
</template>

<script>
    export default {
        name: "ActiveMap",
    }
</script>

<style lang="scss" scoped>
@import "../../assets/scss/variables.scss";
.map {
  display: flex;
  position: relative; 
  flex-direction: column;
  justify-content: center;
  gap: 48px;
  background-color: #000;
  padding: 48px 0;

  &__title {
    display: flex;
    justify-content: center;
    color: #fff;

    font-family: e-Ukraine, sans-serif;
    text-align: center;
    font-size: 24px;
    font-style: normal;
    font-weight: 700;
    line-height: 18px; 
    text-transform: uppercase;
  }
  &__googl-map {
  display: flex;  
  align-self:  center;
}


  &__btn {   
    position: absolute;
    background: #000;
    border-radius: 5px;
    left: 72%;
    top: 85%;
    padding: 10px 20px;
  }

  &__btn:hover {
    opacity: 80%;
  }

  &__btn-link {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 10px;
    text-decoration: none;
  }

    &__btn-text {
    color: #fff;
    text-align: center;
    font-family: e-Ukraine, sans-serif;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 140%;
    background: #000;
    border: 1px solid #000;
    }

    &__btn-arrow {
      display: flex;
      align-self: center;
      /* color: #fff; */
      width: 12px;
      height: 12px;
      background-image: url('../../assets/svg/IconMapArrow.svg');
      z-index: 10;
    }
}

</style>