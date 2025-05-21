<template>
    <div class="modal-overlay">
      <div class="modal">
        <p class="success-txt">{{ message }}</p>
        <button class="success-btn" @click="$emit('close')">Добре</button>
      </div>
    </div>
  </template>
  <script>
  
  export default {
    name: "SuccessModal",
     props: {
    message: {
      type: String,
      default: 'Успішно!',
    },
  },
  };
  </script>
  
  <style lang="scss" scoped>
  @import "../assets/scss/variables";
  .modal-overlay {
    
    position: fixed;
    top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.5);
    display: flex; align-items: center; justify-content: center;
  }
  .modal {
     font-family: e-Ukraine, sans-serif;
    display: flex;
    flex-direction: column;
    justify-content: center;
    background: white;
    padding: 20px;
    border-radius: 8px;
    
  }

  .success-txt {
    font-size: 16px;
    color: #111;
  }

  .success-btn {
    border: 2px solid $main-color;   
    background-color: #6b76ff;
    color: white;
    border-radius: 8px;
    padding: 8px;
    margin-top: 12px;
    font-size: 16px;

    &:hover {
      opacity: 0.8;
    }
}
  </style>