<template>
  <div class="head">
    <HeaderAllPages
      @openAddModal="openAddModal"
      @edit-place="handleEditPlace"
    />
  </div>

  <main>
    <div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <template v-if="!isSuccess">
          <AddPlaceForm
            :place-to-edit="editingPlace"
            @added="handleNewPlace"
            @updated="handlePlaceUpdated"
            @close="closeModal"
          />
        </template>

        <template v-else>
          <div class="success-message">
            <p>
              {{
                editingPlace
                  ? "Зміни успішно збережено!"
                  : "Місце успішно додано!"
              }}
            </p>
            <button @click="closeModal">Добре</button>
          </div>
        </template>
      </div>
    </div>

    <ContactsUs />

    <SocialNet />
  </main>
</template>

<script>
import AddPlaceForm from "../components/shared/AddPlaceForm.vue";
import HeaderAllPages from "../components/shared/HeaderAllPages.vue";
import SocialNet from "../components/shared/SocialNet.vue";
import ContactsUs from "../components/shared/ContactsUs.vue";

export default {
  name: "ContactPage",

  components: {
    HeaderAllPages,
    ContactsUs,
    AddPlaceForm,
    SocialNet,
  },

  data() {
    return {
      isModalOpen: false,
      isSuccess: false,
      editingPlace: null,
    };
  },

  methods: {
    // Відкриття форми додавання нового місця
    openAddModal() {
      this.editingPlace = null;
      this.isSuccess = false;
      this.isModalOpen = true;
    },

    // Відкриття форми редагування вибраного місця
    handleEditPlace(place) {
      this.editingPlace = place;
      this.isSuccess = false;
      this.isModalOpen = true;
    },

    // Успішне додавання нового місця
    handleNewPlace() {
      this.isSuccess = true;
    },

    // Успішне оновлення або відправлення змін на модерацію
    handlePlaceUpdated() {
      this.isSuccess = true;
    },

    // Закриття модального вікна та очищення стану
    closeModal() {
      this.isModalOpen = false;
      this.isSuccess = false;
      this.editingPlace = null;
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
