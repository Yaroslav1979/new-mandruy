<template>
  <MainHeader @openAddModal="isModalOpen = true"/>

  <div v-if="isModalOpen" class="modal-overlay" @click.self="isModalOpen = false">
  <div class="modal-content">
    <AddPlaceForm @added="handleNewPlace" @close="isModalOpen = false" />
  </div>
</div>

  <main class="homepage">
    <!-- <SectionWithHeaderSpacer> -->
      <AboutService />
    <!-- </SectionWithHeaderSpacer>    -->

    <MainQuastions />

    
  </main>
</template>

<script>
import MainHeader from "../components/shared/MainHeader";
import AddPlaceForm from "../components/shared/AddPlaceForm.vue";
// import SectionWithHeaderSpacer from "../components/shared/SectionWithHeaderSpacer";
import AboutService from "../components/shared/AboutService.vue";
import MainQuastions from "../components/shared/questions/MainQuastions.vue";


export default {
  name: "App",
  components: {
    AddPlaceForm,
    AboutService,
    // SectionWithHeaderSpacer,     
    MainHeader,       
    MainQuastions,  
  },
  data() {
  return {
    isModalOpen: false,
  };
},
//  method {
//   handleNewPlace(newPlace) {
//   this.places.unshift(newPlace); // або this.places.push(newPlace), якщо хочеш додати в кінець списку
// }
//  }
};
</script>

<style lang="scss" scoped>

.homepage {
  width: 100%;
  margin: 0 auto;
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
</style>


