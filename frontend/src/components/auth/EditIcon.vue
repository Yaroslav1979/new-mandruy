
<template>
  <img :src="pencilIcon" alt="Редагувати" class='edit' />
</template>

<script setup>
import pencilIcon from '../../assets/svg/pencilEdit.svg';
</script>

<style scoped>
.edit{
  width: 20px;
  height: auto;
  cursor: pointer;
}
.edit:hover {
  opacity: 0.7;
}
</style>