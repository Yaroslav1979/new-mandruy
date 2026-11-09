<template>
  <section class="add-place">
    <h2 class="add-place__title">
      {{ placeToEdit ? "Редагувати місце" : "Додати місце" }}
    </h2>
    <SuccessModal v-if="successMessageVisible" @close="closeModal" />

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

          <!-- Поле координат та кнопка вибору на мапі -->
          <div class="coordinate-field-wrapper">
            <CustomInput
              v-model="coordinate"
              class="add"
              placeholder="Введіть координати місця"
              errorMessage="Не повинно бути пустим"
              :rules="rules"
            />
            <button
              type="button"
              class="map-select-btn"
              @click="isMapModalOpen = true"
            >
              Вибрати на мапі
            </button>
          </div>

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
      <p class="add-place__add-ctg">
        Виберіть категорії що відповідають місцю:
      </p>

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

        <SubmitButon type="submit" class="add-place__btn" :disabled="isLoading">
          {{ placeToEdit ? "Зберегти зміни" : "Надіслати" }}
          <img
            src="../../assets/svg/IconMapArrow.svg"
            alt="=>"
            class="icon-google-map__arrow"
          />
        </SubmitButon>

        <CircleLoader v-if="isLoading" class="mt-4 mx-auto" />
      </div>
    </form>

    <!-- Підключений компонент карти -->
    <AddCoordinate
      v-if="isMapModalOpen"
      :initialCoordinate="coordinate"
      @close="isMapModalOpen = false"
      @confirm="handleCoordinateSelected"
    />
  </section>
</template>

<script>
import axiosInstance from "../../utils/axios.js";
import CircleLoader from "../loaders/CircleLoader.vue";
import CustomInput from "./CustomInput.vue";
import CustomTextArea from "./CustomTextArea.vue";
import CategoriesList from "../categories/CategoriesList.vue";
import SuccessModal from "./SuccessModal.vue";
import AddCoordinate from "./add.Coordinate.vue";
import categories from "../categories/categories.js";
import SubmitButon from "./mainButton.vue";

export default {
  name: "AddPlaceForm",

  components: {
    CustomInput,
    CustomTextArea,
    CategoriesList,
    SuccessModal,
    SubmitButon,
    CircleLoader,
    AddCoordinate,
  },

  props: {
    placeToEdit: {
      type: Object,
      default: null,
    },
  },

  data() {
    return {
      title: "",
      coordinate: "",
      region: "",
      city: "",
      descr: "",

      // Тут зберігаються як наявні, так і нові фотографії
      files: [],

      categoryIds: [],
      localCategories: categories,

      isLoading: false,
      rules: [],
      fileInputKey: 0,

      successMessageVisible: false,
      successMessage: "",
      isMapModalOpen: false,
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

  watch: {
    placeToEdit: {
      immediate: true,
      handler(place) {
        this.populateForm(place);
      },
    },
  },

  methods: {
    // =========================
    // ЗАПОВНЕННЯ ФОРМИ
    // =========================

    populateForm(place) {
      if (!place) {
        this.title = "";
        this.coordinate = "";
        this.region = "";
        this.city = "";
        this.descr = "";
        this.files = [];
        this.categoryIds = [];
        this.successMessageVisible = false;
        this.fileInputKey = Date.now();
        return;
      }

      // Якщо є незатверджені зміни, завантажуємо саме їх
      // const source = place.pendingChanges || place;
      const pending = place.pendingChanges;

      const hasPendingChanges =
        pending &&
        (pending.title ||
          pending.descr ||
          pending.location ||
          pending.imgUrls?.length ||
          pending.categoryIds?.length);

      const source = hasPendingChanges
        ? {
            ...place,
            ...pending,
            imgUrls: pending.imgUrls?.length ? pending.imgUrls : place.imgUrls,
            categoryIds: pending.categoryIds?.length
              ? pending.categoryIds
              : place.categoryIds,
          }
        : place;

      this.title = source.title || "";
      this.descr = source.descr || "";

      this.coordinate = source.location?.coordinate || "";
      this.region = source.location?.region || "";
      this.city = source.location?.city || "";

      this.categoryIds = [...(source.categoryIds || [])];

      // Перетворюємо URL наявних фотографій у формат прев'ю
      this.files = (source.imgUrls || []).map((url) => ({
        file: null,
        url,
        preview: url,
      }));

      this.successMessageVisible = false;
      this.fileInputKey = Date.now();
    },

    // =========================
    // ФОТОГРАФІЇ
    // =========================

    triggerFileUpload() {
      document.getElementById("file-upload")?.click();
    },

    handleFileChange(event) {
      const selectedFiles = Array.from(event.target.files || []);

      const availableSlots = 10 - this.files.length;

      if (selectedFiles.length > availableSlots) {
        alert("Можна додати не більше 10 фотографій.");
      }

      const filesToAdd = selectedFiles.slice(0, availableSlots);

      filesToAdd.forEach((file) => {
        const reader = new FileReader();

        reader.onload = (e) => {
          this.files.push({
            file,
            preview: e.target.result,
          });
        };

        reader.readAsDataURL(file);
      });

      this.fileInputKey = Date.now();
    },

    removeFile(index) {
      this.files.splice(index, 1);
    },

    // =========================
    // КАРТА
    // =========================

    handleCoordinateSelected(coords) {
      this.coordinate = coords;
    },

    // =========================
    // ЗАКРИТТЯ
    // =========================

    closeModal() {
      this.successMessageVisible = false;
      this.successMessage = "";
      this.$emit("close");
    },

    // =========================
    // НАДСИЛАННЯ ФОРМИ
    // =========================

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

      try {
        const formData = new FormData();

        formData.append("title", this.title.trim());
        formData.append("coordinate", this.coordinate.trim());
        formData.append("region", this.region.trim());
        formData.append("city", this.city.trim());
        formData.append("descr", this.descr.trim());

        formData.append("categoryIds", JSON.stringify(this.categoryIds));

        // URL фотографій, які потрібно залишити
        const existingImgUrls = this.files
          .filter((item) => !item.file && item.url)
          .map((item) => item.url);

        formData.append("existingImgUrls", JSON.stringify(existingImgUrls));

        // Нові фотографії, які потрібно завантажити
        this.files.forEach(({ file }) => {
          if (file) {
            formData.append("images", file);
          }
        });

        let response;

        if (!this.placeToEdit) {
          // ЗВИЧАЙНЕ ДОДАВАННЯ
          response = await axiosInstance.post("/places", formData);

          this.$emit("added", response.data);

          this.successMessage =
            "Ваше місце надіслано на розгляд адміністратору. Після підтвердження воно з'явиться на сайті. Дякуємо!";

          this.successMessageVisible = true;
        } else if (this.placeToEdit.isApproved) {
          // РЕДАГУВАННЯ ОПУБЛІКОВАНОГО МІСЦЯ
          response = await axiosInstance.post(
            `/places/${this.placeToEdit._id}/submit-changes`,
            formData,
          );

          alert("Зміни надіслано на повторну модерацію.");

          this.$emit("updated", response.data.place);
        } else {
          // РЕДАГУВАННЯ НЕОПУБЛІКОВАНОГО МІСЦЯ
          response = await axiosInstance.patch(
            `/places/${this.placeToEdit._id}/edit`,
            formData,
          );

          alert("Місце успішно оновлено.");

          this.$emit("updated", response.data.place);
        }
      } catch (error) {
        console.error("Помилка при збереженні місця:", error);

        const message =
          error.response?.data?.message || error.message || "Невідома помилка";

        alert("Помилка при збереженні місця: " + message);
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
  width: 100%;
  font-family: e-Ukraine, sans-serif;
  margin: 100px 0;

  &__title {
    color: #000;
    text-align: center;
    font-family: e-Ukraine, sans-serif;
    font-size: clamp(20px, 2vw, 24px);
    font-weight: 700;
    line-height: 1.2;
    text-transform: uppercase;
    margin: 0 0 20px;
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: stretch;

    width: 100%;
    max-width: 1200px;

    padding: 30px 20px;
    box-sizing: border-box;

    &-wrapper {
      display: flex;
      width: 100%;
      justify-content: space-between;
      align-items: flex-start;
      gap: clamp(20px, 3vw, 40px);
    }
  }

  .add-place__add-ctg {
    font-size: 16px;
    font-family: e-Ukraine, sans-serif;
    padding-left: 20px;
    color: gray;
  }

  /* =========================
     БЛОК ФОТО
     ========================= */

  .upload-cont {
    display: flex;
    justify-content: center;
    align-items: center;

    width: 50%;
    flex-shrink: 1;
  }

  .upload {
    position: relative;

    background-color: #f5f4fa;

    width: 100%;
    max-width: 400px;
    height: 312px;

    border: 1px solid #f5f4fa;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    cursor: pointer;

    box-sizing: border-box;

    &-label {
      display: flex;
      justify-content: center;

      font-size: clamp(12px, 1.3vw, 16px);
      color: #a3a3a3;
      text-align: center;
      font-family: e-Ukraine, sans-serif;
      font-weight: 400;
      line-height: 18px;

      cursor: pointer;
      z-index: 1;
    }
  }

  .image-thumbnails {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;

    width: 100%;
    max-width: 400px;

    margin-top: 10px;
  }

  /* =========================
     ІНПУТИ
     ========================= */

  .category {
    display: flex;
    flex-direction: column;
    gap: 20px;

    width: 50%;
    max-width: 800px;
  }

  /* =========================
     КНОПКИ
     ========================= */

  &__buttons {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 8px;
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

  .coordinate-field-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 10px;
  }

  .map-select-btn {
    font-family: e-Ukraine, sans-serif;
    color: #ddd;
    background-color: #000;
    font-size: 14px;
    font-weight: 400;
    border-radius: 20px;
    line-height: 30px;
    &:hover {
      opacity: 0.8;
      color: #fff;
    }
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

  .icon-google-map__arrow {
    width: 16px;
    height: 16px;
    margin-left: 12px;
    margin-top: 4px;
  }

  /* =========================
     THUMBNAILS
     ========================= */

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

  /* =========================
     ПЛАНШЕТ
     ========================= */

  @media (max-width: 900px) {
    &__form {
      padding: 30px 15px;
    }

    &__form-wrapper {
      gap: 20px;
    }

    .upload {
      height: clamp(240px, 32vw, 312px);
    }

    .category {
      gap: 15px;
    }

    .map-select-btn {
      font-size: 12px;
    }
  }

  /* =========================
     СМАРТФОН
     ========================= */

  @media (max-width: 600px) {
    margin: 50px 0;

    &__form {
      padding: 20px 16px;
      gap: 20px;
    }

    /*
     * Фото та інпути стають
     * вертикально один під одним
     */
    &__form-wrapper {
      flex-direction: column;
      align-items: stretch;
      gap: 20px;
    }

    .map-select-btn {
      font-size: 12px;
      border-radius: 15px;
    }

    /*
     * Фото першим
     */
    .upload-cont {
      order: 1;
      width: 100%;
    }

    .upload {
      width: 100%;
      max-width: none;
      height: 260px;
    }

    /*
     * Потім усі CustomInput
     */
    .category {
      order: 2;
      width: 100%;
      max-width: none;
      gap: 15px;
    }

    /*
     * Категорії
     */
    .categories {
      width: 100%;
    }

    /*
     * Опис
     */
    :deep(.form-group) {
      margin: 10px 0;
    }

    /*
     * Кнопки
     */
    &__buttons {
      justify-content: flex-end;
      width: 100%;
    }

    .add-place__btn {
      width: 150px;
      height: 42px;
      font-size: 12px;
    }

    .add-place__button-trash {
      width: 42px;
      height: 42px;
    }

    .icon-trash {
      left: 11px;
      top: 11px;
    }
  }

  /* =========================
     ДУЖЕ МАЛИЙ СМАРТФОН
     ========================= */

  @media (max-width: 450px) {
    &__form {
      padding: 15px 10px;
    }

    .upload {
      height: 220px;
    }

    &__title {
      font-size: 18px;
    }

    &__buttons {
      justify-content: space-between;
    }

    .add-place__btn {
      flex: 1;
      max-width: 186px;
    }
  }
}
</style>
