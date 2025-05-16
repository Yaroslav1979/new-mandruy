<template>
    <div class="modal-overlay">
      <div class="modal">
        <p>Реєстрація пройшла успішно!</p>
        <button @click="$emit('close')">Добре</button>
      </div>
    </div>
  </template>
  <script>
  
  export default {
    name: "SuccessModal",
  };
  </script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.5);
    display: flex; align-items: center; justify-content: center;
  }
  .modal {
    background: white;
    padding: 20px;
    border-radius: 8px;
  }
  </style>