<template>   
      <slot name="title"></slot>
      <div class="add-place">        
        <div class='add-place__block'>
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

 
.add-place {
  display: flex;
  position: relative;
  flex-direction: column;
   align-items: center;
   margin: 64px 0;
  
&__title {
  color: #000;
  text-align: center;
  font-family: e-Ukraine, sans-serif;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 18px; 
  text-transform: uppercase;
}
&__block {
  display: flex;
    flex-wrap: wrap; /* Додає перенесення на новий рядок */
    gap: 12px; /* Відступи між елементами */
    justify-content: center;
    align-items: center;
    padding: 50px 0;

}
}
</style>