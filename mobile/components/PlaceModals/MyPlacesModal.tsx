import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
} from "react-native";

import { API_URL } from "../../constants/api";
import { useAuth } from "@/context/AuthContext";
import { useFavorites } from "@/context/FavoritesContext";
import PlaceCard, { Place } from "../PlaceCard";

interface MyPlacesProps {
  onEdit: (place: Place) => void;
  refreshKey?: number;
}

export default function MyPlaces({ onEdit, refreshKey = 0 }: MyPlacesProps) {
  const { token, loading: authLoading } = useAuth();
  const { removeFavoriteLocally } = useFavorites();

  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMyPlaces = useCallback(async () => {
    if (authLoading) return;

    if (!token) {
      setPlaces([]);
      setLoading(false);
      setRefreshing(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/places/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Не вдалося отримати місця");
      }

      const data = await response.json();
      setPlaces(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Помилка завантаження моїх місць:", error);
      Alert.alert("Помилка", "Не вдалося завантажити ваші місця.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token, authLoading]);

  useEffect(() => {
    fetchMyPlaces();
  }, [fetchMyPlaces, refreshKey]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchMyPlaces();
  };

  const deletePlace = (placeId: string) => {
    Alert.alert("Видалення місця", "Ви дійсно хочете видалити це місце?", [
      {
        text: "Скасувати",
        style: "cancel",
      },
      {
        text: "Видалити",
        style: "destructive",
        onPress: async () => {
          try {
            const response = await fetch(`${API_URL}/api/places/${placeId}`, {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            if (!response.ok) {
              throw new Error("Не вдалося видалити місце");
            }

            setPlaces((prev) => prev.filter((place) => place._id !== placeId));

            // Прибираємо видалене місце зі спільного обраного.
            removeFavoriteLocally(placeId);

            Alert.alert("Успішно", "Місце видалено.");
          } catch (error) {
            console.error("Помилка видалення місця:", error);
            Alert.alert("Помилка", "Не вдалося видалити місце.");
          }
        },
      },
    ]);
  };

  if (loading || authLoading) {
    return (
      <ActivityIndicator size="large" color="#111" style={styles.loader} />
    );
  }

  return (
    <FlatList
      data={places}
      keyExtractor={(item) => item._id}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <PlaceCard
          place={item}
          onEdit={onEdit}
          onDelete={deletePlace}
          showFavorite
        />
      )}
      ListEmptyComponent={
        <Text style={styles.empty}>Ви ще не додали жодного місця.</Text>
      }
      refreshing={refreshing}
      onRefresh={handleRefresh}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 15,
    paddingBottom: 30,
    flexGrow: 1,
  },

  loader: {
    marginTop: 50,
  },

  empty: {
    textAlign: "center",
    marginTop: 50,
    fontFamily: "Ukrainian-Regular",
    fontSize: 16,
    color: "#555",
  },
});
