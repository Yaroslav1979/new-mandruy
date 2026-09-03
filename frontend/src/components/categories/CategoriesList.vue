<template>
  <div class="categories">
    <div class="categories__block">
      <CategoryItem
        v-for="category in items"
        :key="category.id"
        :id="category.id"
        :title="category.title"
        :svgUrl="category.svgUrl"
        :isSelected="modelValue.includes(category.id)"
        @toggle="toggleCategory"
      />
    </div>
  </div>
</template>

<script>
import CategoryItem from "./CategoryItem.vue";

export default {
  name: "CategoriesList",
  components: {
    CategoryItem,
  },
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    modelValue: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    toggleCategory(categoryId) {
      const updated = [...this.modelValue];
      const index = updated.indexOf(categoryId);
      if (index > -1) {
        updated.splice(index, 1);
      } else {
        updated.push(categoryId);
      }
      this.$emit("update:modelValue", updated); // для v-model
    },
  },
};
</script>

<style lang="scss" scoped>
.categories {
  display: flex;
  position: relative;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
}

.categories__block {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  width: 100%;
}

@media (max-width: 600px) {
  .categories__block {
    gap: 8px;
  }
}
</style>
