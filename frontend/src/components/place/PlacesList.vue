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
  max-height: 1200px;
  overflow-y: auto;
  margin-top: 40px;
}
</style>