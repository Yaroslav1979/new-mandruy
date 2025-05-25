<template>
  <div class="modal-overlay">
    <Container class="profile">
    <div class="profile-modal">        

        <Title class="profile-modal__title">
            <div
            class="header-top__avatar-circle"
            @click="showProfileModal = true"
          >
            {{ userInitial }}
          </div>
          <div>
            {{ user.name }} 

           <p class="profile-modal__title--sub"> {{ user.email }}</p> 
          </div>
            
        </Title>
      
        
      <div class="profile-item">
        <span>Змінити ім'я/нікнейм</span>
        <EditIcon @click="showEditNameModal = true" />
      </div>

      <div class="profile-item">
        <span>Змінити пароль</span>
        <EditIcon @click="showEditPasswordModal = true" />
      </div>

      <button class="logout-btn" @click="logoutAndClose">Вихід з акаунту</button>
      <button class="close-btn" @click="$emit('close')">×</button>

      <EditNameModal 
        v-if="showEditNameModal"
        @close="showEditNameModal = false"
        @success="showSuccess('Ваше ім`я/нік змінено успішно')"
      />
      <EditPasswordModal 
        v-if="showEditPasswordModal"
        @close="showEditPasswordModal = false"
        @success="showSuccess('Пароль змінено успішно')"
      />
      <SuccessModal 
        v-if="showSuccessModal" 
        :message="successMessage" 
        @close="showSuccessModal = false" 
      />
    </div>
    </Container>
  </div>
</template>

<script>
import Title from "../shared/MainTitle.vue";
import Container from './AuthContainer.vue';
import EditIcon from './EditIcon.vue';
import EditNameModal from './EditNameModal.vue';
import EditPasswordModal from './EditPasswordModal.vue';
import SuccessModal from '../SuccessModal.vue';

export default {
  name: 'ProfileModal',
  props: ['user'],
  components: { 
    EditIcon, 
    EditNameModal, 
    EditPasswordModal, 
    SuccessModal,
    Title,
    Container
},
  data() {
    return {
      showEditNameModal: false,
      showEditPasswordModal: false,
      showSuccessModal: false,
      successMessage: '',
    };
  },
   computed:{
userInitial() {
      return this.user?.name?.[0]?.toUpperCase() || "";
    },
  },
  methods: {
    logoutAndClose() {
      this.$emit('logout');
      this.$emit('close');
    },
    showSuccess(message) {
      this.successMessage = message;
      this.showEditNameModal = false;
      this.showEditPasswordModal = false;
      this.showSuccessModal = true;
    },
  }
};
</script>

<style scoped>
.modal-overlay { 
    position: fixed;
    top: 0; 
    right: 0; 
    width: 0; 
    /* height: 50%; */
    background: rgba(0,0,0);
    display: flex; 
    align-items: top; 
    justify-content: right; 
} 
.profile {
    display: flex;
    width: 350px;
    border-radius: 20px;    
}
.profile-modal {
  position: relative;
  padding: 20px;
  background-color: #fff;
 
  /* border-radius: 20px; */
}

.header-top__avatar-circle {
  width: 50px;
  height: 50px;
  background: #007bff;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-modal__title {
    display: flex;
    /* flex-direction: column; */
    justify-content: space-around;
    align-items: center;
    gap: 12px;
    margin: 20px 0;
}
.profile-modal__title--sub {
    font-size: 12px;
    margin-top: 8px;
    font-weight: 400;
}
.profile-item {
  display: flex;  
  justify-content: space-between;
  margin: 16px 0;
  width: 250px;
  border-bottom: 1px solid #111;
   /* margin-bottom: 8px; */
}
.logout-btn {
    display: flex;   
    justify-content: center;
    font-family: e-Ukraine, sans-serif;    
    background: transparent;
    color: #111;
    border-radius: 8px;
    font-size: 14px;
    padding: 8px;
    margin-top: 20px;
    cursor: pointer;
}

.logout-btn:hover {
    opacity: 0.7;
}
.close-btn {
  position: absolute;
  top: 10px; 
  right: 10px;
  background: transparent;
  border: none;
  font-size: 28px;
  cursor: pointer;  
}
.close-btn:hover {
    font-weight: bold;
}
</style>
