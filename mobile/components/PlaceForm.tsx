import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { MapPickerModal } from "./MapPickerModal";
import { useAuth } from "../context/AuthContext";
import { API_URL } from "../constants/api";
import categories from "../constants/categories";

type PlaceImage = {
  uri: string;
  type: string;
  existing: boolean;
};

type PlaceData = {
  _id: string;
  title: string;
  descr: string;
  imgUrls: string[];
  categoryIds: string[];
  isApproved: boolean;
  location: {
    region: string;
    city: string;
    coordinate: string;
  };
  pendingChanges?: {
    title: string;
    descr: string;
    imgUrls: string[];
    categoryIds: string[];
    location: {
      region: string;
      city: string;
      coordinate: string;
    };
    submittedAt?: string;
  };
};

type Props = {
  mode: "create" | "edit";
  place?: PlaceData;
  onSuccess?: (place?: any) => void;
};

export function PlaceForm({ mode, place, onSuccess }: Props) {
  const { token } = useAuth();

  const [title, setTitle] = useState("");
  const [coordinate, setCoordinate] = useState("");
  const [region, setRegion] = useState("");
  const [city, setCity] = useState("");
  const [descr, setDescr] = useState("");
  const [images, setImages] = useState<PlaceImage[]>([]);
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [mapVisible, setMapVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Якщо для опублікованого місця вже є зміни на модерації,
  // відкриваємо саме запропоновану версію.
  const source =
    place?.isApproved && place.pendingChanges?.submittedAt
      ? place.pendingChanges
      : place;

  useEffect(() => {
    if (mode === "create" || !source) {
      setTitle("");
      setCoordinate("");
      setRegion("");
      setCity("");
      setDescr("");
      setImages([]);
      setCategoryIds([]);
      return;
    }

    setTitle(source.title || "");
    setCoordinate(source.location?.coordinate || "");
    setRegion(source.location?.region || "");
    setCity(source.location?.city || "");
    setDescr(source.descr || "");
    setCategoryIds(source.categoryIds || []);

    setImages(
      (source.imgUrls || []).map((url) => ({
        uri: url,
        type: "image/jpeg",
        existing: true,
      })),
    );
  }, [mode, place?._id]);

  // Вибір фотографій
  const pickImages = async () => {
    if (images.length >= 10) {
      Alert.alert("Увага", "Можна додати максимум 10 фотографій");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      quality: 0.7,
    });

    if (result.canceled || !result.assets) return;

    const remaining = 10 - images.length;
    const selectedAssets = result.assets.slice(0, remaining);

    try {
      const converted = await Promise.all(
        selectedAssets.map(async (asset) => {
          const manipulated = await ImageManipulator.manipulateAsync(
            asset.uri,
            [],
            {
              compress: 0.7,
              format: ImageManipulator.SaveFormat.JPEG,
            },
          );

          return {
            uri: manipulated.uri,
            type: "image/jpeg",
            existing: false,
          };
        }),
      );

      setImages((prev) => [...prev, ...converted].slice(0, 10));
    } catch (error) {
      console.error("Помилка обробки фотографій:", error);
      Alert.alert("Помилка", "Не вдалося обробити фотографії");
    }
  };

  // Видалення фотографії зі списку
  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Вибір категорій
  const toggleCategory = (id: string) => {
    setCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  // Відправлення форми
  const handleSubmit = async () => {
    if (
      !title.trim() ||
      !coordinate.trim() ||
      !region.trim() ||
      !city.trim() ||
      !descr.trim()
    ) {
      Alert.alert("Увага", "Заповніть усі поля");
      return;
    }

    if (images.length === 0) {
      Alert.alert("Увага", "Додайте хоча б одну фотографію");
      return;
    }

    if (categoryIds.length === 0) {
      Alert.alert("Увага", "Оберіть хоча б одну категорію");
      return;
    }

    if (!token) {
      Alert.alert("Помилка", "Потрібна авторизація");
      return;
    }

    const formData = new FormData();

    formData.append("title", title.trim());
    formData.append("coordinate", coordinate.trim());
    formData.append("region", region.trim());
    formData.append("city", city.trim());
    formData.append("descr", descr.trim());
    formData.append("categoryIds", JSON.stringify(categoryIds));

    if (mode === "edit") {
      const existingImgUrls = images
        .filter((img) => img.existing)
        .map((img) => img.uri);

      formData.append("existingImgUrls", JSON.stringify(existingImgUrls));
    }

    // Завантажуємо лише нові фотографії.
    images
      .filter((img) => !img.existing)
      .forEach((img, index) => {
        formData.append("images", {
          uri: img.uri,
          name: `photo_${index}.jpg`,
          type: "image/jpeg",
        } as any);
      });

    let endpoint = `${API_URL}/api/places`;
    let method = "POST";

    if (mode === "edit" && place) {
      if (place.isApproved) {
        endpoint = `${API_URL}/api/places/${place._id}/submit-changes`;
        method = "POST";
      } else {
        endpoint = `${API_URL}/api/places/${place._id}/edit`;
        method = "PATCH";
      }
    }

    try {
      setSubmitting(true);

      const response = await fetch(endpoint, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Не вдалося зберегти місце");
      }

      Alert.alert(
        "Успішно",
        responseData.message ||
          (mode === "create" ? "Місце додано" : "Зміни збережено"),
        [
          {
            text: "OK",
            onPress: () => onSuccess?.(responseData.place),
          },
        ],
      );
    } catch (error: any) {
      console.error("Помилка збереження місця:", error);
      Alert.alert("Помилка", error.message || "Не вдалося зберегти місце");
    } finally {
      setSubmitting(false);
    }
  };

  const submitTitle =
    mode === "create"
      ? "Надіслати"
      : place?.isApproved
      ? "Надіслати на модерацію"
      : "Зберегти зміни";

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.titleWrapper}>
        <Text style={styles.title}>
          {mode === "create" ? "ДОДАТИ МІСЦЕ" : "РЕДАГУВАТИ МІСЦЕ"}
        </Text>
      </View>

      {/* ФОТОГРАФІЇ */}
      <View style={styles.uploadBox}>
        <Pressable onPress={pickImages} style={styles.uploadArea}>
          {images.length === 0 && (
            <Text style={styles.uploadText}>Обрати фото...</Text>
          )}

          <View style={styles.imagesGrid}>
            {images.slice(0, 4).map((img, index) => (
              <View key={`${img.uri}-${index}`} style={styles.imageWrapper}>
                <Image source={{ uri: img.uri }} style={styles.image} />

                <Pressable
                  style={styles.deleteBtn}
                  onPress={() => removeImage(index)}
                >
                  <Text style={{ color: "#fff" }}>×</Text>
                </Pressable>
              </View>
            ))}

            {images.length > 4 && (
              <View style={styles.moreOverlay}>
                <Text style={{ color: "#fff" }}>+{images.length - 4}</Text>
              </View>
            )}
          </View>

          {images.length > 0 && images.length < 10 && (
            <Text style={styles.addMoreText}>
              Додати ще фото ({images.length}/10)
            </Text>
          )}
        </Pressable>
      </View>

      {/* ОСНОВНІ ПОЛЯ */}
      <TextInput
        placeholder="Назва"
        style={styles.input}
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        placeholder="Координати (наприклад: 49.839700, 24.029700)"
        style={styles.input}
        value={coordinate}
        onChangeText={setCoordinate}
      />

      <Pressable style={styles.mapButton} onPress={() => setMapVisible(true)}>
        <Text style={styles.mapButtonText}>Вибрати на мапі</Text>
      </Pressable>

      <MapPickerModal
        visible={mapVisible}
        onClose={() => setMapVisible(false)}
        onSelect={(coord) => setCoordinate(coord)}
        initialCoordinate={coordinate}
      />

      <TextInput
        placeholder="Область"
        style={styles.input}
        value={region}
        onChangeText={setRegion}
      />

      <TextInput
        placeholder="Місто"
        style={styles.input}
        value={city}
        onChangeText={setCity}
      />

      {/* КАТЕГОРІЇ */}
      <View style={styles.titleWrapper}>
        <Text style={styles.categoryTitle}>Виберіть відповідні категорії:</Text>
      </View>

      <View style={styles.categories}>
        {categories.map((cat) => {
          const isSelected = categoryIds.includes(cat.id);
          const Icon = isSelected ? cat.iconWhite : cat.icon;

          return (
            <Pressable
              key={cat.id}
              onPress={() => toggleCategory(cat.id)}
              style={[styles.category, isSelected && styles.categorySelected]}
            >
              <View style={styles.categoryContent}>
                <Icon width={20} height={20} />

                <Text
                  style={[
                    styles.categoryText,
                    isSelected && styles.categoryTextSelected,
                  ]}
                >
                  {cat.title}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      {/* ОПИС */}
      <TextInput
        placeholder="Короткий опис"
        multiline
        value={descr}
        onChangeText={setDescr}
        style={styles.textArea}
      />

      {/* ЗБЕРЕГТИ */}
      <Pressable
        style={[styles.submit, submitting && styles.submitDisabled]}
        onPress={handleSubmit}
        disabled={submitting}
      >
        <Text style={styles.submitText}>
          {submitting ? "Збереження..." : submitTitle}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },

  uploadBox: {
    marginBottom: 16,
  },

  uploadArea: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 10,
  },

  uploadText: {
    fontFamily: "Ukrainian-Regular",
    textAlign: "center",
    marginBottom: 10,
    color: "#ccc",
  },

  imagesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  imageWrapper: {
    position: "relative",
  },

  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },

  deleteBtn: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "red",
    borderRadius: 10,
    paddingHorizontal: 5,
  },

  moreOverlay: {
    width: 80,
    height: 80,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },

  addMoreText: {
    fontFamily: "Ukrainian-Regular",
    textAlign: "center",
    marginTop: 10,
    color: "#777",
  },

  input: {
    fontFamily: "Ukrainian-Regular",
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
    padding: 10,
    borderRadius: 8,
  },

  textArea: {
    fontFamily: "Ukrainian-Regular",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    height: 120,
    borderRadius: 8,
    textAlignVertical: "top",
    marginBottom: 20,
  },

  categoryTitle: {
    fontFamily: "Ukrainian-Regular",
    color: "#111",
    fontSize: 16,
  },

  categories: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 15,
  },

  categoryContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },

  categoryText: {
    fontFamily: "Ukrainian-Regular",
    color: "#000",
  },

  categoryTextSelected: {
    fontFamily: "Ukrainian-Regular",
    color: "#fff",
  },

  category: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 20,
  },

  categorySelected: {
    backgroundColor: "#000",
  },

  submit: {
    backgroundColor: "#000",
    padding: 15,
    alignItems: "center",
    borderRadius: 30,
    marginBottom: 25,
  },

  submitDisabled: {
    opacity: 0.5,
  },

  submitText: {
    color: "#fff",
    fontFamily: "Ukrainian-Regular",
  },

  mapButton: {
    backgroundColor: "#111",
    padding: 12,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 10,
  },

  mapButtonText: {
    color: "#fff",
    fontFamily: "Ukrainian-Regular",
  },

  titleWrapper: {
    alignItems: "center",
    marginVertical: 20,
  },

  title: {
    fontFamily: "Ukrainian-Bold",
    color: "#111",
    fontSize: 20,
  },
});
