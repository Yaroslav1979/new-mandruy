<template>
    <div class="apartments-item">
        <div class="apartments-item__inner">
            <img :src="imgSrc" alt="" class="apartments-item__photo">
            <div class="apartments-item__content">
                <h2 class="apartments-item__price"> 
                    {{ title }}
                </h2>
                <br>
                <p class="apartments-item__description"> 
                    {{ descr }}
                </p>                
               
                <router-link 
                  :to="{name:'apartment', params: { id}, query: {name: 'Yarik'} }" 
                  class="apartments-item__link"
                ></router-link>
            </div>
        </div>
    </div>
</template>

<script>

// import StarRating from "../StarRating"

    export default {
        name: 'PlacesItem',
        components: {
            // StarRating,
        },
        props: {
            id: {
              type: String,
              required: true
            },
            descr: {
                type: String,
                default: ''
            },
            rating: {
                type: Number,
                default: 0
            },
            title: {
                type: String,
                default: ''
            },
            imgSrc: {
                type: String,
                default: ''
            }
        }
    }
</script>

<style lang="scss" scoped>
.apartments-item {
  position: relative;
  width: 33.33%;
  padding: 0 15px;
  margin-bottom: 30px;

  &__inner {
    position: relative;
  }

  &__content {
    position: relative;
    padding: 20px;
    opacity: 0;
    transition: opacity 0.4s;
    background: rgba(#0f1d2d, 0.7);
    min-height: 200px;
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

  &__rating {
    margin-bottom: 20px;
  }

  &__price {
    font-size: 20px;
    font-weight: 600;
  }

  &__photo {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
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