<template>
    <form class="form" @submit.prevent="handleSubmit">
        <CustomSelect 
            :items="cities" 
            v-model="city"
            class="form__select"
        />
        <CustomInput
            v-model="price" 
            placeholder="Ціна, від"
        />
        <SubmitButon
            class="form__submit"
            type="submit"
        > 
            Підбірка житла 
        </SubmitButon>
    </form>
</template>

<script>
import CustomInput from '../shared/CustomInput.vue';
import CustomSelect from '../shared/CustomSelect.vue';
import SubmitButon from '../mainButton.vue';

export default {
    components: {
        CustomSelect,
        CustomInput,
        SubmitButon,           
    },
    data() {
        return {
            price: '',
            city: ''
        }
    },
    computed: {
        cities() {
            return [
                { value: '', label: 'Місто', selected: true },
                "Kyiv", "Rivne", "Odesa", "Poltava", "Lviv",
                "Lutsk", "Sarny", "Berezne", "Dubno", "Ratne", "Kovel"
            ];
        }
    },
    methods: {
    handleSubmit() {
        // event.preventDefault(); // Запобігаємо відправці форми браузером
        this.$emit('submit', {
            city: this.city,
            price: this.price,
        });
    }
}

}
</script>


<style lang="scss" scoped>

.form {
    display: flex;

    &__select {
        margin-right: 30px;
        width: 50px;
    }
    &__submit {
        margin-left: 30px;
    }
}
</style>