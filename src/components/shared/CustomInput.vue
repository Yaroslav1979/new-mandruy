<template>
    <input 
        v-bind="$attrs" 
        class="custom--input"
        :value="modelValue"
        @input="updateValue"
    />
</template>

<script>
export default {
    name: "CustomInput",
    props: {
        modelValue: String // Додаємо підтримку v-model
    },
    methods: {
        updateValue(event) {
            this.$emit("update:modelValue", event.target.value);
        }
    }
};
</script>

<style lang="scss" scoped>
@import "../../assets/scss/variables";

.custom--input {
    height: 40px;
    min-width: 220px;
    width: 100%;
    border: 2px solid $main-color;
    font-size: 18px;
    outline: none;
    line-height: inherit;
    padding: 8px 15px;
    margin-right: 25%;

    &::placeholder {
        color: inherit;
    }
}
</style>

