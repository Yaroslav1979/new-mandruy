<template>
  <div class="map-modal-overlay" @click.self="close">
    <div class="map-modal-content">
      <div class="map-modal-header">
        <h3>Виберіть точку на мапі</h3>
        <button type="button" class="close-modal-btn" @click="close">×</button>
      </div>
      <div id="google-map-container" class="map-container"></div>
      <div class="map-modal-footer">
        <button type="button" class="confirm-map-btn" @click="confirm">
          Вибрати цю точку
        </button>
      </div>
    </div>
  </div>
</template>

<script>
/* global google */
export default {
  name: "AddCoordinate",
  props: {
    initialCoordinate: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      map: null,
      marker: null,
      selectedLat: null,
      selectedLng: null,
    };
  },
  mounted() {
    this.initGoogleMap();
  },
  methods: {
    initGoogleMap() {
      if (typeof google === "undefined" || !google.maps) {
        alert("Google Maps API не завантажено на сторінці.");
        return;
      }

      const defaultCenter = { lat: 48.3794, lng: 31.1656 }; // Центр України за замовчуванням
      let initialCenter = defaultCenter;

      // Якщо вже передані якісь координати — центруємо на них
      if (this.initialCoordinate && this.initialCoordinate.includes(",")) {
        const parts = this.initialCoordinate
          .split(",")
          .map((item) => parseFloat(item.trim()));
        if (!isNaN(parts[0]) && !isNaN(parts[1])) {
          initialCenter = { lat: parts[0], lng: parts[1] };
          this.selectedLat = parts[0];
          this.selectedLng = parts[1];
        }
      }

      const mapContainer = document.getElementById("google-map-container");
      if (!mapContainer) return;

      this.map = new google.maps.Map(mapContainer, {
        center: initialCenter,
        zoom: 6,
      });

      // Ставимо початковий маркер, якщо координати вже були задані
      if (this.selectedLat !== null && this.selectedLng !== null) {
        this.marker = new google.maps.Marker({
          position: initialCenter,
          map: this.map,
        });
      }

      // Клік по мапі
      this.map.addListener("click", (event) => {
        const clickedPos = event.latLng;
        this.selectedLat = clickedPos.lat();
        this.selectedLng = clickedPos.lng();

        if (this.marker) {
          this.marker.setPosition(clickedPos);
        } else {
          this.marker = new google.maps.Marker({
            position: clickedPos,
            map: this.map,
          });
        }
      });
    },

    confirm() {
      if (this.selectedLat !== null && this.selectedLng !== null) {
        const formattedCoordinates = `${this.selectedLat.toFixed(
          6,
        )}, ${this.selectedLng.toFixed(6)}`;
        this.$emit("confirm", formattedCoordinates);
      }
      this.close();
    },

    close() {
      this.$emit("close");
    },
  },
};
</script>

<style scoped>
.map-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.map-modal-content {
  background: white;
  width: 90%;
  max-width: 700px;
  height: 500px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.map-modal-header {
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
}

.close-modal-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
}

.map-container {
  flex-grow: 1;
  width: 100%;
}

.map-modal-footer {
  padding: 12px 16px;
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid #eee;
}

.confirm-map-btn {
  background-color: #4285f4;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.confirm-map-btn:hover {
  background-color: #3367d6;
}
</style>
