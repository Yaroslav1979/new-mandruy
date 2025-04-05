<template>
    <div class="star-rating">
        <span v-for="index in starLimit" :key="index" class="star star--outlined"></span>
        <div class="star-rating__colored" :style="`width: ${ratingWidth};`">
            <span v-for="index in starLimit" :key="index" class="star star--colored"></span>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'StarRating',
        props: {
            rating: {
                type: Number,
                default: 0
            },
            starLimit: {
                type: Number,
                default: 5,
            }
        },
        computed: {
            ratingWidth() {
                return this.rating / this.starLimit * 100 + '%'
            }
        }
    }
</script>

<style lang="scss" scoped>

.star-rating {
    position: relative;
    display: inline-flex;
    &__colored {
        display: inline-flex;
        position: absolute;
        width: 0px;
        height: 100%;
        top: 0;
        left: 0;
        overflow: hidden;
    }
}

.star {
  display: inline-flex;
  width: 16px;
  height: 15px;
  margin: 0 3px;
  flex-shrink: 0; 

  &--colored {
    background: url('/src/assets/Star_rating-yellow.svg') center no-repeat;
   
    }
    &--outlined {
    background: url('/src/assets/Star_rating-empty.svg') center no-repeat;
   
    }
}


</style>