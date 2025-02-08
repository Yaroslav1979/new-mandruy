<template>
    <select 
        v-bind="$attrs" 
        class="custom-select" 
        :value="modelValue"
        @change="onInput"
    > 
        <option 
            v-for="item in formattedItems" 
            :key="item.value"
            :value="item.value"
        > 
            {{ item.label }} 
        </option>
    </select>
</template>

<script>
export default {
    name: "CustomSelect",
    props: {
        modelValue: String, // Додаємо підтримку v-model
        items: {
            type: Array,
            required: true
        }
    },
    computed: {
        formattedItems() {
            return this.items.map(item =>
                typeof item === "object"
                    ? item
                    : { value: item, label: item }
            );
        }
    },
    methods: {
        onInput(event) {
            this.$emit("update:modelValue", event.target.value);
        }
    }
};
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';

.custom-select {
    height: 40px;
    border: 2px solid $main-color;
    font-size: 18px;
    outline: none;
    padding: 8px 15px;
    cursor: pointer;
    display: inline-block;
    min-width: 220px;
}
</style>
