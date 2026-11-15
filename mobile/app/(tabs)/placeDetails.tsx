import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Modal,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";

import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { API_URL } from "../../constants/api";
import { HeaderHatContent } from "../../components/HeaderHatContent";
import categories from "../../constants/categories";
import PlaceCategory from "../../components/PlaceCategory";
import StarRating from "../../components/star-rating";
import Reviews from "./../../components/reviews/reviewsAll";
import { Review } from "../../components/reviews/reviewItem/typesReviews";

const { width: screenWidth } = Dimensions.get("window");

export default function PlaceDetails() {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const { id, previewNew, previewChanges } = useLocalSearchParams<{
    id?: string;
    previewNew?: string;
    previewChanges?: string;
  }>();

  const placeId = Array.isArray(id) ? id[0] : id;
  const isNewPlacePreview = previewNew === "true";
  const isChangesPreview = previewChanges === "true";
  const isAdminPreview = isNewPlacePreview || isChangesPreview;

  const [place, setPlace] = useState<any>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reviewsList, setReviewsList] = useState<Review[]>([]);
  const [error, setError] = useState<string | null>(null);

  const { token, loading } = useAuth();

  const fetchPlace = useCallback(async () => {
    if (!placeId) return;

    try {
      setError(null);

      let response: Response;
      let data: any;

      if (isNewPlacePreview) {
        // Отримуємо список нових місць, доступний адміністратору
        response = await fetch(`${API_URL}/api/places`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Не вдалося отримати нове місце");
        }

        const places = await response.json();

        data = Array.isArray(places)
          ? places.find((item: any) => item._id === placeId)
          : null;
      } else if (isChangesPreview) {
        // Отримуємо список місць із запропонованими змінами
        response = await fetch(`${API_URL}/api/places/pending-changes`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Не вдалося отримати запропоновані зміни");
        }

        const places = await response.json();

        const originalPlace = Array.isArray(places)
          ? places.find((item: any) => item._id === placeId)
          : null;

        if (originalPlace?.pendingChanges) {
          // Об'єднуємо опубліковані дані із запропонованими.
          // Значення із pendingChanges мають пріоритет.
          data = {
            ...originalPlace,
            ...originalPlace.pendingChanges,
            _id: originalPlace._id,
            rating: originalPlace.rating,
            pendingChanges: originalPlace.pendingChanges,
          };
        } else {
          data = null;
        }
      } else {
        // Звичайне відкриття опублікованого місця
        response = await fetch(`${API_URL}/api/places/${placeId}`);

        if (!response.ok) {
          throw new Error("Не вдалося отримати місце");
        }

        data = await response.json();
      }

      if (!data) {
        throw new Error("Місце не знайдено");
      }

      setPlace(data);
      setCurrentIndex(0);
    } catch (error) {
      console.error("Помилка отримання місця:", error);

      setError(
        error instanceof Error ? error.message : "Не вдалося завантажити місце",
      );
    }
  }, [placeId, isNewPlacePreview, isChangesPreview, token]);

  const fetchReviews = useCallback(async () => {
    if (!placeId || isNewPlacePreview) return;

    try {
      const response = await fetch(`${API_URL}/api/places/${placeId}/reviews`);

      if (!response.ok) {
        throw new Error("Не вдалося отримати відгуки");
      }

      const data = await response.json();
      setReviewsList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Помилка відгуків:", error);
    }
  }, [placeId, isNewPlacePreview]);

  useEffect(() => {
    if (loading) return;

    fetchPlace();
    fetchReviews();
  }, [loading, fetchPlace, fetchReviews]);

  if (loading || (!place && !error)) {
    return (
      <View style={styles.center}>
        <Text>Завантаження...</Text>
      </View>
    );
  }

  if (!place) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>
          {error || "Не вдалося завантажити місце"}
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={[styles.header, isLandscape && styles.headerLandscape]}>
        <HeaderHatContent
          containerStyle={{
            gap: 50,
            marginTop: 0,
          }}
          logoWidth={150}
        />
      </View>

      <ScrollView style={styles.container}>
        {isAdminPreview && (
          <View style={styles.previewNotice}>
            <Ionicons name="eye-outline" size={19} color="#8a6414" />

            <Text style={styles.previewNoticeText}>
              {isNewPlacePreview
                ? "Попередній перегляд нового місця"
                : "Попередній перегляд запропонованих змін"}
            </Text>
          </View>
        )}

        <Text style={styles.title}>{place.title}</Text>

        <StarRating rating={Number(place.rating) || 0} />

        {!!place.imgUrls?.length && (
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / width);
              setCurrentIndex(index);
            }}
          >
            {place.imgUrls.map((img: string, index: number) => (
              <TouchableOpacity
                key={`${img}-${index}`}
                activeOpacity={0.9}
                onPress={() => {
                  setCurrentIndex(index);
                  setFullscreen(true);
                }}
              >
                <Image
                  source={{ uri: img }}
                  style={styles.image}
                  contentFit="cover"
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {!place.imgUrls?.length && (
          <Text style={styles.noImages}>Немає фотографій</Text>
        )}

        <Text style={styles.description}>
          {place.descr || "Опис відсутній"}
        </Text>

        <Text style={styles.info}>
          <Text style={styles.bold}>Місто: </Text>
          {place.location?.city || "Не вказано"}
        </Text>

        <Text style={styles.info}>
          <Text style={styles.bold}>Регіон: </Text>
          {place.location?.region || "Не вказано"}
        </Text>

        <Text style={styles.info}>
          <Text style={styles.bold}>Координати: </Text>
          {place.location?.coordinate || "Не вказано"}
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

        {!isNewPlacePreview && (
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
        )}

        <Modal
          visible={fullscreen}
          transparent
          supportedOrientations={["portrait", "landscape"]}
          onRequestClose={() => setFullscreen(false)}
        >
          <View style={styles.fullscreenContainer}>
            {!!place.imgUrls?.[currentIndex] && (
              <Image
                source={{
                  uri: place.imgUrls[currentIndex],
                }}
                style={styles.fullscreenImage}
                contentFit="contain"
              />
            )}

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
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#111",
    padding: 10,
    alignItems: "center",
    marginTop: 50,
  },

  headerLandscape: {
    marginTop: 0,
  },

  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },

  previewNotice: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#fff5dc",
    borderWidth: 1,
    borderColor: "#ead49b",
    borderRadius: 8,
    padding: 11,
    marginBottom: 18,
  },

  previewNoticeText: {
    flex: 1,
    color: "#8a6414",
    fontFamily: "Ukrainian-Bold",
    fontSize: 13,
  },

  title: {
    fontFamily: "Ukrainian-Bold",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 15,
  },

  image: {
    marginTop: 10,
    width: screenWidth - 32,
    height: 250,
    borderRadius: 12,
    marginRight: 16,
  },

  noImages: {
    marginTop: 15,
    color: "#777",
    fontFamily: "Ukrainian-Regular",
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
    padding: 20,
  },

  errorText: {
    color: "#c62828",
    fontFamily: "Ukrainian-Regular",
    textAlign: "center",
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
