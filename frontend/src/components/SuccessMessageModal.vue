<template>
    <div class="success-message">
      <p>Місце успішно додано!</p>
      <button @click="$emit('close')">Добре</button>
    </div>
  </template>
  
  <script>
  export default {
    name: "SuccessMessageModal",
  };
  </script>
  
  <style scoped>
  .success-message {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40px;
    font-size: 18px;
    font-weight: bold;
    background-color: #e7ffe7;
    border: 1px solid #4caf50;
    border-radius: 8px;
    text-align: center;
  }
  
  .success-message button {
    margin-top: 20px;
    padding: 10px 20px;
    background: #4caf50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  </style>