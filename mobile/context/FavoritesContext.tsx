import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Alert } from "react-native";
import { API_URL } from "@/constants/api";
import { useAuth } from "@/context/AuthContext";

interface FavoritesContextType {
  favoriteIds: string[];
  loading: boolean;
  isFavorite: (placeId: string) => boolean;
  toggleFavorite: (placeId: string) => Promise<boolean>;
  removeFavoriteLocally: (placeId: string) => void;
  refreshFavorites: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined,
);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { token, loading: authLoading } = useAuth();

  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Не дозволяємо одночасно відправляти кілька запитів
  // для одного й того самого місця.
  const pendingIds = useRef(new Set<string>());

  const refreshFavorites = useCallback(async () => {
    if (authLoading) return;

    if (!token) {
      setFavoriteIds([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/places/favorites`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Не вдалося завантажити обране");
      }

      const data = await response.json();

      setFavoriteIds(data.map((place: { _id: string }) => place._id));
    } catch (error) {
      console.error("Помилка завантаження обраного:", error);
    } finally {
      setLoading(false);
    }
  }, [token, authLoading]);

  useEffect(() => {
    refreshFavorites();
  }, [refreshFavorites]);

  const isFavorite = useCallback(
    (placeId: string) => favoriteIds.includes(placeId),
    [favoriteIds],
  );

  const toggleFavorite = useCallback(
    async (placeId: string): Promise<boolean> => {
      if (!token) {
        Alert.alert(
          "Авторизація",
          "Увійдіть в обліковий запис, щоб додавати місця в обране.",
        );
        return false;
      }

      if (pendingIds.current.has(placeId)) {
        return false;
      }

      const wasFavorite = favoriteIds.includes(placeId);

      pendingIds.current.add(placeId);

      // Миттєво змінюємо стан у всьому застосунку.
      setFavoriteIds((prev) =>
        wasFavorite ? prev.filter((id) => id !== placeId) : [...prev, placeId],
      );

      try {
        const response = await fetch(
          `${API_URL}/api/places/${placeId}/favorite`,
          {
            method: wasFavorite ? "DELETE" : "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error("Не вдалося змінити обране");
        }

        return true;
      } catch (error) {
        console.error("Помилка зміни обраного:", error);

        // Якщо сервер відхилив запит — повертаємо попередній стан.
        setFavoriteIds((prev) => {
          if (wasFavorite) {
            return prev.includes(placeId) ? prev : [...prev, placeId];
          }

          return prev.filter((id) => id !== placeId);
        });

        Alert.alert(
          "Помилка",
          "Не вдалося змінити список обраного. Спробуйте ще раз.",
        );

        return false;
      } finally {
        pendingIds.current.delete(placeId);
      }
    },
    [token, favoriteIds],
  );

  const removeFavoriteLocally = useCallback((placeId: string) => {
    setFavoriteIds((prev) => prev.filter((id) => id !== placeId));
  }, []);

  return (
    <FavoritesContext.Provider
      value={{
        favoriteIds,
        loading,
        isFavorite,
        toggleFavorite,
        removeFavoriteLocally,
        refreshFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error(
      "useFavorites потрібно використовувати всередині FavoritesProvider",
    );
  }

  return context;
}
