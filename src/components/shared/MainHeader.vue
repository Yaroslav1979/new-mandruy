<template>
    <header class="header">
        <Container>
            <router-link to="/">
                <LogoType />                
            </router-link>           
        </Container>
    </header>
</template>

<script>
import Container from '../shared/Container.vue'
import LogoType from './LogoType'
    export default {
        name: 'MainHeader',
        components: {
            Container,
            LogoType,
        },
    }
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables.scss';
.header {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    background: $secondary-color;
    padding: 16px 0;
}
</style>