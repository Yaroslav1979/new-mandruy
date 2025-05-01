<template>
  <MainHeader @openAddModal="isModalOpen = true" />

  <!-- МОДАЛКА -->
  <div
    v-if="isModalOpen"
    class="modal-overlay"
    @click.self="isModalOpen = false"
  >
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

  <main class="homepage">
    <AboutService />
    <MainQuastions />
  </main>
</template>

<script>
import MainHeader from "../components/shared/MainHeader";
import AddPlaceForm from "../components/shared/AddPlaceForm.vue";
import AboutService from "../components/shared/AboutService.vue";
import MainQuastions from "../components/shared/questions/MainQuastions.vue";

export default {
  name: "HomePage",
  components: {
    MainHeader,
    AddPlaceForm,
    AboutService,
    MainQuastions,
  },
  data() {
    return {
      isModalOpen: false,
      isSuccess: false, // <-- нове поле
    };
  },
  methods: {
    handleNewPlace() {
      this.isSuccess = true;
    },
    closeModal() {
      this.isModalOpen = false;
      this.isSuccess = false;
    },
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  padding: 1rem;
  box-sizing: border-box;
}

.modal-content {
  background: white;
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
