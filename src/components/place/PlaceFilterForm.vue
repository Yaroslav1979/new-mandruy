<template>
  <section id="search" class="form-container">
    <h2 class="section__title" id="service">ПОШУК МІСЦЬ</h2>

    <form class="form" @submit.prevent="handleSubmit">

      <div class="form__wrapper">

        <CustomInput
          v-model="title"
          placeholder="Введіть назву місця"
          errorMessage="Не повинно бути пустим"
          class="search-input"
        />
        <SubmitButon 
        @click="handleSubmit" 
        type="submit" 
        class="search-btn"
        >
          <img src="../../assets/png/iconSearch.png" alt="" class="search-icon" />
        </SubmitButon>

      </div>

      <div class="form__select">
      <span>КАТЕГОРІЯ:</span>
      <CustomSelect
        :items="categories"
        v-model="categoryIds"
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
        :items="sorts"
        v-model="sort"
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
import { isRequired } from '../../utils/validationRules';

export default {
  name: "FilterForm",
  components: {
    CustomSelect,
    CustomInput,
    SubmitButon,
  },
  data() {
    return {
      title: "",
      region: "",
      categoryIds: "",
      
    };
  },
  computed: {
    rules() {
            return [isRequired]
        },

    categories() {
      return [
        { value: "", label: "Обрати", isLabel: true },
        "Табір",
        "Мандрівка",
        "Питна вода",
        "Пам’ятка",
        "Музей",
        "Водойма",
        "Автомобіль",
      ];
      // .map(this.formatItem);
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
      ];
      // .map(this.formatItem);
    },
    sorts() {
      return [
        { value: "", label: "Спосіб показу", isLabel: true },
        "за назвою",
        "за датою",
      ]
    },
    
  },

  methods: {
    
    handleSubmit() {
      this.$emit("submit", {
        title: this.title,
        region: this.region,
        categoryIds: this.categoryIds ? [this.categoryIds] : [],
      });
    },

    // formatItem(item, index) {
    //   return typeof item === "object"
    //     ? item
    //     : { value: item, label: item, isLabel: index === 0 };
    // },
  },
};
</script>


<style lang="scss" scoped>
@import "../../assets/scss/variables";
.form-container {
  width: 75%;
  margin: 0 auto;
  font-family: e-Ukraine, sans-serif;
}
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
.form__select--item:first-child{
color: #A9A9A9
}
</style>



