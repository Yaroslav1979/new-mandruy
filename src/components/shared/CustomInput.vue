<template>
    <div class="wrapper-input">
        <input 
            v-bind="$attrs" 
            
            @blur="blurHandler"
            class="custom-input" 
            :class="!isValid && 'custom-input--error'"
            :value="modelValue"
            @input="updateValue"
        />
        <span v-if="!isValid" class="custom-input__error">{{ error }}</span>
    </div>
</template>

<script>
export default {
    name: "CustomInput",
    data() {
        return {
            isValid: true,
            error: '',
            isFirstInput: true,
        };
    },
    inject: {
        form: {
            default: null
        }
    },
    inheritAttrs: false,
    props: {
        modelValue: String, // Додаємо підтримку v-model
        errorMessage: {
            type: String,
            default: '',
        },
        rules: {
            type: Array,
            default: () => [],
        }
    },
    watch: {
    modelValue(value) {  
        if (!value && this.isFirstInput) return; // Не запускаємо валідацію при першому вводі або очищенні
        if (!value) {
            this.isValid = true;
            this.error = '';
            return;
        }
        this.validate(value);
    }
},
    mounted() {
        if  (!this.form) return

        this.form.registerInput(this)
    },
    beforeUnmount() {
        if  (!this.form) return

        this.form.unRegisterInput(this)
    },
    methods: {
        updateValue(event) {
            this.$emit("update:modelValue", event.target.value);
        },
        validate(value) {
            this.isValid = true;
            this.error = '';
            for (const rule of this.rules) {
                const result = rule(value);
                
                if (typeof result === 'object') {
                    if (!result.hasPassed) {
                        this.isValid = false;
                        this.error = result.message || this.errorMessage;
                        return;
                    }
                } else if (!result) {
                    this.isValid = false;
                    this.error = this.errorMessage;
                    return;
                }
            }           
        },
        blurHandler() {
            if (this.isFirstInput) {
                this.validate();
            }
             this.isFirstInput = false
        },
        reset() {
    this.isFirstInput = true;
    this.isValid = true;
    this.error = '';
    
    // Очищаємо модельне значення
    this.$emit('update:modelValue', '');
}

    }
};
</script>

<style lang="scss" scoped>
@import "../../assets/scss/variables";

.wrapper-input {
    position: relative;
    display: inline-flex;
    padding: 12px 0;
}

.custom-input {
    height: 40px;
    /* min-width: 500px; */
    width: 100%;
    border: 2px solid $main-color;
    font-size: 18px;
    outline: none;
    line-height: inherit;
    padding: 8px 15px;
    /* margin-right: 25%; */

    &::placeholder {
        color: inherit;
    }

    &--error {
        border-color: red;
    }

    &__error {
        position: absolute;
        top: 100%;
        right: 0;
        width: 100%;
        font-size: 12px;
        color: red;
        line-height: 1.3;
    }
}
</style>
