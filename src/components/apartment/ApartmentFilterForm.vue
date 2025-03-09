<template>
  <form class="form" @submit.prevent="handleSubmit">
    <CustomSelect :items="cities" v-model="city" class="form__select" />
    <CustomInput
      v-model="price"
      placeholder="Ціна, від"
      errorMessage="Не повинно бути пустим"
      :rules="rules"
    />
    <SubmitButon @click="handleSubmit" class="form__submit" type="submit">
      Підбірка житла
    </SubmitButon>
  </form>
</template>

<script>
import CustomInput from "../shared/CustomInput.vue";
import CustomSelect from "../shared/CustomSelect.vue";
import SubmitButon from "../mainButton.vue";
import { isRequired, charLimit } from "../../utils/validationRules";

export default {
  components: {
    CustomSelect,
    CustomInput,
    SubmitButon,
  },
  data() {
    return {
      price: "",
      city: "",
    };
  },
  computed: {
    rules() {
      return [isRequired, charLimit(10)];
    },
    cities() {
      return [
        { value: "", label: "Область", selected: true },
        "Вінницька область",
        "Волинська область",
        "Дніпропетровська область",
        "Донецька область",
        "Житомирська область",
        "Закарпатська область",
        "Запорізька область",
        "Івано-Франківська область",
        "Київська область",
        "Кіровоградська область",
        "Луганська область",
        "Львівська область",
        "Миколаївська область",
        "Одеська область",
        "Полтавська область",
        "Рівненська область",
        "Сумська область",
        "Тернопільська область",
        "Харківська область",
        "Херсонська область",
        "Хмельницька область",
        "Черкаська область",
        "Чернівецька область",
        "Чернігівська область",
        "Крим автономна республіка"
      ];
    },
  },
  methods: {
    handleSubmit() {
      console.log("Форма відправлена", this.city, this.price); // Перевіримо, чи спрацьовує
      // event.preventDefault(); // Запобігаємо відправці форми браузером
      this.$emit("submit", {
        city: this.city,
        price: this.price,
      });
    },
  },
};
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
