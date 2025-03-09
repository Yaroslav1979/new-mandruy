<template>
    <div class="map" id="map">
          <h3 class="map-title">Інтерактивна мапа</h3>
          <iframe class="map-link" src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d111939.82082888731!2d25.89549818429925!3d50.34745209765328!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1suk!2sua!4v1694978416550!5m2!1suk!2sua" width="1300" height="620" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade">
           </iframe>
           <div class="googl-map-link">
              <a href="https://www.google.com/maps/@50.393338,25.9771985,11.38z?authuser=0&entry=ttu" target="_blank" rel="noopener noreferrer">
              <button class="googl-map-text">Google Maps</button></a>
              <span class="google-map-arrow"></span>
            </div>    
    </div>
</template>

<script>
    export default {
        name: "ActiveMap",
    }
</script>

<style lang="scss" scoped>
.map {
  display: flex;
  position: relative; 
  flex-direction: column;
  justify-content: center;
  gap: 48px;
  background-color: #000;
  padding: 48px 0;  
}

.map-title {
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
.map-link {
  display: flex;  
  align-self:  center;
}

.googl-map-link {  
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 10px;  
  position: absolute;
  background: #000;
  border-radius: 5px;
  left: 72%;
  top: 85%;
  padding: 10px 20px;
}
.googl-map-link:hover {
  opacity: 80%;
}

.googl-map-text {
color: #FFF;
text-align: center;
font-family: e-Ukraine, sans-serif;
font-size: 16px;
font-style: normal;
font-weight: 500;
line-height: 140%;
}

.google-map-arrow {
  display: flex;
  align-self: center;
  width: 12px;
  height: 12px;
  background-image: url('../../assets/svg/IconMapArrow.svg')
}

</style>