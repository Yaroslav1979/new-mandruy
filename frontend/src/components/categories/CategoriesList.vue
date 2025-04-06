<template>
  <slot name="title"></slot>
  <div class="categories">
    <div class="categories__block">
      <template v-for="category in items" :key="category.id">
        <CategoryItem
          :id="category.id"
          :title="category.title"
          :svgUrl="category.svgUrl"
          :isSelected="selectedCategories.includes(category.id)"
          @toggle="toggleCategory"
        />
      </template>
    </div>
  </div>
</template>

<script>
import CategoryItem from './CategoryItem.vue';

export default {
  name: 'CategoryList',
  components: {
    CategoryItem,
  },
  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      selectedCategories: [], // Масив для збереження вибраних категорій
    };
  },
  methods: {
    toggleCategory(categoryId) {
      // Додавання або видалення категорії зі списку вибраних
      const index = this.selectedCategories.indexOf(categoryId);
      if (index > -1) {
        this.selectedCategories.splice(index, 1);
      } else {
        this.selectedCategories.push(categoryId);
      }
      this.$emit('update:selectedCategories', this.selectedCategories); // Відправка вибраних категорій на батьківський компонент
    },
  },
};
</script>

<style lang="scss" scoped>
.categories {
  display: flex;
  position: relative;
  flex-direction: column;
  align-items: center;
  margin: 20px 0;
}

.categories__block {
  display: flex;
  justify-content: left;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  padding: 50px 0;
}
</style>