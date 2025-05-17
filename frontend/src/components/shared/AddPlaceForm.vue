<template>
  <section class="add-place">
    <h2 class="add-place__title">Додати місце</h2>
    <SuccessMessageModal v-if="successMessageVisible" @close="closeModal" />

    <form v-else class="add-place__form" @submit.prevent="handleSubmit">
      <div class="add-place__form-wrapper">
        <!-- Фото -->
        <div class="upload-cont">
          <div
            class="upload image-thumbnails"
            @click="triggerFileUpload"
            v-if="files.length === 0 || files.length < 10"
          >
            <label
              for="file-upload"
              class="upload-label"
              v-if="files.length < 10"
              >Обрати фото...</label
            >
            <img
              src="../../assets/png/emptyPhoto.png"
              alt="Місце для фотографії"
              v-if="files.length === 0"
            />
            <input
              type="file"
              id="file-upload"
              accept="image/*"
              multiple
              :key="fileInputKey"
              @change="handleFileChange"
              v-if="files.length < 11"
            />
            <div
              v-for="(file, index) in visibleThumbnails"
              :key="index"
              class="thumbnail-wrapper"
            >
              <img :src="file.preview" class="thumbnail" />
              <button class="delete-btn" @click.stop="removeFile(index)">
                ×
              </button>
            </div>
            <div v-if="extraCount > 0" class="thumbnail-wrapper more-count">
              +{{ extraCount }}
            </div>
          </div>
        </div>

        <!-- Текстові поля -->
        <div class="category">
          <CustomInput
            v-model="title"
            class="add"
            placeholder="Введіть назву місця"
            errorMessage="Не повинно бути пустим"
            :rules="rules"
          />
          <CustomInput
            v-model="coordinate"
            class="add"
            placeholder="Введіть координати місця"
            errorMessage="Не повинно бути пустим"
            :rules="rules"
          />
          <CustomInput
            v-model="region"
            class="add"
            placeholder="Введіть область"
            errorMessage="Не повинно бути пустим"
            :rules="rules"
          />
          <CustomInput
            v-model="city"
            class="add"
            placeholder="Введіть місто"
            errorMessage="Не повинно бути пустим"
            :rules="rules"
          />
        </div>
      </div>

      <!-- Категорії -->

      <CategoriesList v-model="categoryIds" :items="localCategories" />
  
      <!-- Опис + Кнопки -->
      
        <CustomTextArea
          v-model="descr"
          placeholder="Введіть короткий опис"
          errorMessage="Не повинно бути пустим"
          :rules="rules"
          :rows="10"
        />
       
        <div class="add-place__buttons">
          <button type="button" class="add-place__button-trash">
            <img
              src="../../assets/svg/Icon-Trash.svg"
              alt=""
              class="icon-trash"
            />
          </button>

          <SubmitButon
            type="submit"
            class="add-place__btn"
            :disabled="isLoading"
          >
            Надіслати
            <img
              src="../../assets/svg/IconMapArrow.svg"
              alt="=>"
              class="icon-google-map__arrow"
            />
          </SubmitButon>

          <CircleLoader v-if="isLoading" class="mt-4 mx-auto" />
        
      </div>
    </form>
  </section>
</template>

<script>
import CircleLoader from "../loaders/CircleLoader.vue";
import CustomInput from "./CustomInput.vue";
import CustomTextArea from "./CustomTextArea.vue";
import CategoriesList from "../categories/CategoriesList.vue";
import SuccessMessageModal from "../SuccessMessageModal.vue";
import categories from "../categories/categories.js";
import SubmitButon from "../mainButton.vue";

export default {
  name: "AddPlaceForm",
  components: {
    CustomInput,
    CustomTextArea,
    CategoriesList,
    SuccessMessageModal,
    SubmitButon,
    CircleLoader,
  },
  data() {
    return {
      title: "",
      coordinate: "",
      region: "",
      city: "",
      descr: "",
      files: [],
      categoryIds: [], // зберігаємо ID обраних категорій
      localCategories: categories,
      isLoading: false,
      rules: [],
      fileInputKey: 0,
      successMessageVisible: false,
    };
  },
  computed: {
    extraCount() {
      return this.files.length > 4 ? this.files.length - 4 : 0;
    },
    visibleThumbnails() {
      return this.files.slice(0, 4);
    },
  },
  methods: {
    triggerFileUpload() {
      document.getElementById("file-upload")?.click();
    },

    handleFileChange(event) {
      const selectedFiles = Array.from(event.target.files);
      selectedFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.files.push({ file, preview: e.target.result });
        };
        reader.readAsDataURL(file);
      });
      this.fileInputKey = Date.now();
    },

    removeFile(index) {
      this.files.splice(index, 1);
    },

    closeModal() {
  this.$emit("close"); // Закриває модалку, наприклад у батьківському компоненті
},

    // Функція для вибору категорій
   
    async handleSubmit() {
      if (
        !this.title.trim() ||
        !this.coordinate.trim() ||
        !this.region.trim() ||
        !this.city.trim() ||
        !this.descr.trim()
      ) {
        alert("Будь ласка, заповніть усі текстові поля.");
        return;
      }
      if (this.files.length === 0) {
        alert("Будь ласка, додайте хоча б одне фото.");
        return;
      }

      if (this.categoryIds.length === 0) {
        alert("Будь ласка, виберіть хоча б одну категорію.");
        return;
      }
      this.isLoading = true;

      const placeData = {
        title: this.title,
        coordinate: this.coordinate,
        region: this.region,
        city: this.city,
        descr: this.descr,
        categoryIds: this.categoryIds,
        // інші дані, як файли — окремо
      };
      console.log("Готові дані до надсилання:", placeData);
      try {
    const formData = new FormData();
    formData.append("title", this.title);
    formData.append("coordinate", this.coordinate);
    formData.append("region", this.region);
    formData.append("city", this.city);
    formData.append("descr", this.descr);
    formData.append("categoryIds", JSON.stringify(this.categoryIds));

    // Додаємо всі зображення
    this.files.forEach(({ file }) => {
      formData.append("images", file); // "images" — ключ для масиву файлів
    });

    const response = await fetch("http://localhost:3000/api/places", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Помилка при надсиланні даних");
    }

    const result = await response.json();
    console.log("Успішно збережено:", result);

    this.$emit("added", result);
    this.successMessageVisible = true;

  } catch (error) {
    alert("Помилка при збереженні місця: " + error.message);
  } finally {
    this.isLoading = false;
  }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../assets/scss/variables.scss";

.add-place {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: e-Ukraine, sans-serif;
  margin: 100px 0; 

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
    align-items: stretch;
    padding: 50px 0;

    &-wrapper {
      display: flex;  
      width: 100%;
      justify-content: space-between;
      gap: 12px;
    }            
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
  &__btn:hover {
    opacity: 80%;
  }

  .add-place__buttons {
    display: flex;
    justify-content: right;
    gap: 8px;   
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

  .upload-cont {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    gap: 8px;
    align-items: center;    
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
    
    &-label {
      display: flex;
    justify-content: center;
    font-size: 16px;
    color: #a3a3a3;
    text-align: center;
    font-family: e-Ukraine, sans-serif;
    font-style: normal;
    font-weight: 400;
    line-height: 18px;
    cursor: pointer;
    z-index: 1;
    }
  }  

  .image-thumbnails {
    display: grid;
    grid-template-columns: repeat(2, 1fr); /* 2 колонки */
    grid-gap: 8px;
    margin-top: 10px;
    max-width: 400px;
    width: 100%;
  }

  .thumbnail-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 5px;
    overflow: hidden;
    border: 1px solid #ccc;
  }

  .thumbnail {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .delete-btn {
    position: absolute;
    top: 42.5%;
    right: 45%;
    background: rgba(222, 217, 217, 0.845);
    color: black;
    border: 1px solid black;
    border-radius: 50%;
    font-size: 14px;
    width: 20px;
    height: 20px;
    cursor: pointer;
    opacity: 0.5;
  }

  .more-count {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #ddd;
    font-size: 16px;
    font-weight: bold;
  }

  input[type="file"] {
    display: none;
  }

  .category {
    display: flex;
    flex-direction: column;
    gap: 20px;
    flex-wrap: wrap;
    width: 100%;
    max-width: 800px;
  }

  /* Стилі для вибраної категорії */
  .selected {
    background-color: black;
    color: white;
  }

  .selected .icon-ctg {
    filter: invert(1);
  }
}
</style>
