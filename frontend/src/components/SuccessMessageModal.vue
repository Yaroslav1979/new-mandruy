<template>
  <div class="success-message">
    <p>Місце успішно додано!</p>
    <button @click="$emit('close')">Добре</button>
  </div>
</template>

<script>
export default {
  name: "SuccessMessageModal",
};
</script>

<style lang="scss" scoped>
.star-rating {
  position: relative;
  display: inline-flex;

  &__colored {
    display: inline-flex;
    position: absolute;
    width: 0;
    height: 100%;
    top: 0;
    left: 0;
    overflow: hidden;
  }
}

.star {
  display: inline-flex;

  width: clamp(13px, 1.15vw, 16px);
  height: clamp(12px, 1.1vw, 15px);

  margin: 0 clamp(2px, 0.25vw, 3px);

  flex-shrink: 0;

  &--colored {
    background: url("/src/assets/Star_rating-yellow.svg") center no-repeat;
    background-size: contain;
  }

  &--outlined {
    background: url("/src/assets/Star_rating-empty.svg") center no-repeat;
    background-size: contain;
  }
}

/* Смартфон */
@media (max-width: 600px) {
  .star {
    width: 14px;
    height: 13px;
    margin: 0 2px;
  }
}
</style>
