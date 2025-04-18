<template>
  <div class="head">
  <HeaderAllPages />
  </div>
  <main class="place-page">
    <SectionWithHeaderSpacer>
      <Container>
        <div v-if="place" class="place-page__content">
          <PlaceMainInfo :place="place" />
          <div class="place-page__additional-info">
            <Reviews :reviews="reviewsList" />
          </div>
        </div>
        <div v-else class="place-page__loading">
          <p>Завантаження місця...</p>
        </div>
      </Container>
    </SectionWithHeaderSpacer>
  </main>
</template>

<script>
import { getPlaceById } from "../services/places.service.js";
import Container from "../components/shared/Container.vue";
import SectionWithHeaderSpacer from "../components/shared/SectionWithHeaderSpacer";
import PlaceMainInfo from "../components/place/PlaceMainInfo.vue";
import HeaderAllPages from "../components/shared/HeaderAllPages.vue";
import Reviews from "../components/reviews";
import reviewsList from "../components/reviews/reviews.json";

export default {
  name: "PlacePage",
  components: {
    Container,
    PlaceMainInfo,
    HeaderAllPages,
    Reviews,
    SectionWithHeaderSpacer,
  },
  data() {
    return {
      place: null,
    };
  },
  computed: {
    reviewsList() {
      return reviewsList;
    },
    // apartment() {
    //   return apartments.find(
    //     (apartment) => apartment.id === this.$route.params.id
    //   );
    // },
  },
  async created() {
    try {
      console.log("🧭 Route params:", this.$route.params);
      const { id } = this.$route.params;
      console.log("ID місця з маршруту:", id);
      const { data } = await getPlaceById(id);
      console.log("Дані з бекенду:", data);
      this.place = data;
    } catch (error) {
      console.error(error);
    }
  },
  mounted() {
    console.log(this.place);
  },
  // {
  //     console.log(this.$route.params.id)
  //     console.log(this.$route.query.name)
  // },
};
</script>

<style lang="scss" scoped>

.head {
  background-color: black;
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
}
</style>
