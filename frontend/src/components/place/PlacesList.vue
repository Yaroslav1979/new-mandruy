<template>
  <Container>
    <slot name="title"></slot>
    <div class="places-list">
      <template v-for="place in items">
        <slot name="place" v-bind:place="place"></slot>
      </template>
    </div>
  </Container>
</template>

<script>
import Container from "../shared/Container.vue";

export default {
  name: "PlacesList",
  components: {
    Container,
  },
  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

<style lang="scss" scoped>
.places-list {
  display: flex;
  flex-wrap: wrap;

  width: 100%;

  max-height: 1200px;

  overflow-y: auto;

  margin-top: clamp(20px, 3vw, 40px);

  box-sizing: border-box;
}

@media (max-width: 600px) {
  .places-list {
    max-height: none;

    overflow-y: visible;

    margin-top: 20px;
  }
}
</style>
