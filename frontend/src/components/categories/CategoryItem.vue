<template>
  <button
    class="button-category"
    @click="toggleCategory"
    type="button"
    :class="{ selected: isSelected }"
  >
    <p class="categ-title">
      <img :src="svgUrl" alt="" class="icon-ctg" />
      <em>{{ title }}</em>
    </p>
  </button>
</template>

<script>
export default {
  name: "CategoryItem",
  props: {
    id: { type: String, required: true },
    title: { type: String, default: "" },
    svgUrl: { type: String, default: "" },
    isSelected: { type: Boolean, default: false },
  },
  methods: {
    toggleCategory() {
      this.$emit("toggle", this.id);
    },
  },
};
</script>

<style scoped>
.button-category {
  background-color: white;
  border: none;
}
.icon-ctg {
  width: 19px;
  height: 20px;
  transition: filter 0.3s;
}

.categ-title {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 20px;
  border-radius: 100px;
  border: 2px solid #e7e6ed;
  min-width: 132px;
  color: #000;
  text-align: center;
  font-family: e-Ukraine, sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 18px;
  background-color: white;
  transition: background-color 0.3s, color 0.3s;
}

.selected .categ-title {
  background-color: #000;
  color: white;
}

.selected .icon-ctg {
  filter: invert(1);
}
</style>
