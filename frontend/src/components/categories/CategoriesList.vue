<template>   
      <slot name="title"></slot>
      <div class="categories">        
        <div class='categories__block'>
        <template v-for="category in items" :key="category.id">
          <slot name="categories" v-bind:categories="category"></slot>
        </template>
      </div>
    </div>
  </template>
  
  <script>
//   import Container from '../shared/Container.vue';
  
  export default {
    name: 'CategoryList',
    // components: { Container },
    props: {
      items: {
        type: Array,
        default: () => [],
      },
    },
  };
  </script>  

<style lang="scss" scoped>
@import "../../assets/scss/variables.scss";
 
.categories {
  display: flex;
  position: relative;
  flex-direction: column;
   align-items: center;
   margin: 64px 0;

  &__block {
    display: flex;
    justify-content: left;
    flex-wrap: wrap; /* Додає перенесення на новий рядок */
    gap: 12px;   
    align-items: center;
    padding: 50px 0;
  }
}
</style>