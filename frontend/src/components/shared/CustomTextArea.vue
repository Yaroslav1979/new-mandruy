<template>
    <div class="form-group">
      <!-- <label :for="id">{{ label }}</label> -->
      <textarea
        :id="id"       
        :rows="rows"
        :maxlength="maxlength"
        :placeholder="placeholder"
        :required="required"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
      ></textarea>
    </div>
  </template>
  
  <script>
  export default {
    name: 'CustomTextarea',
    props: {
      id: { type: String, required: false, default: '' },
      // label: { type: String, required: false, default: ''},
      modelValue: { type: String, required: true },
      rows: { type: Number, default: 15 },
      maxlength: { type: Number, default: 1000 },
      placeholder: { type: String, default: 'Введіть текст...' },
      required: { type: Boolean, default: true },
    },
  };
  </script>
  
  <style scoped>
  .form-group {
    margin: 20px 0;
    width: 100%;
  }
  
  textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 16px;
    font-family: e-Ukraine, sans-serif;
    resize: vertical;
  }
  
  textarea:focus {
    border-color: #0056b3;
  }
  </style>