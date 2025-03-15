<template>
    <Container>
        <slot name="title"></slot>
        <div class="places-list">
            <template v-for="apartment in items">
                <slot name="apartment" v-bind:apartment="apartment"></slot>
            </template>
        </div>
    </Container>
</template>

<script>    
    import Container from '../shared/Container.vue'

    export default {
        name: 'PlacesList',
        components: {
           
            Container
        },
        props: {
            items: {
                type: Array,
                default: () => []
            }
        }
    }
</script>

<style lang="scss" scoped>
.places-list {
  display: flex;
  flex-wrap: wrap;
  margin-left: -15px;
  margin-right: -15px;

  /* &__item {
    margin-bottom: 30px;
  } */
}
</style>