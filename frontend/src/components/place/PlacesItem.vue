<template>
  <div class="places-item" >
    <div class="places-item__inner">
      <div class="places-item__photo-container">
        <img :src="imgSrc[0]" alt="Place photo" class="place-item__photo" />
      </div>
      <div class="places-item__content">
        <h2 class="places-item__price">
          {{ title }}
        </h2>
        <br />
        <p class="places-item__description">
          {{ descr }}
        </p>
        <router-link
          :to="{ name: 'place', params: { id }, query: { name: 'Yarik' } }"
          class="places-item__link"
        ></router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PlacesItem",
  props: {
    id: { type: String, required: true },
    descr: { type: String, default: "" },
    title: { type: String, default: "" },
    imgSrc: { type: Array, default: () => [] },
    index: { type: Number, required: true }, // Індекс для визначення колонки
  },
  computed: {
    isLeftColumn() {
      return this.index % 2 === 0; // Ліва колонка (парні індекси)
    },
  },
};
</script>

<style lang="scss" scoped>
.places-item {
  width: 50%; /* Два стовпчики */
  padding: 0 15px;
  margin-bottom: 30px;

  &__inner {
    position: relative;
    display: flex;
    flex-direction: column;
  }

  &__photo-container {
    width: 100%;
    aspect-ratio: 5 / 3;
    border-radius: 16px;
    overflow: hidden;
    display: flex;
  align-items: center;
  justify-content: center;
  }  

  &__photo {
    width: 100%;
    /* height: auto; */
    object-fit: cover;
    border-radius: 16px;
  }

  &__content {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding: 20px;
    border-radius: 16px;
    opacity: 0;
    transition: opacity 0.4s;
    background: rgba(#0f1d2d, 0.7);
    color: #fff;
    text-align: left;
    line-height: 1.4;
    cursor: pointer;
    z-index: 1;

    &:hover {
      opacity: 1;
    }
  }

  &__description {
    margin-bottom: 20px;
    max-height: calc(1em * 1.4 * 3);
    overflow: hidden;
  }

  &__price {
    font-size: 20px;
    font-weight: 600;
  }

  &__link {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}
</style>
