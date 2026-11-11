import { useCallback, useEffect, useRef, useState } from "react";
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

export default function FavoritesPlaces() {
  const { token, loading: authLoading } = useAuth();
  const { favoriteIds } = useFavorites();

  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Допомагає не застосовувати застарілі відповіді сервера.
  const requestId = useRef(0);

  const fetchFavorites = useCallback(async () => {
    if (authLoading) return;

    if (!token) {
      setPlaces([]);
      setLoading(false);
      setRefreshing(false);
      return;
    }

    const currentRequestId = ++requestId.current;

    try {
      const response = await fetch(`${API_URL}/api/places/favorites`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Не вдалося отримати обране");
      }

      const data = await response.json();

      // Ігноруємо відповідь старішого запиту.
      if (currentRequestId !== requestId.current) return;

      setPlaces(Array.isArray(data) ? data : []);
    } catch (error) {
      if (currentRequestId !== requestId.current) return;

      console.error("Помилка завантаження обраного:", error);
      Alert.alert("Помилка", "Не вдалося завантажити обране.");
    } finally {
      if (currentRequestId === requestId.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, [token, authLoading]);

  // Завантажуємо список при відкритті та при кожній зміні обраного.
  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites, favoriteIds]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchFavorites();
  };

  // Фільтруємо список за спільним станом контексту.
  const visiblePlaces = places.filter((place) =>
    favoriteIds.includes(place._id),
  );

  if (loading || authLoading) {
    return (
      <ActivityIndicator size="large" color="#111" style={styles.loader} />
    );
  }

  return (
    <FlatList
      data={visiblePlaces}
      keyExtractor={(item) => item._id}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => <PlaceCard place={item} showFavorite />}
      ListEmptyComponent={
        <Text style={styles.empty}>У вас поки немає обраних місць.</Text>
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
