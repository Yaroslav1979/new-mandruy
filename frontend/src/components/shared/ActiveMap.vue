<template>
  <section class="map" id="map">
    <h3 class="map__title">Інтерактивна мапа</h3>

    <div class="map__wrapper">
      <!-- Контейнер для Google Maps JavaScript API (замість iframe) -->
      <div id="main-google-map" class="map__googl-map"></div>

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
/* global google */
export default {
  name: "ActiveMap",
  props: {
    // Масив місць, які приходять із батьківської сторінки (MapPage)
    places: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      map: null,
      markers: [],
    };
  },
  mounted() {
    this.initMap();
  },
  watch: {
    // Як тільки масив places змінюється (додається нове місце), мапа оновлює мітки
    places: {
      handler(newPlaces) {
        if (this.map) {
          this.updateMarkers(newPlaces);
        }
      },
      deep: true,
    },
  },
  methods: {
    initMap() {
      if (typeof google === "undefined" || !google.maps) {
        console.error("Google Maps API не завантажено на сторінці.");
        return;
      }

      // Центр України за замовчуванням
      const defaultCenter = { lat: 50.347452, lng: 25.895498 };

      this.map = new google.maps.Map(
        document.getElementById("main-google-map"),
        {
          center: defaultCenter,
          zoom: 8,
        },
      );

      // Малюємо маркери, якщо місця вже завантажені
      if (this.places.length > 0) {
        this.updateMarkers(this.places);
      }
    },

    updateMarkers(placesList) {
      console.log("🗺️ Всі отримані місця у мапі:", placesList);

      // Очищаємо попередні маркери
      this.markers.forEach((marker) => marker.setMap(null));
      this.markers = [];

      placesList.forEach((place, index) => {
        // Пробуємо дістати координати з усіх можливих шляхів у структурі MongoDB
        const coordString =
          place.location?.coordinate || place.coordinate || place.coordinates;

        console.log(
          `🔍 Місце #${index} (${place.title}): знайдені координати ->`,
          coordString,
        );

        if (
          coordString &&
          typeof coordString === "string" &&
          coordString.includes(",")
        ) {
          const parts = coordString
            .split(",")
            .map((item) => parseFloat(item.trim()));

          if (!isNaN(parts[0]) && !isNaN(parts[1])) {
            const position = { lat: parts[0], lng: parts[1] };
            console.log(
              `✅ Створюємо маркер для "${place.title}" на позиції:`,
              position,
            );

            const marker = new google.maps.Marker({
              position,
              map: this.map,
              title: place.title,
              icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
            });

            // Інфо-віконце при кліку
            const cityName = place.location?.city || place.city || "";
            const infoWindow = new google.maps.InfoWindow({
              content: `<div><strong>${place.title}</strong><p>${cityName}</p></div>`,
            });

            marker.addListener("click", () => {
              infoWindow.open(this.map, marker);
            });

            this.markers.push(marker);
          } else {
            console.warn(
              `⚠️ Не вдалося перетворити числа для місця: ${place.title}`,
              parts,
            );
          }
        } else {
          console.warn(
            `⚠️ Пропущено місце "${place.title}" через невірний формат координат:`,
            coordString,
          );
        }
      });
    },
  },
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
}
</style>
