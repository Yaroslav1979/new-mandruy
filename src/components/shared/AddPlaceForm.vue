<template>
  <div class="add-place">
    <h2 class="add-place__title">Додати місце</h2>

    <form class="add-place__form" @submit.prevent="handleSubmit">
      <div class="add-place__form-wrapper">
        <div
          class="upload"
          onclick="document.getElementById('file-upload').click();"
        >
          <img
            src="../../assets/png/emptyPhoto.png"
            alt="Місце для фотографії"
          />
          <label for="file-upload" class="upload-label">Обрати фото...</label>
          <input type="file" id="file-upload" accept="image/*" />
        </div>

        <div class="category">
          <CustomInput
            v-model="title"
            class="add-title"
            placeholder="Введіть назву місця"
            errorMessage="Не повинно бути пустим"
            :rules="rules"
          />

          <CategoriesList :items="categories">
            <template v-slot:categories="{ categories: categories }">
              <CategoryItem
                :key="categories.id"
                :id="categories.id"
                :title="categories.title"
                :svgUrl="categories.svgUrl"
              />
            </template>
          </CategoriesList>

          <CustomInput
            v-model="coordinate"
            class="add-coord"
            placeholder="Введіть координати місця"
            errorMessage="Не повинно бути пустим"
            :rules="rules"
          />
        </div>
      </div>

      <CustomInput
        v-model="descr"
        class="add-descr"
        placeholder="Введіть короткий опис"
        errorMessage="Не повинно бути пустим"
        :rules="rules"
      />
      <div class="add-place__button">
        <button class="add-place__button-trash">
          <img
            src="../../assets/svg/Icon-Trash.svg"
            alt=""
            class="icon-trash"
          />
        </button>

        <SubmitButon @click="handleSubmit" type="submit" class="add-place__btn">
          Надіслати
          <img
            src="../../assets/svg/IconMapArrow.svg"
            alt=""
            class="icon-google-map__arrow"
          />
        </SubmitButon>
      </div>
    </form>
  </div>
</template>

<script>
import CustomInput from "../shared/CustomInput.vue";
import CategoriesList from "../categories/CategoriesList.vue";
import CategoryItem from "../categories/CategoryItem.vue";
import categories from "../categories/categories.js";
import SubmitButon from "../mainButton.vue";
export default {
  name: "AddPlaceForm",
  components: {
    CustomInput,
    CategoriesList,
    CategoryItem,
    SubmitButon,
  },
  props: {
    categories: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      title: "",
      coordinate: "",
      descr: "",
      // categories: categories || [],
    };
  },
  computed: {
    localCategories() {
      return this.categories.length ? this.categories : categories;
    },
  },
  methods: {
    handleSubmit() {
      if (!this.title || !this.coordinate || !this.descr) {
        alert("Будь ласка, заповніть усі поля.");
        return;
      }
      console.log("Відправка:", {
        title: this.title,
        coordinate: this.coordinate,
        descr: this.descr,
        categories: this.categories,
      });
      // Логіка для відправки даних
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../assets/scss/variables.scss";


.add-place {
  display: flex;
  flex-direction: column;
  /* justify-content: center; */
  align-items: center;
  position: relative;
  margin: 100px 0;
  gap: 64px;


&__title {
  color: #000;
  text-align: center;
  font-family: e-Ukraine, sans-serif;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 18px;
  text-transform: uppercase;
}

&__form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: relative;
  /* justify-content: center; */
  align-items: center;
  padding: 50px 0;
}
&__form-wrapper {
  display: flex;
  flex-direction: row;
  gap: 20px;
}
&__button {
  display: flex;
  gap: 4px;
  position: absolute;
  left: 81%;
  top: 95%;
}

&__btn {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  width: 186px;
  height: 47px;
  border-radius: 5px;
  background: #000;
  color: #fff;
  text-align: center;
  font-family: e-Ukraine, sans-serif;
  font-size: 16px;
  font-weight: 500;
  line-height: 140%;
}
&__btn:hover {
  opacity: 80%;
}
}

.upload {
  background-color: #f5f4fa;
  width: 400px;
  height: 312px;
  border: 1px solid #f5f4fa;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;

/* Стилі для тексту "Обрати фото" */
&-label {
  font-size: 16px;
  color: #a3a3a3;
  text-align: center;
  font-family: e-Ukraine, sans-serif;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
  cursor: pointer;
}
}

/* Приховуємо стандартний input для завантаження файлу */
input[type="file"] {
  display: none;
}

.category {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  max-width: 800px;
}

.add-place__button-trash {
position: relative;
width: 48px;
height: 48px;
border-radius: 5px;
border-color: #ff7878;
background: #ff7878;
}

.icon-trash {
width: 18px;
height: 21px;
position: absolute;
left: 14px;
top: 14px;
}
.add-place__button-trash:hover {
background-color: red;
border-color: red;
opacity: 80%;
}
.icon-google-map__arrow {
align-self: center;
justify-content: center;
width: 16px;
height: 16px;
margin-left: 12px;
margin-top: 4px;
}

/* .add-descr {
  display: block;
  width: 1200px;
  height: 192px;
  padding: 10px 40px;
  border-radius: 5px;
  border: 2px solid #e7e6ed;
} */
/* .add-coord {
  width: 340px;
  height: 48px;
  padding: 0 20px;
  border-radius: 5px;
  border: 2px solid #e7e6ed;
} */

</style>
