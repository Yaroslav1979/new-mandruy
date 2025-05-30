<template>
  <div class="head">
    <HeaderAllPages @openAddModal="isModalOpen = true" />
  </div>
  <main class="place-page">
   
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
          <Button @click="approvePlace(place._id)">
        Опублікувати 
      </Button>
      <Button @click="deletePlace(place._id)">
        Видалити 
      </Button>
        </template>
      </PlacesList>
      
    </SectionWithHeaderSpacer>
  </main>
</template>

<script>
import SectionWithHeaderSpacer from "../components/shared/SectionWithHeaderSpacer";
import Button from "../components/mainButton.vue";
import HeaderAllPages from "../components/shared/HeaderAllPages.vue";
import PlacesList from "../components/place/PlacesList.vue";
import PlacesItem from "../components/place/PlacesItem.vue";
import axios from "axios";

export default {
  name: "AdminPage",
  components: {
    HeaderAllPages,
    SectionWithHeaderSpacer,
    Button,
    PlacesList,
    PlacesItem,    
  },
  data() {
    return {
      places: [],
      isModalOpen: false,
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
      const placesResponse = await axios.get("http://localhost:3000/api/places");
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

      // Видаляємо з поточного списку
      this.places = this.places.filter(p => p._id !== placeId);
    } catch (error) {
      console.error("Помилка при підтвердженні місця:", error);
    }
  },

  async deletePlace(placeId) {
    try {
      await axios.delete(`http://localhost:3000/api/places/${placeId}`);
      this.places = this.places.filter(p => p._id !== placeId);
    } catch (error) {
      console.error("Помилка при видаленні місця:", error);
    }
  },
    handleNewPlace(newPlace) {
      this.places.unshift(newPlace); // або this.places.push(newPlace), якщо хочеш додати в кінець списку
    },
  },
};
</script>



<style lang="scss" scoped>
.head {
  background-color: #111;
}
.place-page {
  &__content {
    display: flex;
    align-items: flex-start;
  }

  &__additional-info {
    margin-left: 30px;
    max-width: 350px;
    flex-grow: 0;
    flex-shrink: 1;
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
}
</style>
