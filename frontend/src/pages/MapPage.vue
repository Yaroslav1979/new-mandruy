<template>
  <div class="head">
    <HeaderAllPages @openAddModal="isModalOpen = true" />
  </div>

  <main>
    <div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <template v-if="!isSuccess">
          <AddPlaceForm @added="handleNewPlace" />
        </template>

        <template v-else>
          <div class="success-message">
            <p>Місце успішно додано!</p>
            <button @click="closeModal">Добре</button>
          </div>
        </template>
      </div>
    </div>

    <!-- Передаємо масив місць у мапу -->
    <ActiveMap :places="places" />
  </main>
</template>

<script>
import AddPlaceForm from "../components/shared/AddPlaceForm.vue";
import HeaderAllPages from "../components/shared/HeaderAllPages.vue";
import ActiveMap from "../components/shared/ActiveMap.vue";
import axios from "axios"; // Додано для запиту на бекенд

export default {
  name: "PlacePage",
  components: {
    HeaderAllPages,
    ActiveMap,
    AddPlaceForm,
  },
  data() {
    return {
      places: [], // ✅ Масив оголошено, щоб мапа не падала
      isModalOpen: false, // ДЛЯ МОДАЛКИ
      isSuccess: false, // ✅ Додано стан успіху для шаблону
    };
  },
  async created() {
    // Завантажуємо існуючі місця з бази при завантаженні сторінки
    try {
      const response = await axios.get(
        "http://localhost:3000/api/places/approved",
      );
      this.places = response.data;
      console.log("📥 Завантажені місця для мапи:", this.places);
    } catch (error) {
      console.error("Помилка при завантаженні місць для мапи:", error);
    }
  },

  methods: {
    // ✅ Правильний синтаксис об'єкта methods у Vue.js
    handleNewPlace(newPlace) {
      this.places.push(newPlace); // Мапа автоматично поставить мітку
      this.isSuccess = true; // Перемикаємо модалку на екран успіху
    },

    closeModal() {
      this.isModalOpen = false;
      this.isSuccess = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.head {
  background-color: #111;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  padding: 1rem;
  box-sizing: border-box;
}

.modal-content {
  background: #fff;
  padding: 2rem;
  border-radius: 16px;
  max-width: 1300px;
  width: 100%;
  box-sizing: border-box;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  overflow-y: auto;
  max-height: 90vh;
}

.success-message {
  text-align: center;
  font-family: e-Ukraine, sans-serif;
  font-size: 18px;
}

.success-message button {
  margin-top: 20px;
  padding: 12px 24px;
  background-color: black;
  color: white;
  border-radius: 5px;
  border: none;
  cursor: pointer;
}
</style>
