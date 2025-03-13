<template>
  <div class="add-place">
    <h2 class="add-place__title">Додати місце</h2>

    <form class="add-place__form" @submit.prevent="handleSubmit">
<div class="add-place__form-wrapper">
      <div
        class='upload-container'
        onclick="document.getElementById('file-upload').click();"
      >
        <img
          src='../../assets/png/emptyPhoto.png'
          alt='Місце для фотографії'
        />
        <label for='file-upload' class='upload-text'>Обрати
          фото...</label>
        <input
          type='file'
          id='file-upload'
          accept='image/*'
        />
      </div>

      <div class="category">
        <CustomInput
          v-model="title"
          class="add-name"
          placeholder="Введіть назву місця"
          errorMessage="Не повинно бути пустим"
          :rules="rules"
        />

        <CategoriesList :items="categories" >
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
    <div class="add-place__buttons">
      <SubmitButon @click="handleSubmit" type="submit" class="add-place__btn">
        Надіслати
        <img
          src="../../assets/svg/IconMapArrow.svg"
          alt=""
          class="google-map-arrow"
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
.add-place {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 100px 0;
  gap: 64px;
}

.add-place__title {
  color: #000;
  text-align: center;
  font-family: e-Ukraine, sans-serif;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 18px;
  text-transform: uppercase;
}

.add-place__form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  /* justify-content: center; */
  align-items: center;
  padding: 50px 0;

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
.add-place__form-wrapper {
  display: flex;
  flex-direction: row;
  gap: 20px;
}
/* .add-place__category {
  display: grid;
  grid-template-columns: repeat(4, 1fr); 
  grid-template-rows: repeat(2, auto);  
  gap: 10px;
} */

.add-coord {
  width: 340px;
  height: 48px;
  padding: 0 20px;
  border-radius: 5px;
  border: 2px solid #e7e6ed;
}

.add-part-block {
  display: flex;
  flex-direction: column;
  gap: 36px;
}

.add-place__buttons {
  display: flex;
  flex-direction: row;
  justify-content: right;
}

.add-place__btn {
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
.add-place__btn:hover {
  opacity: 80%;
}
.add-place {
  display: flex;
  position: relative;
  flex-direction: column;
  align-items: center;
}

.add-title {
  color: #000;
  text-align: center;
  font-family: e-Ukraine, sans-serif;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 18px;
  text-transform: uppercase;
}

.category {
  display: flex;
  flex-direction: row; 
  flex-wrap: wrap;
  max-width: 800px;  
}

.add-descr {
  display: block;
  width: 1200px;
  height: 192px;
  padding: 10px 40px;
  border-radius: 5px;
  border: 2px solid #e7e6ed;
}

.google-map-arrow {
  /* display: flex; */
  align-self: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  margin-left: 12px;
  margin-top: 4px;
}
.upload-container {
  background-color: #F5F4FA;
  width: 400px;
  height: 312px;
  border: 1px solid #F5F4FA;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

/* Стилі для тексту "Обрати фото" */
.upload-text {
  font-size: 16px;
  color: #A3A3A3;
  text-align: center;
  font-family: e-Ukraine, sans-serif;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
  cursor: pointer;
}

/* Приховуємо стандартний input для завантаження файлу */
input[type="file"] {
  display: none;
}
</style>
