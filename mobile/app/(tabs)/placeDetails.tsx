import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Modal,
  TouchableOpacity,
} from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { API_URL } from "../../constants/api";
import { HeaderHatContent } from "../../components/HeaderHatContent";

const { width } = Dimensions.get("window");

export default function PlaceDetails() {
  const { id } = useLocalSearchParams<{ id?: string }>();

  const [place, setPlace] = useState<any>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(
    () => {
      if (id) {
        fetchPlace();
      }
    },
    //  [id]
  );

  const fetchPlace = async () => {
    try {
      const response = await fetch(`${API_URL}/api/places/${id}`);
      const data = await response.json();
      setPlace(data);
    } catch (error) {
      console.error("Помилка отримання місця:", error);
    }
  };

  if (!place) {
    return (
      <View style={styles.center}>
        <Text>Завантаження...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, marginTop: 30 }}>
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
        <Text style={styles.title}>{place.title}</Text>

        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) => {
            const index = Math.round(e.nativeEvent.contentOffset.x / width);
            setCurrentIndex(index);
          }}
        >
          {place.imgUrls?.map((img: string, index: number) => (
            <TouchableOpacity
              key={index}
              activeOpacity={0.9}
              onPress={() => {
                setCurrentIndex(index);
                setFullscreen(true);
              }}
            >
              <Image
                source={{ uri: `${API_URL}${img}` }}
                style={styles.image}
                contentFit="cover"
              />
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.description}>{place.descr}</Text>

        <Text style={styles.info}>
          <Text style={styles.bold}>Місто: </Text>
          {place.location?.city}
        </Text>

        <Text style={styles.info}>
          <Text style={styles.bold}>Регіон: </Text>
          {place.location?.region}
        </Text>

        <Text style={styles.info}>
          <Text style={styles.bold}>Координати: </Text>
          {place.location?.coordinate}
        </Text>

        <Modal visible={fullscreen} transparent>
          <View style={styles.fullscreenContainer}>
            <Image
              source={{
                uri: `${API_URL}${place.imgUrls[currentIndex]}`,
              }}
              style={styles.fullscreenImage}
              contentFit="contain"
            />

            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setFullscreen(false)}
            >
              <Ionicons name="close" size={30} color="white" />
            </TouchableOpacity>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#111",
    padding: 10,
    marginTop: 20,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 15,
  },

  image: {
    width: width - 32,
    height: 250,
    borderRadius: 12,
    marginRight: 16,
  },

  description: {
    marginTop: 20,
    fontSize: 15,
    lineHeight: 22,
  },

  info: {
    marginTop: 10,
    fontSize: 14,
  },

  bold: {
    fontWeight: "700",
  },

  fullscreenContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.95)",
    justifyContent: "center",
    alignItems: "center",
  },

  fullscreenImage: {
    width: "100%",
    height: "80%",
  },

  closeBtn: {
    position: "absolute",
    top: 50,
    right: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
