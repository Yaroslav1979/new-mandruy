import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
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
import categories from "../../constants/categories";
import PlaceCategory from "../../components/PlaceCategory";
import StarRating from "../../components/star-rating";
import Reviews from "../../components/reviews/reviewItem/reviewsAll";
import { Review } from "../../components/reviews/reviewItem/typesReviews";

const { width } = Dimensions.get("window");

export default function PlaceDetails() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const placeId = Array.isArray(id) ? id[0] : id;

  const [place, setPlace] = useState<any>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reviewsList, setReviewsList] = useState<Review[]>([]);

  const { token, loading } = useAuth();

  const fetchPlace = async () => {
    try {
      const response = await fetch(`${API_URL}/api/places/${placeId}`);
      const data = await response.json();
      setPlace(data);
    } catch (error) {
      console.error("Помилка отримання місця:", error);
    }
  };

  const fetchReviews = async () => {
    if (!id) return;

    try {
      const res = await fetch(`${API_URL}/api/places/${placeId}/reviews`);
      const data = await res.json();
      setReviewsList(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Помилка відгуків:", e);
    }
  };

  useEffect(() => {
    if (placeId) {
      fetchPlace();
      fetchReviews();
    }
  }, [id]);

  if (loading || !place) {
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
        <StarRating rating={Number(place.rating) || 0} />

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

        <View style={styles.categoriesContainer}>
          {place.categoryIds?.map((catId: string) => {
            const category = categories.find((c) => c.id === catId);
            if (!category) return null;

            return (
              <PlaceCategory
                key={category.id}
                title={category.title}
                Icon={category.icon}
              />
            );
          })}
        </View>

        <Reviews
          reviews={reviewsList}
          placeId={place._id}
          onReviewAdded={() => {
            fetchReviews();
            fetchPlace();
          }}
          isAuthenticated={!!token}
          totalRating={Number(place.rating) || 0}
        />

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
    fontFamily: "Ukrainian-Bold",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 15,
  },

  image: {
    marginTop: 10,
    width: width - 32,
    height: 250,
    borderRadius: 12,
    marginRight: 16,
  },

  description: {
    fontFamily: "Ukrainian-Regular",
    marginTop: 20,
    fontSize: 15,
    lineHeight: 22,
  },

  info: {
    fontFamily: "Ukrainian-Regular",
    marginTop: 10,
    fontSize: 14,
  },

  bold: {
    fontFamily: "Ukrainian-Bold",
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

  categoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 20,
  },

  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "#E7E6ED",
    backgroundColor: "#fff",
    gap: 5,
  },

  categoryIcon: {
    width: 19,
    height: 20,
    marginRight: 10,
  },

  categoryText: {
    fontFamily: "Ukrainian-Regular",
    fontSize: 14,
    fontWeight: "500",
  },
});
