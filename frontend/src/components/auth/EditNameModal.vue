<template>
  <div class="modal-overlay">
    <div class="modal">
      <Title> Зміна імені/ніку: </Title>
      <CustomInput
        v-model="newName"
        type="string"
        placeholder="Введіть нове ім'я"
        @blur="validateField('newName')"
        class="registration__input"
      />
      <p v-if="errors.newName" class="error-msg">{{ errors.newName }}</p>
      <Button 
      class="registration__btn"
      @click="submit"
      >
      Змінити ім'я
    </Button>

      <button @click="$emit('close')">Скасувати</button>

    </div>
  </div>
</template>

<script>
import { isRequired, charLimit } from '../../utils/validationRules.js';
import CustomInput from '../shared/CustomInput.vue'
import Button from '../mainButton.vue'
import Title from '../shared/MainTitle.vue'

export default {
  name: 'EditName',
  components: {    
    CustomInput, 
    Button,  
    Title 
  },
  data() {
    return {
      newName: '',
      errors: {}
    };
  },
  methods: {
    validateField(field) {
      let rules = [];

      if (field === 'newName') {
        rules = [isRequired, charLimit(20)];
      } 

      for (const rule of rules) {
        const { hasPassed, message } = rule(this[field]);
        if (!hasPassed) {
          this.errors[field] = message;
          // this.$set(this.errors, field,  message;
          return false;
        }
      }
      delete this.errors[field];
      // this.$delete(this.errors, field);
      return true;
    },
    validateForm() {
      const fields = ['newName'];
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
//----
        await this.$store.dispatch('auth/changeName', {
          name: this.newName,          
        });
        this.errors = {};
//----
        this.$emit('success');
      } catch (err) {
        this.errors.name = 'Помилка';
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