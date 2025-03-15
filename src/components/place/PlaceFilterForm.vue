<template>
  <section>
  <h2 class="section__title" id="service">ПОШУК МІСЦЬ</h2>
  <form class="form" @submit.prevent="handleSubmit">
    <div class="form__wrapper">
      <CustomInput
        v-model="price"
        placeholder="Введіть назву місця"
        errorMessage="Не повинно бути пустим"
        :rules="rules"
        class="search-input"
      />

      <SubmitButon @click="handleSubmit" type="submit" class="search-btn">
        <img src="../../assets/png/iconSearch.png" alt="" class="search-icon" />
      </SubmitButon>
    </div>

    <div class="form__select">
      <span>КАТЕГОРІЯ:</span>
      <CustomSelect
        :items="categoryOptions"
        v-model="category"
        class="form__select--item"
      />

      <span>ОБЛАСТЬ:</span>
      <CustomSelect
        :items="regions"
        v-model="region"
        class="form__select--item"
      />

      <span>СОРТУВАТИ ЗА:</span>
      <CustomSelect
        :items="sort"
        v-model="sorts"
        class="form__select--item"
      />
      <div class="form__toggle">
          <img src="../../assets/png/icon-grid-fill.png" alt="" class="form__toggle--grid">
          <img src="../../assets/png/icon-agenda.png" alt="" class="form__toggle--gallery">
                    </div>
    </div>
    
  </form>
</section>
</template>

<script>
import CustomInput from "../shared/CustomInput.vue";
import CustomSelect from "../shared/CustomSelect.vue";
import SubmitButon from "../mainButton.vue";
import { isRequired, charLimit } from "../../utils/validationRules";

export default {
  name: "FilterForm",
  components: {
    CustomSelect,
    CustomInput,
    SubmitButon,
  },
  data() {
    return {
      
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
        { value: "", label: "Обрати", isLabel: true },
        "Табір",
        "Мандрівка",
        "Питна вода",
        "Пам’ятка",
        "Музей",
        "Водойма",
        "Доступно для транспорту",
      ].map(this.formatItem);
    },
    regions() {
      return [
        { value: "", label: "Обрати", isLabel: true },
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
        "Крим автономна республіка",
      ].map(this.formatItem);
    },
    sort() {
      return [
        { value: "", label: "Спосіб виводу", isLabel: true },
        "назвою",
        "датою",
      ].map(this.formatItem);
    },
  },
  methods: {
    handleSubmit() {
      console.log("Форма відправлена", this.city, this.price);
      this.$emit("submit", {
        city: this.city,
        price: this.price,
      });
    },
    formatItem(item, index) {
      if (typeof item === "object") return item;
      return { value: item, label: item, isLabel: index === 0 };
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../assets/scss/variables";

.form {
  display: flex;
  flex-direction: column;
  gap: 20px;

  &__select {
    display: flex;
    justify-content: space-around;
  }
  &__submit {
    margin-left: 30px;
  }
  &__wrapper {
    display: flex;
    justify-content: center;
    gap: 20px;
  }
}

.section__title {
  color: #000;
  text-align: center;
  font-family: e-Ukraine, sans-serif;
  font-size: 24px;
  font-weight: 700;
  line-height: 18px;
  text-transform: uppercase;
  margin-bottom: 52px;
}
.search-input {
border: none;
}
/* .search-btn {
  border: 2px solid $main-color;
  border-radius: 8px;
  cursor: pointer;
} */

.search-icon {
  display: flex;
  align-content: center;
  width: 54px;
  height: auto;
  cursor: pointer;
}
.search-icon:hover {
  border: 2px solid grey; 
  border-radius: 8px;
}

.form__select {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  font-family: e-Ukraine, sans-serif;
}
.form__select span {
font-weight: 600;
}

.form__toggle {
  display: flex;
  cursor: pointer;  
}
.form__toggle:hover {
  opacity: 60%;
}

.form__toggle--grid, .form__toggle--gallery {
  display: flex;
  width: 32px;
  height: 32px;
  opacity: 40%;  
}
/* .form__select--item::placeholder {
color: #A9A9A9
} */
</style>



