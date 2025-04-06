<template>
  <section class="add-place" id="addplace">
    <h2 class="add-place__title">Додати місце</h2>

    <form class="add-place__form" @submit.prevent="handleSubmit">
      <div class="add-place__form-wrapper">
        
        <div class="upload-cont">
          
          <div class="upload image-thumbnails" @click="triggerFileUpload" v-if="files.length === 0 || files.length < 10">
            <label for="file-upload" class="upload-label" v-if="files.length < 10">Обрати фото...</label>
           
            <!-- <div class="image-thumbnails"> -->
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
                @change="handleFileChange"
                v-if="files.length < 11"
              />
            <!-- </div> -->
  
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

        <CategoriesList :items="localCategories">
            <template v-slot:categories="{ categories }">
              <CategoryItem
                :key="categories.id"
                :id="categories.id"
                :title="categories.title"
                :svgUrl="categories.svgUrl"
                :class="{ selected: isCategorySelected(categories) }" 
                @click="toggleCategory(categories)"
              />
            </template>
          </CategoriesList>       

      <div>      
         <CustomTextArea
          v-model="descr"
          class="add"
          placeholder="Введіть короткий опис"
          errorMessage="Не повинно бути пустим"
          :rules="rules"
          rows="10"
        />

        <div class="add-place__buttons">
          <button class="add-place__button-trash">
            <img
              src="../../assets/svg/Icon-Trash.svg"
              alt=""
              class="icon-trash"
            />
          </button>

          <SubmitButon @click="handleSubmit" type="submit" class="add-place__btn" :disabled="isLoading">
            Надіслати
            <img
              src="../../assets/svg/IconMapArrow.svg"
              alt=""
              class="icon-google-map__arrow"
            />
          </SubmitButon>
          <CircleLoader v-if="isLoading" class="mt-4 mx-auto" />
        </div>
      </div>
      </div>
    </form>
  </section>
</template>

<script>
import CircleLoader from "../loaders/CircleLoader.vue";
import CustomInput from "./CustomInput.vue";
import CustomTextArea from "./CustomTextArea.vue";
import CategoriesList from "../categories/CategoriesList.vue";
import CategoryItem from "../categories/CategoryItem.vue";
import categories from "../categories/categories.js";
import SubmitButon from "../mainButton.vue";

export default {
  name: "AddPlaceForm",
  components: {
    CustomInput,
    CustomTextArea,
    CategoriesList,
    CategoryItem,
    SubmitButon,
    CircleLoader,
  },
  data() {
    return {
      title: "",
      coordinate: "",
      descr: "",
      region: "",
      city: "",
      selectedCategories: [],  // масив вибраних категорій
      files: [],
      isLoading: false,
    };
  },
  computed: {
    localCategories() {
      return this.categories && this.categories.length ? this.categories : categories;
    },
    visibleThumbnails() {
      return this.files.slice(0, 4);
    },
    extraCount() {
      return this.files.length > 4 ? this.files.length - 4 : 0;
    },
  },
  methods: {
    isCategorySelected(category) {
      return this.selectedCategories.some((cat) => cat.id === category.id);
    },

    triggerFileUpload() {
      document.getElementById('file-upload').click();
    },
    handleFileChange(event) {
      const selectedFiles = Array.from(event.target.files);
      const total = this.files.length + selectedFiles.length;

      if (total > 10) {
        alert("Максимальна кількість зображень: 10");
        return;
      }

      const filePreviews = selectedFiles.map(file => {
        const preview = URL.createObjectURL(file);
        return { file, preview };
      });

      this.files.push(...filePreviews);
    },
    removeFile(index) {
      this.files.splice(index, 1);
    },
    async handleSubmit() {
      if (!this.title || !this.coordinate || !this.descr || !this.region || !this.city) {
        alert("Будь ласка, заповніть усі поля.");
        return;
      }

      this.isLoading = true;

      const formData = new FormData();
      formData.append("title", this.title);
      formData.append("coordinate", this.coordinate);
      formData.append("descr", this.descr);
      formData.append("region", this.region);
      formData.append("city", this.city);

      this.selectedCategories.forEach(category =>
        formData.append("categories[]", category.id)
      );
      this.files.forEach((item, index) =>
        formData.append("images[]", item.file, `image_${index + 1}.jpg`)
      );

      try {
        const response = await fetch('/api/places', {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();
        alert('Місце успішно додано!');
        console.log('Success:', data);
      } catch (error) {
        alert('Сталася помилка при додаванні місця.');
        console.error('Error:', error);
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
  position: relative;
  font-family: e-Ukraine, sans-serif;
  margin: 100px 0;
  /* gap: 20px; */

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
    align-items: center;
    padding: 50px 0;

    &-wrapper {
      /* display: flex; */
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

  .upload-cont {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  gap: 8px;
  align-items: center;
 
}

  .upload {
    /* position: relative; */
    background-color: #f5f4fa;
    width: 400px;
    height: 312px;
    border: 1px solid #f5f4fa;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    
  }
/* .upload>img {
  position: absolute;  
} */

  .upload-label {
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

  .image-thumbnails {
  display: grid;
  grid-template-columns: repeat(2, 1fr);  /* 2 колонки */
  /* grid-template-rows: repeat(2, 1fr); */
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



  .add {
    font-family: e-Ukraine, sans-serif;
    font-size: 14px;
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

  .add-place__buttons {
    display: flex;
    gap: 8px;
    justify-content: right;
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
