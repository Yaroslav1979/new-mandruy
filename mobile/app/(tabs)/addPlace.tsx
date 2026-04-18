import ParallaxScrollView from "@/components/parallax-scroll-view";
import { HeaderHatContent } from "../../components/HeaderHatContent";
import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  Pressable,
  Image,
  ScrollView,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { MapPickerModal } from "../../components/MapPickerModal";
import { useAuth } from "../../context/AuthContext";
import { API_URL } from "@/constants/api";
import * as ImageManipulator from "expo-image-manipulator";

const categories = [
  { id: "Табір", title: "Табір" },
  { id: "Мандрівка", title: "Мандрівка" },
  { id: "Питна вода", title: "Питна вода" },
  { id: "Памʼятка", title: "Памʼятка" },
  { id: "Музей", title: "Музей" },
  { id: "Водойма", title: "Водойма" },
  { id: "Автомобіль", title: "Автомобіль" },
];

export default function AddPlaceScreen() {
  const { token } = useAuth();

  const [title, setTitle] = useState("");
  const [coordinate, setCoordinate] = useState("");
  const [mapVisible, setMapVisible] = useState(false);

  const [region, setRegion] = useState("");
  const [city, setCity] = useState("");
  const [descr, setDescr] = useState("");

  const [images, setImages] = useState<{ uri: string; type: string }[]>([]);
  const [categoryIds, setCategoryIds] = useState<string[]>([]);

  // 📸 вибір фото
  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets) {
      const converted = await Promise.all(
        result.assets.map(async (asset) => {
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
          };
        }),
      );

      setImages((prev) => [...prev, ...converted].slice(0, 10));
    }
  };

  // ❌ видалення фото
  const removeImage = (index: number) => {
    const updated = [...images];
    updated.splice(index, 1);
    setImages(updated);
  };

  // 🟢 категорії
  const toggleCategory = (id: string) => {
    setCategoryIds((prev: string[]) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  // 🚀 submit
  const handleSubmit = async () => {
    if (!title || !coordinate || !region || !city || !descr) {
      alert("Заповніть всі поля");
      return;
    }

    if (images.length === 0) {
      alert("Додайте фото");
      return;
    }

    if (categoryIds.length === 0) {
      alert("Оберіть категорії");
      return;
    }

    const formData = new FormData();

    formData.append("title", title);
    formData.append("coordinate", coordinate);
    formData.append("region", region);
    formData.append("city", city);
    formData.append("descr", descr);
    formData.append("categoryIds", JSON.stringify(categoryIds));

    images.forEach((img, index) => {
      formData.append("images", {
        uri: img.uri,
        name: `photo_${index}.jpg`,
        type: "image/jpeg",
      } as any);
    });

    try {
      const res = await fetch(`${API_URL}/api/places`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const text = await res.text(); // ← важливо

      console.log("STATUS:", res.status);
      console.log("RESPONSE:", text);

      if (!res.ok) {
        throw new Error(text);
      }

      alert("Успішно додано");
    } catch (err: any) {
      console.log("ERROR:", err);
      alert("Помилка: " + err.message);
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#fff", dark: "#1D3D47" }}
      headerHeight={50}
      headerImage={<View />}
    >
      <View style={styles.header}>
        <HeaderHatContent
          containerStyle={{
            gap: 50,
            marginTop: 0,
          }}
          logoWidth={150}
        />
      </View>

      <ScrollView style={styles.container}>
        <View style={styles.titleWrapper}>
          <Text style={styles.title}>ДОДАТИ МІСЦЕ</Text>
        </View>
        {/* 📸 ФОТО */}
        <View style={styles.uploadBox}>
          <Pressable onPress={pickImages} style={styles.uploadArea}>
            {images.length === 0 && (
              <Text style={styles.uploadText}>Обрати фото...</Text>
            )}

            <View style={styles.imagesGrid}>
              {images.slice(0, 4).map((img, i) => (
                <View key={i} style={styles.imageWrapper}>
                  <Image source={{ uri: img.uri }} style={styles.image} />
                  <Pressable
                    style={styles.deleteBtn}
                    onPress={() => removeImage(i)}
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
          </Pressable>
        </View>

        {/* INPUTS */}
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

        {/* 🏷 КАТЕГОРІЇ */}
        <View style={styles.categories}>
          {categories.map((cat) => (
            <Pressable
              key={cat.id}
              onPress={() => toggleCategory(cat.id)}
              style={[
                styles.category,
                categoryIds.includes(cat.id) && styles.categorySelected,
              ]}
            >
              <Text
                style={{
                  color: categoryIds.includes(cat.id) ? "#fff" : "#000",
                  fontFamily: "Ukrainian-Regular",
                }}
              >
                {cat.title}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* 📝 ОПИС */}
        <TextInput
          placeholder="Короткий опис"
          multiline
          value={descr}
          onChangeText={setDescr}
          style={styles.textArea}
        />

        {/* 🚀 SUBMIT */}
        <Pressable style={styles.submit} onPress={handleSubmit}>
          <Text style={{ color: "#fff", fontFamily: "Ukrainian-Regular" }}>
            Надіслати
          </Text>
        </Pressable>
      </ScrollView>
    </ParallaxScrollView>
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

  categories: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 15,
  },

  category: {
    fontFamily: "Ukrainian-Regular",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 20,
  },

  categorySelected: {
    fontFamily: "Ukrainian-Regular",
    backgroundColor: "#000",
  },

  submit: {
    fontFamily: "Ukrainian-Regular",
    backgroundColor: "#000",
    padding: 15,
    alignItems: "center",
    borderRadius: 30,
  },

  header: {
    fontFamily: "Ukrainian-Regular",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#111",
    padding: 10,
    alignItems: "center",
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

  modal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00000090",
  },

  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 15,
    gap: 15,
  },

  modalTitle: {
    fontFamily: "Ukrainian-Regular",
    fontSize: 20,
    textAlign: "center",
  },

  success: {
    fontFamily: "Ukrainian-Regular",
    fontSize: 22,
    textAlign: "center",
    color: "green",
  },

  error: {
    fontFamily: "Ukrainian-Regular",
    fontSize: 20,
    textAlign: "center",
    color: "red",
  },

  formBlock: {
    flex: 1,
    gap: 20,
  },

  label: {
    fontFamily: "Ukrainian-Regular",
    color: "#eee",
    fontSize: 15,
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
});
