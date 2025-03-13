<template>
  <form class="form" @submit.prevent="handleSubmit">
    <div class="form__wrapper">
    <CustomInput
      v-model="price"
      placeholder="Введіть назву місця"
      errorMessage="Не повинно бути пустим"
      :rules="rules"
    />
    
    <SubmitButon @click="handleSubmit"  
      type="submit">
      <img src="../../assets/png/iconSearch.png" alt="" class="search-icon">
    </SubmitButon>
    </div>

    <div class="forms__select">
      <CustomSelect :items="categoryOptions" v-model="category" class="form__select" />
      <CustomSelect :items="regions" v-model="region" class="form__select" />
      <CustomSelect :items="sort" v-model="sorts" class="form__select" />
    </div>
  </form>
</template>

<script>
import CustomInput from "../shared/CustomInput.vue";
import CustomSelect from "../shared/CustomSelect.vue";
import SubmitButon from "../mainButton.vue";
import { isRequired, charLimit } from "../../utils/validationRules";

export default {
  name: 'FilterForm',
  components: {
    CustomSelect,
    CustomInput,
    SubmitButon,
  },
  data() {
    return {
      price: "",
      region: "",
      category: "",
      sorts: "",
    };
  },
  computed: {
    rules() {
      return [isRequired, charLimit(10)];
    },
    categoryOptions() {
      return [
      { value: "", label: "Категорія", selected: true },
      'Табір', 'Мандрівка', 'Питна вода', 'Пам’ятка', 
          'Музей', 'Водойма', 'Доступно для транспорту',
      ];
    },
    regions() {
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
    sort() {
      return [
      { value: "", label: "Сортувати за:", selected: true },
      'назвою', 'датою' ];
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
  flex-direction: column;

  &__select {
    margin-right: 30px;
    width: 50px;
  }
  &__submit {
    margin-left: 30px;
  }
  &__wrapper {
    display: flex;
    padding: 0 400px;
  }
}
.search-icon {
  display: flex;
  align-content: center;
  width: 69px;
  height: 69px;  
  cursor: pointer;
}
.forms__select {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 52px;
}
</style>
