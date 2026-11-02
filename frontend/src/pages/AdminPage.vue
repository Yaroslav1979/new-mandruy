<template>
  <div class="head">
    <HeaderAllPages
      @openAddModal="openAddModal"
      @edit-place="handleEditPlace"
    />
  </div>

  <main>
    <!-- Модальне вікно додавання та редагування місця -->
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

    <!-- Повідомлення про успішну дію адміністратора -->
    <SuccessModal
      v-if="successMessageVisible"
      :message="successMessage"
      @close="closeSuccessModal"
    />

    <SectionWithHeaderSpacer>
      <!-- Список нових місць, які очікують модерації -->
      <section class="admin-section">
        <h2>Нові місця</h2>

        <PlacesList :items="newPlaces">
          <template v-slot:place="{ place }">
            <PlacesItem
              :key="place._id"
              :id="place._id"
              :descr="place.descr"
              :rating="place.rating"
              :imgSrc="place.imgUrls"
              :title="place.title"
              :preview-new="true"
            />

            <div class="add-place__btns">
              <Button class="add-place__btn" @click="approvePlace(place._id)">
                Опублікувати
              </Button>

              <Button
                class="add-place__btn delete"
                @click="deletePlace(place._id)"
              >
                Видалити
              </Button>
            </div>
          </template>
        </PlacesList>

        <p v-if="places.length === 0">
          Немає нових місць, які очікують модерації.
        </p>
      </section>

      <!-- Список змін опублікованих місць -->
      <section class="admin-section">
        <h2>Зміни опублікованих місць</h2>

        <PlacesList :items="pendingChanges">
          <template v-slot:place="{ place }">
            <PlacesItem
              :key="place._id"
              :id="place._id"
              :descr="place.pendingChanges.descr"
              :rating="place.rating"
              :imgSrc="place.pendingChanges.imgUrls"
              :title="place.pendingChanges.title"
              :preview-changes="true"
            />

            <div class="add-place__btns">
              <Button class="add-place__btn" @click="approveChanges(place._id)">
                Опублікувати зміни
              </Button>

              <Button
                class="add-place__btn delete"
                @click="rejectChanges(place._id)"
              >
                Відхилити зміни
              </Button>
            </div>
          </template>
        </PlacesList>

        <p v-if="pendingChanges.length === 0">
          Немає змін, які очікують модерації.
        </p>
      </section>
    </SectionWithHeaderSpacer>
  </main>
</template>

<script>
import axiosInstance from "../utils/axios.js";
import SectionWithHeaderSpacer from "../components/shared/SectionWithHeaderSpacer";
import Button from "../components/shared/mainButton.vue";
import HeaderAllPages from "../components/shared/HeaderAllPages.vue";
import PlacesList from "../components/place/PlacesList.vue";
import PlacesItem from "../components/place/PlacesItem.vue";
import SuccessModal from "../components/shared/SuccessModal.vue";
import AddPlaceForm from "../components/shared/AddPlaceForm.vue";
// import axios from "axios";

export default {
  name: "AdminPage",

  components: {
    HeaderAllPages,
    SectionWithHeaderSpacer,
    Button,
    PlacesList,
    PlacesItem,
    SuccessModal,
    AddPlaceForm,
  },

  data() {
    return {
      places: [],
      pendingChanges: [],

      // Модальне вікно додавання та редагування
      isModalOpen: false,
      isSuccess: false,
      editingPlace: null,

      // Повідомлення про успішні дії адміністратора
      successMessageVisible: false,
      successMessage: "",

      filters: {
        title: "",
        region: "",
        categoryIds: [],
        sortBy: "",
      },
    };
  },

  computed: {
    newPlaces() {
      return this.places;
    },
  },

  async created() {
    await Promise.all([this.fetchPlaces(), this.fetchPendingChanges()]);
  },

  methods: {
    // Завантаження нових місць, які очікують модерації
    async fetchPlaces() {
      try {
        const response = await axiosInstance.get("/places");
        this.places = response.data;
      } catch (error) {
        console.error(
          "Помилка при завантаженні місць:",
          error.response?.data || error.message,
        );
      }
    },

    // Завантаження змін уже опублікованих місць
    async fetchPendingChanges() {
      try {
        const response = await axiosInstance.get("/places/pending-changes");
        this.pendingChanges = response.data;
      } catch (error) {
        console.error(
          "Помилка завантаження змін місць:",
          error.response?.data || error.message,
        );
      }
    },

    // Підтвердження публікації нового місця
    async approvePlace(placeId) {
      try {
        await axiosInstance.patch(`/places/${placeId}`, {
          isApproved: true,
        });

        await this.fetchPlaces();

        this.successMessage = "Місце успішно опубліковано!";
        this.successMessageVisible = true;
      } catch (error) {
        console.error("Помилка при підтвердженні місця:", error);
        alert("Не вдалося опублікувати місце.");
      }
    },

    // Затвердження змін опублікованого місця
    async approveChanges(placeId) {
      try {
        await axiosInstance.patch(`/places/${placeId}/approve-changes`);

        await Promise.all([this.fetchPendingChanges(), this.fetchPlaces()]);

        this.successMessage = "Зміни успішно опубліковано!";
        this.successMessageVisible = true;
      } catch (error) {
        console.error("Помилка затвердження змін:", error);
        alert("Не вдалося затвердити зміни.");
      }
    },

    // Відхилення запропонованих змін
    async rejectChanges(placeId) {
      if (!confirm("Відхилити запропоновані зміни?")) {
        return;
      }

      try {
        await axiosInstance.delete(`/places/${placeId}/reject-changes`);

        await this.fetchPendingChanges();

        this.successMessage = "Запропоновані зміни відхилено.";
        this.successMessageVisible = true;
      } catch (error) {
        console.error("Помилка відхилення змін:", error);
        alert("Не вдалося відхилити зміни.");
      }
    },

    // Видалення нового місця
    async deletePlace(placeId) {
      try {
        await axiosInstance.delete(`/places/${placeId}`);

        await this.fetchPlaces();

        this.successMessage = "Місце успішно видалено!";
        this.successMessageVisible = true;
      } catch (error) {
        console.error("Помилка при видаленні місця:", error);
        alert("Не вдалося видалити місце.");
      }
    },

    // Закриття повідомлення про успішну дію
    closeSuccessModal() {
      this.successMessageVisible = false;
      this.successMessage = "";
    },

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
    async handleNewPlace() {
      await this.fetchPlaces();
      this.isSuccess = true;
    },

    // Успішне редагування або відправлення змін на модерацію
    async handlePlaceUpdated() {
      await Promise.all([this.fetchPlaces(), this.fetchPendingChanges()]);

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
@import "../assets/scss/variables.scss";

.head {
  background-color: #111;
}

.admin-section {
  margin-bottom: 40px;
}

.add-place__btns {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 40px;
  margin-left: 200px;
}

.add-place__btn {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  width: 186px;
  height: 47px;
  border-radius: 5px;
  background: #111;
  color: #fff;
  text-align: center;
  font-family: e-Ukraine, sans-serif;
  font-size: 16px;
  font-weight: 500;
  line-height: 140%;

  &:hover {
    opacity: 80%;
  }
}

.delete {
  background-color: #f42121;
}

.pending-change {
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.pending-change__images {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 15px 0;
}

.pending-change__images img {
  width: 120px;
  height: 90px;
  object-fit: cover;
  border-radius: 5px;
}

.pending-change__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
</style>
