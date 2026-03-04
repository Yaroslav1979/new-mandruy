import React, { useState } from "react";
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

const { width } = Dimensions.get("window");

export default function PlaceDetailsScreen() {
  const { place } = useLocalSearchParams<{ place?: string }>();

  if (!place) {
    return (
      <View style={styles.center}>
        <Text>Дані місця не передані</Text>
      </View>
    );
  }

  const parsedPlace = JSON.parse(place);

  const [fullscreen, setFullscreen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{parsedPlace.title}</Text>

      {/* Слайдер */}
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
      >
        {parsedPlace.imgUrls?.map((img: string, index: number) => (
          <TouchableOpacity
            key={index}
            activeOpacity={0.9}
            onPress={() => {
              setCurrentIndex(index);
              setFullscreen(true);
            }}
          >
            <Image
              source={{ uri: `http://localhost:3000${img}` }}
              style={styles.image}
              contentFit="cover"
            />
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.description}>{parsedPlace.descr}</Text>

      <Text style={styles.info}>
        <Text style={styles.bold}>Місто: </Text>
        {parsedPlace.location?.city}
      </Text>

      <Text style={styles.info}>
        <Text style={styles.bold}>Регіон: </Text>
        {parsedPlace.location?.region}
      </Text>

      <Text style={styles.info}>
        <Text style={styles.bold}>Координати: </Text>
        {parsedPlace.location?.coordinate}
      </Text>

      {/* FULLSCREEN */}
      <Modal visible={fullscreen} transparent>
        <View style={styles.fullscreenContainer}>
          <Image
            source={{
              uri: `http://localhost:3000${parsedPlace.imgUrls[currentIndex]}`,
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
  );
}

const styles = StyleSheet.create({
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
