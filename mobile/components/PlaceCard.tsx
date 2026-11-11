import { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { useFavorites } from "@/context/FavoritesContext";
import StarRating from "./star-rating";

export interface Place {
  _id: string;
  title: string;
  imgUrls: string[];
  rating: number;
  categoryIds?: string[];
  createdAt?: string;
  location?: {
    region?: string;
    city?: string;
  };
}

interface PlaceCardProps {
  place: Place;
  onEdit?: (place: Place) => void;
  onDelete?: (placeId: string) => void;
  showFavorite?: boolean;
}

export default function PlaceCard({
  place,
  onEdit,
  onDelete,
  showFavorite = true,
}: PlaceCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();

  const [favoriteLoading, setFavoriteLoading] = useState(false);

  const favorite = isFavorite(place._id);

  const openPlace = () => {
    router.push({
      pathname: "/placeDetails",
      params: {
        id: place._id,
      },
    });
  };

  const handleToggleFavorite = async () => {
    if (favoriteLoading) return;

    setFavoriteLoading(true);

    try {
      await toggleFavorite(place._id);
    } finally {
      setFavoriteLoading(false);
    }
  };

  return (
    <View style={styles.card}>
      <Pressable onPress={openPlace} style={styles.cardContent}>
        <View style={styles.imageWrapper}>
          {place.imgUrls?.length > 0 ? (
            <Image source={{ uri: place.imgUrls[0] }} style={styles.image} />
          ) : (
            <View style={styles.noImage}>
              <Text style={styles.noImageText}>Немає фото</Text>
            </View>
          )}
        </View>

        <Text style={styles.title} numberOfLines={2}>
          {place.title}
        </Text>

        <View style={styles.info}>
          <Text style={styles.region} numberOfLines={1}>
            {place.location?.region || place.location?.city || ""}
          </Text>

          <StarRating rating={Number(place.rating) || 0} />
        </View>
      </Pressable>

      {showFavorite && (
        <Pressable
          style={styles.heartButton}
          onPress={handleToggleFavorite}
          disabled={favoriteLoading}
          hitSlop={8}
        >
          <Text style={styles.heart}>{favorite ? "♥" : "♡"}</Text>
        </Pressable>
      )}

      {(onEdit || onDelete) && (
        <View style={styles.actions}>
          {onEdit && (
            <Pressable style={styles.editButton} onPress={() => onEdit(place)}>
              <Text style={styles.actionText}>Редагувати</Text>
            </Pressable>
          )}

          {onDelete && (
            <Pressable
              style={styles.deleteButton}
              onPress={() => onDelete(place._id)}
            >
              <Text style={styles.actionText}>Видалити</Text>
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    position: "relative",
  },

  cardContent: {
    gap: 5,
  },

  imageWrapper: {
    width: "100%",
    aspectRatio: 16 / 9,
  },

  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },

  noImage: {
    flex: 1,
    backgroundColor: "#eee",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  noImageText: {
    color: "#777",
    fontFamily: "Ukrainian-Regular",
  },

  title: {
    fontSize: 18,
    fontFamily: "Ukrainian-Bold",
    marginTop: 5,
    paddingRight: 30,
  },

  info: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },

  region: {
    fontSize: 14,
    color: "#555",
    fontFamily: "Ukrainian-Regular",
    flex: 1,
  },

  heartButton: {
    position: "absolute",
    top: 20,
    right: 20,
    width: 40,
    height: 40,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },

  heart: {
    color: "#e32636",
    fontSize: 30,
    lineHeight: 35,
  },

  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginTop: 12,
  },

  editButton: {
    flex: 1,
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },

  deleteButton: {
    flex: 1,
    backgroundColor: "#a52a2a",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },

  actionText: {
    color: "#fff",
    fontFamily: "Ukrainian-Bold",
    fontSize: 13,
  },
});
