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
  padding: 0;
}

.icon-ctg {
  width: 19px;
  height: 20px;
  transition: filter 0.3s;
}

.categ-title {
  display: flex;
  align-items: center;
  justify-content: center;

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

@media (max-width: 600px) {
  .categ-title {
    min-width: 0;

    padding: 7px 12px;

    gap: 6px;

    font-size: 11px;
    line-height: 16px;
  }

  .icon-ctg {
    width: 16px;
    height: 17px;
  }
}

@media (max-width: 450px) {
  .categ-title {
    padding: 6px 10px;
    font-size: 10px;
  }

  .icon-ctg {
    width: 15px;
    height: 16px;
  }
}
</style>
