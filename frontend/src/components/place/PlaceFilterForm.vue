<template>
  <section class="form-container">
    <h2 class="section__title">ПОШУК МІСЦЬ</h2>

    <form class="form" @submit.prevent="handleSubmit">
      <div class="form__wrapper">
        <CustomInput
          v-model="title"
          placeholder="Введіть назву місця"
          errorMessage="Не повинно бути пустим"
          class="search-input"
        />
        <SubmitButon @click="handleSubmit" type="submit" class="search-btn">
          <img
            src="../../assets/png/iconSearch.png"
            alt=""
            class="search-icon"
          />
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

        <span>СОРТУВАТИ:</span>
        <CustomSelect
          :items="sorts"
          v-model="sortBy"
          class="form__select--item"
        />

        <div class="form__toggle">
          <img
            src="../../assets/png/icon-grid-fill.png"
            alt=""
            class="form__toggle--grid"
          />
          <img
            src="../../assets/png/icon-agenda.png"
            alt=""
            class="form__toggle--gallery"
          />
        </div>
      </div>
    </form>
  </section>
</template>

<script>
import CustomInput from "../shared/CustomInput.vue";
import CustomSelect from "../shared/CustomSelect.vue";
import SubmitButon from "../mainButton.vue";
import { isRequired } from "../../utils/validationRules";

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
      sortBy: "",
    };
  },
  computed: {
    rules() {
      return [isRequired];
    },

    categories() {
      return [
        { value: "", label: "Без категорії", isLabel: true },
        "Табір",
        "Мандрівка",
        "Питна вода",
        "Пам'ятка",
        "Музей",
        "Водойма",
        "Автомобіль",
      ];
      // .map(this.formatItem);
    },

    regions() {
      return [
        { value: "", label: "Всі області", isLabel: true },
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
        { value: "", label: "за замовчуванням", isLabel: true },
        { value: "title", label: "за назвою" },
        { value: "date", label: "за датою" },
      ];
    },
  },

  methods: {
    handleSubmit() {
      this.$emit("submit", {
        title: this.title,
        region: this.region,
        categoryIds: this.categoryIds ? [this.categoryIds] : [],
        sortBy: this.sortBy,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../assets/scss/variables";

.form-container {
  width: clamp(75%, 75vw, 1300px);
  margin: 0 auto;
  font-family: e-Ukraine, sans-serif;
}

.form {
  display: flex;
  flex-direction: column;
  gap: clamp(15px, 2vw, 20px);

  &__wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: clamp(6px, 0.8vw, 10px);
    width: 100%;
  }

  &__select {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    gap: clamp(8px, 1.2vw, 20px);

    font-family: e-Ukraine, sans-serif;
    font-size: clamp(10px, 1vw, 14px);

    span {
      font-weight: 600;
      white-space: nowrap;
    }

    &--item {
      min-width: clamp(100px, 11vw, 160px);
    }
  }
}

.section__title {
  color: #000;
  text-align: center;
  font-family: e-Ukraine, sans-serif;

  font-size: clamp(18px, 1.7vw, 24px);
  font-weight: 700;
  line-height: 1.2;

  text-transform: uppercase;
  margin-top: 0;
  margin-bottom: clamp(25px, 3.5vw, 52px);
}

.search-input {
  border: none;
}

.search-icon {
  display: flex;
  align-content: center;

  width: clamp(36px, 3.8vw, 54px);
  height: auto;

  cursor: pointer;

  &:hover {
    border: 2px solid grey;
    border-radius: 8px;
  }
}

.form__submit {
  margin-left: clamp(10px, 2vw, 30px);
}

.form__toggle {
  display: flex;
  align-items: center;
  gap: clamp(5px, 0.8vw, 10px);

  cursor: pointer;

  &:hover {
    opacity: 60%;
  }

  &--grid,
  &--gallery {
    display: flex;

    width: clamp(22px, 2.2vw, 32px);
    height: clamp(22px, 2.2vw, 32px);

    opacity: 40%;
  }
}

.form__select--item:first-child {
  color: #a9a9a9;
}

/* =========================================
   ПЛАНШЕТ
   ========================================= */

@media (max-width: 900px) {
  .form-container {
    width: 85%;
  }

  .form__select {
    gap: 8px;

    span {
      font-size: 11px;
    }

    &--item {
      min-width: 90px;
    }
  }
}

/* =========================================
   СМАРТФОН
   ========================================= */

@media (max-width: 700px) {
  .form-container {
    width: calc(100% - 32px);
  }

  .section__title {
    font-size: 18px;
    margin-bottom: 25px;
  }

  .form {
    gap: 15px;
  }

  .form__wrapper {
    gap: 6px;
  }

  .search-icon {
    width: 40px;
  }

  .form__select {
    display: grid;

    grid-template-columns: 95px minmax(0, 1fr);
    grid-template-rows: repeat(3, auto) auto;

    // grid-template-columns: auto minmax(150px, 1fr);
    // grid-template-rows: repeat(3, auto) auto;

    justify-content: stretch;
    align-items: center;

    gap: 12px 10px;

    width: 100%;

    span {
      font-size: 11px;
      white-space: nowrap;
    }

    &--item {
      width: 100%;
      min-width: 0;
    }
  }

  .form__toggle {
    grid-column: 1 / -1;
    grid-row: 4;

    justify-content: center;
  }

  .form__toggle--grid,
  .form__toggle--gallery {
    width: 28px;
    height: 28px;
  }

  .section__title {
    font-size: 18px;
    margin-bottom: 25px;
  }
}

/* =========================================
   ДУЖЕ МАЛИЙ СМАРТФОН
   ========================================= */

@media (max-width: 450px) {
  .form-container {
    width: calc(100% - 24px);
  }

  .form__select {
    grid-template-columns: 95px minmax(0, 1fr);
    gap: 10px 8px;

    span {
      font-size: 10px;
    }
  }

  .form__toggle {
    gap: 12px;
  }

  .form__toggle--grid,
  .form__toggle--gallery {
    width: 26px;
    height: 26px;
  }

  .section__title {
    font-size: 16px;
    margin-bottom: 20px;
  }
  .search-icon {
    width: 36px;
  }
}
</style>
