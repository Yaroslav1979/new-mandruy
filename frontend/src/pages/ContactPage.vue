<template>
  <div class="head">
    <HeaderAllPages @openAddModal="isModalOpen = true" class="head-contact"/>   
  </div>
 
  <main>
    <div
      v-if="isModalOpen"
      class="modal-overlay"
      @click.self="isModalOpen = false"
    >
      <div class="modal-content">
        <AddPlaceForm @added="handleNewPlace" @close="isModalOpen = false" />
      </div>
    </div>
    <ContactsUs />
    
    <SocialNet />  
    <!-- <div class="contact"> -->
     
    <!-- </div>  -->
    
  </main>
</template>

<script>
import AddPlaceForm from "../components/shared/AddPlaceForm.vue";
import HeaderAllPages from "../components/shared/HeaderAllPages.vue";
import SocialNet from "../components/shared/SocialNet.vue";
import ContactsUs from "../components/shared/ContactsUs.vue";

export default {
  name: "PlacePage",  
  components: {    
    HeaderAllPages,
    ContactsUs,
    AddPlaceForm,
    SocialNet,    
  },
  data() {
    return {       
      isModalOpen: false, // ДЛЯ МОДАЛКИ
    };
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


</style>
