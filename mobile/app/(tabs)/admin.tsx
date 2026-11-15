import { useCallback, useEffect, useState, ReactNode } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  useWindowDimensions,
} from "react-native";
import { Redirect, router } from "expo-router";
import { API_URL } from "../../constants/api";
import { useAuth } from "@/context/AuthContext";
import { HeaderHatContent } from "../../components/HeaderHatContent";

interface PlaceLocation {
  region?: string;
  city?: string;
  coordinate?: string;
}

interface PendingPlaceChanges {
  title?: string;
  descr?: string;
  imgUrls?: string[];
  categoryIds?: string[];
  location?: PlaceLocation;
}

interface AdminPlace {
  _id: string;
  title: string;
  descr?: string;
  imgUrls: string[];
  rating?: number;
  categoryIds?: string[];
  location?: PlaceLocation;
  createdAt?: string;
  pendingChanges?: PendingPlaceChanges;
}

export default function AdminScreen() {
  const { token, user, loading: authLoading } = useAuth();
  const { width, height } = useWindowDimensions();

  const isLandscape = width > height;

  const [newPlaces, setNewPlaces] = useState<AdminPlace[]>([]);
  const [pendingChanges, setPendingChanges] = useState<AdminPlace[]>([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);

  const request = useCallback(
    async (path: string, method = "GET", body?: object) => {
      const response = await fetch(`${API_URL}/api${path}`, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          ...(body ? { "Content-Type": "application/json" } : {}),
        },
        ...(body ? { body: JSON.stringify(body) } : {}),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message || "Не вдалося виконати запит");
      }

      return data;
    },
    [token],
  );

  const fetchData = useCallback(async () => {
    try {
      const [places, changes] = await Promise.all([
        request("/places"),
        request("/places/pending-changes"),
      ]);

      setNewPlaces(Array.isArray(places) ? places : []);
      setPendingChanges(Array.isArray(changes) ? changes : []);
    } catch (error) {
      Alert.alert(
        "Помилка",
        error instanceof Error
          ? error.message
          : "Не вдалося завантажити дані модерації.",
      );
    }
  }, [request]);

  useEffect(() => {
    if (authLoading || user?.role !== "admin") return;

    const load = async () => {
      setLoading(true);
      await fetchData();
      setLoading(false);
    };

    load();
  }, [authLoading, user?.role, fetchData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const openNewPlace = (placeId: string) => {
    router.push({
      pathname: "/(tabs)/[id]",
      params: { id: placeId, previewNew: "true" },
    });
  };

  const openPublishedPlace = (placeId: string) => {
    router.push({
      pathname: "/(tabs)/[id]",
      params: { id: placeId },
    });
  };

  const openProposedChanges = (placeId: string) => {
    router.push({
      pathname: "/(tabs)/[id]",
      params: { id: placeId, previewChanges: "true" },
    });
  };

  const performAction = async (
    placeId: string,
    action: () => Promise<void>,
    successMessage: string,
  ) => {
    if (actionId) return;

    setActionId(placeId);

    try {
      await action();
      await fetchData();
      Alert.alert("Успішно", successMessage);
    } catch (error) {
      Alert.alert(
        "Помилка",
        error instanceof Error ? error.message : "Не вдалося виконати дію.",
      );
    } finally {
      setActionId(null);
    }
  };

  const confirmAction = (
    title: string,
    message: string,
    callback: () => void,
  ) => {
    Alert.alert(title, message, [
      { text: "Скасувати", style: "cancel" },
      { text: "Підтвердити", onPress: callback },
    ]);
  };

  const approvePlace = (placeId: string) => {
    confirmAction("Публікація місця", "Опублікувати це місце?", () =>
      performAction(
        placeId,
        async () => {
          await request(`/places/${placeId}`, "PATCH", {
            isApproved: true,
          });
        },
        "Місце успішно опубліковано!",
      ),
    );
  };

  const deletePlace = (placeId: string) => {
    confirmAction(
      "Видалення місця",
      "Видалити це місце? Цю дію неможливо скасувати.",
      () =>
        performAction(
          placeId,
          async () => {
            await request(`/places/${placeId}`, "DELETE");
          },
          "Місце успішно видалено!",
        ),
    );
  };

  const approveChanges = (placeId: string) => {
    confirmAction(
      "Публікація змін",
      "Погодити запропоновані зміни та опублікувати їх?",
      () =>
        performAction(
          placeId,
          async () => {
            await request(`/places/${placeId}/approve-changes`, "PATCH");
          },
          "Зміни успішно опубліковано!",
        ),
    );
  };

  const rejectChanges = (placeId: string) => {
    confirmAction("Відхилення змін", "Відхилити запропоновані зміни?", () =>
      performAction(
        placeId,
        async () => {
          await request(`/places/${placeId}/reject-changes`, "DELETE");
        },
        "Запропоновані зміни відхилено.",
      ),
    );
  };

  if (authLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#111" />
      </View>
    );
  }

  if (!token || user?.role !== "admin") {
    return <Redirect href="/" />;
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#111" />
        <Text style={styles.loadingText}>Завантаження модерації...</Text>
      </View>
    );
  }

  const renderImages = (images?: string[]) => {
    if (!images?.length) {
      return <Text style={styles.noImages}>Немає фотографій</Text>;
    }

    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.images}
      >
        {images.map((url, index) => (
          <Image
            key={`${url}-${index}`}
            source={{ uri: url }}
            style={styles.placeImage}
          />
        ))}
      </ScrollView>
    );
  };

  const renderPlaceDetails = (
    title?: string,
    descr?: string,
    images?: string[],
    location?: PlaceLocation,
  ) => (
    <View style={styles.details}>
      <Text style={styles.placeTitle}>{title || "Без назви"}</Text>

      <Text style={styles.description}>{descr || "Опис відсутній"}</Text>

      {renderImages(images)}

      {!!location && (
        <Text style={styles.location}>
          {[location.region, location.city].filter(Boolean).join(", ") ||
            "Місце розташування не вказано"}
        </Text>
      )}

      {!!location?.coordinate && (
        <Text style={styles.coordinate}>Координати: {location.coordinate}</Text>
      )}
    </View>
  );

  const renderActionButton = (
    title: string,
    color: string,
    onPress: () => void,
    disabled: boolean,
  ) => (
    <Pressable
      style={[styles.actionButton, { backgroundColor: color }]}
      onPress={onPress}
      disabled={disabled}
    >
      {disabled ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={styles.actionText}>{title}</Text>
      )}
    </Pressable>
  );

  const renderNewPlace = (place: AdminPlace) => {
    return (
      <View key={place._id} style={styles.card}>
        <Pressable
          onPress={() => openNewPlace(place._id)}
          style={styles.clickableDetails}
        >
          {renderPlaceDetails(
            place.title,
            place.descr,
            place.imgUrls,
            place.location,
          )}
        </Pressable>

        <View style={styles.actions}>
          {renderActionButton(
            "Опублікувати",
            "#238447",
            () => approvePlace(place._id),
            !!actionId,
          )}

          {renderActionButton(
            "Видалити",
            "#c62828",
            () => deletePlace(place._id),
            !!actionId,
          )}
        </View>
      </View>
    );
  };

  const renderPendingChange = (place: AdminPlace) => {
    const changes = place.pendingChanges;

    if (!changes) return null;

    return (
      <View key={place._id} style={styles.card}>
        <Text style={styles.versionTitle}>Опублікована версія</Text>

        <Pressable
          onPress={() => openPublishedPlace(place._id)}
          style={styles.clickableDetails}
        >
          {renderPlaceDetails(
            place.title,
            place.descr,
            place.imgUrls,
            place.location,
          )}
        </Pressable>

        <View style={styles.versionDivider} />

        <Text style={styles.versionTitle}>Запропоновані зміни</Text>

        <Pressable
          onPress={() => openProposedChanges(place._id)}
          style={styles.clickableDetails}
        >
          {renderPlaceDetails(
            changes.title ?? place.title,
            changes.descr ?? place.descr,
            changes.imgUrls ?? place.imgUrls,
            changes.location ?? place.location,
          )}
        </Pressable>

        <View style={styles.actions}>
          {renderActionButton(
            "Погодити",
            "#238447",
            () => approveChanges(place._id),
            !!actionId,
          )}

          {renderActionButton(
            "Відхилити",
            "#c62828",
            () => rejectChanges(place._id),
            !!actionId,
          )}
        </View>
      </View>
    );
  };

  const renderSection = (title: string, count: number, content: ReactNode) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{count}</Text>
        </View>
      </View>

      {content}
    </View>
  );

  return (
    <View style={styles.screen}>
      {/* Нерухома шапка */}
      <View style={[styles.header, isLandscape && styles.headerLandscape]}>
        <HeaderHatContent
          containerStyle={{
            gap: 50,
            marginTop: 0,
          }}
          logoWidth={150}
        />
      </View>

      {/* Прокручується тільки вміст */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.titleWrapper}>
          <Text style={styles.heading}>АДМІНІСТРУВАННЯ</Text>
        </View>

        <View
          style={[
            styles.sectionsContainer,
            isLandscape && styles.landscapeContainer,
          ]}
        >
          {renderSection(
            "Нові місця",
            newPlaces.length,
            newPlaces.length ? (
              newPlaces.map(renderNewPlace)
            ) : (
              <Text style={styles.emptyText}>
                Немає нових місць, які очікують модерації.
              </Text>
            ),
          )}

          {renderSection(
            "Зміни опублікованих місць",
            pendingChanges.length,
            pendingChanges.length ? (
              pendingChanges.map(renderPendingChange)
            ) : (
              <Text style={styles.emptyText}>
                Немає змін, які очікують модерації.
              </Text>
            ),
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },

  scrollView: {
    flex: 1,
  },

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

  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },

  titleWrapper: {
    alignItems: "center",
    marginBottom: 30,
  },

  heading: {
    fontSize: 20,
    fontFamily: "Ukrainian-Bold",
    color: "#111",
  },

  sectionsContainer: {
    flexDirection: "column",
    gap: 28,
  },

  landscapeContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
  },

  section: {
    flex: 1,
    minWidth: 0,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
    gap: 8,
  },

  sectionTitle: {
    flex: 1,
    fontSize: 19,
    fontFamily: "Ukrainian-Bold",
    color: "#111",
  },

  countBadge: {
    minWidth: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },

  countText: {
    color: "#fff",
    fontFamily: "Ukrainian-Bold",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  clickableDetails: {
    borderRadius: 8,
  },

  details: {
    gap: 9,
  },

  placeTitle: {
    fontSize: 17,
    fontFamily: "Ukrainian-Bold",
    color: "#111",
  },

  description: {
    fontSize: 14,
    lineHeight: 21,
    color: "#444",
    fontFamily: "Ukrainian-Regular",
  },

  images: {
    gap: 8,
    paddingVertical: 4,
  },

  placeImage: {
    width: 145,
    height: 105,
    borderRadius: 8,
    backgroundColor: "#eee",
  },

  noImages: {
    color: "#888",
    fontFamily: "Ukrainian-Regular",
  },

  location: {
    fontSize: 13,
    color: "#555",
    fontFamily: "Ukrainian-Regular",
  },

  coordinate: {
    fontSize: 12,
    color: "#777",
    fontFamily: "Ukrainian-Regular",
  },

  versionTitle: {
    fontSize: 15,
    fontFamily: "Ukrainian-Bold",
    color: "#555",
    marginBottom: 10,
  },

  versionDivider: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 16,
  },

  actions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 14,
  },

  actionButton: {
    flex: 1,
    minHeight: 43,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
    paddingVertical: 8,
  },

  actionText: {
    color: "#fff",
    fontSize: 13,
    textAlign: "center",
    fontFamily: "Ukrainian-Bold",
  },

  emptyText: {
    color: "#777",
    fontSize: 14,
    fontFamily: "Ukrainian-Regular",
    lineHeight: 21,
    paddingVertical: 10,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    gap: 12,
  },

  loadingText: {
    color: "#555",
    fontFamily: "Ukrainian-Regular",
  },
});
