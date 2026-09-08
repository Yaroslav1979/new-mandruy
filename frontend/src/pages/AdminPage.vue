<template>
  <div class="head">
    <HeaderAllPages @openAddModal="isModalOpen = true" />
  </div>
  <main>
    <SuccessModal
      v-if="successMessageVisible"
      :message="successMessage"
      @close="closeSuccessModal"
    />
    <SectionWithHeaderSpacer>
      <PlacesList :items="newPlaces">
        <template v-slot:place="{ place }">
          <PlacesItem
            :key="place._id"
            :id="place._id"
            :descr="place.descr"
            :rating="place.rating"
            :imgSrc="place.imgUrls"
            :title="place.title"
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
    </SectionWithHeaderSpacer>
  </main>
</template>

<script>
import SectionWithHeaderSpacer from "../components/shared/SectionWithHeaderSpacer";
import Button from "../components/shared/mainButton.vue";
import HeaderAllPages from "../components/shared/HeaderAllPages.vue";
import PlacesList from "../components/place/PlacesList.vue";
import PlacesItem from "../components/place/PlacesItem.vue";
import SuccessModal from "../components/shared/SuccessModal.vue";
import axios from "axios";

export default {
  name: "AdminPage",
  components: {
    HeaderAllPages,
    SectionWithHeaderSpacer,
    Button,
    PlacesList,
    PlacesItem,
    SuccessModal,
  },
  data() {
    return {
      places: [],
      isModalOpen: false,
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
      let result = this.places;

      return result;
    },
  },
  async created() {
    try {
      const placesResponse = await axios.get(
        "http://localhost:3000/api/places",
      );
      const places = placesResponse.data;

      // Вже використовується рейтинг, що приходить з сервера
      this.places = places;
    } catch (error) {
      console.error("Помилка при завантаженні місць:", error);
    }
  },

  methods: {
    async approvePlace(placeId) {
      try {
        await axios.patch(`http://localhost:3000/api/places/${placeId}`, {
          isApproved: true,
        });

        this.places = this.places.filter((p) => p._id !== placeId);

        this.successMessage = "Місце успішно додано!";
        this.successMessageVisible = true;
      } catch (error) {
        console.error("Помилка при підтвердженні місця:", error);
      }
    },

    async deletePlace(placeId) {
      try {
        await axios.delete(`http://localhost:3000/api/places/${placeId}`);

        this.places = this.places.filter((p) => p._id !== placeId);

        this.successMessage = "Місце успішно видалено!";
        this.successMessageVisible = true;
      } catch (error) {
        console.error("Помилка при видаленні місця:", error);
      }
    },

    closeSuccessModal() {
      this.successMessageVisible = false;
      this.successMessage = "";
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/scss/variables.scss";

.head {
  background-color: #111;
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
</style>
