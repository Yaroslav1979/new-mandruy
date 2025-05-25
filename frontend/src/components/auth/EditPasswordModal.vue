<template>
  <div class="modal-overlay">
    <div class="modal">
       <Title> Зміна паролю: </Title>
      <CustomInput
        v-model="password"
        type="password"
        placeholder="Введіть поточний пароль"
        @blur="validateField('password')"
        class="registration__input"
      />
      <p v-if="errors.password" class="error-msg">{{ errors.password }}</p>

      <CustomInput
        v-model="newPassword"
        type="password"
        placeholder="Введіть новий пароль"
        @blur="validateField('newPassword')"
        class="registration__input"
      />
      <p v-if="errors.newPassword" class="error-msg">{{ errors.newPassword }}</p>

 <Button 
      class="registration__btn"
      @click="submit"
      >
      Змінити пароль
    </Button>   

      <button @click="$emit('close')">Скасувати</button>
    </div>
  </div>
</template>

<script>
import { isRequired, passwordValidation } from '../../utils/validationRules.js';
import CustomInput from '../shared/CustomInput.vue'
import Button from '../mainButton.vue'
import Title from '../shared/MainTitle.vue'

export default {
  name: 'EditPassword',
  components: {    
    CustomInput, 
    Button,  
    Title 
  },
  data() {
    return {
      password: '',
      newPassword: '',
      errors: {}
    };
  },
  methods: {
    validateField(field) {
      let rules = [];

      if (field === 'password') {
        rules = [isRequired, passwordValidation];
      } else if (field === 'newPassword') {
        rules = [isRequired, passwordValidation];
      }

      for (const rule of rules) {
        const { hasPassed, message } = rule(this[field]);
        if (!hasPassed) {
          this.errors[field] = message;
          // this.$set(this.errors, field, message);
          return false;
        }
      }
      delete this.errors[field];
      // this.$delete(this.errors, field);
      return true;
    },
    validateForm() {
      const fields = ['password', 'newPassword'];
      let isValid = true;
      fields.forEach(field => {
        if (!this.validateField(field)) {
          isValid = false;
        }
      });
      return isValid;
    },
    async submit() {
      if (!this.validateForm()) return;

      try {

        //------------------------------
        await this.$store.dispatch('auth/changePassword', {
           password: this.password,
           newPassword: this.newPassword
        });
        //--------------------------

        this.$emit('success');
      } catch (err) {
        this.errors.password = 'Неправильний пароль або інша помилка';
      }
    }
  }
};
</script>

<style scoped>
.modal-overlay {
  display: block;
  position: relative;
}

.modal { 
       display: flex; 
     flex-direction: column;
      position: absolute;
    align-items: center; 
    justify-content: center; 
    background-color: #efe7c0;
    border-radius: 12px;
    gap: 20px;
    padding: 16px;
     width: 350px;    
} 

.error-msg {
  color: red;
  font-size: 14px;
  margin: 4px 0;
}

 .registration__input {
   
    margin-bottom: 20px;
    width: 100%;
  }
   .registration__btn {
    border: 2px solid grey;
    font-family: e-Ukraine, sans-serif;
    background-color: #6b76ff;
    color: white;
    font-size: 16px;
    padding: 8px;
    border-radius: 12px;
    margin-top: 15px;
    width: 100%;
  }
</style>