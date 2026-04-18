// components/MapPickerModal.tsx
import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  StyleSheet,
  Text,
  Pressable,
  ActivityIndicator,
} from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import * as Location from "expo-location";

type Props = {
  visible: boolean;
  onClose: () => void;
  onSelect: (coordinate: string) => void;
  initialCoordinate?: string;
};

export const MapPickerModal = ({
  visible,
  onClose,
  onSelect,
  initialCoordinate,
}: Props) => {
  const [region, setRegion] = useState<Region | null>(null);
  const [marker, setMarker] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  // Парсинг координат, якщо вони вже існують
  const parseCoordinate = (coord?: string) => {
    if (!coord) return null;
    const [lat, lng] = coord.split(",").map((c) => parseFloat(c.trim()));
    if (isNaN(lat) || isNaN(lng)) return null;
    return { latitude: lat, longitude: lng };
  };

  useEffect(() => {
    if (!visible) return;

    const initLocation = async () => {
      setLoading(true);

      // Якщо координати вже були введені — використовуємо їх
      const parsed = parseCoordinate(initialCoordinate);
      if (parsed) {
        setRegion({
          ...parsed,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
        setMarker(parsed);
        setLoading(false);
        return;
      }

      // Отримання поточної локації користувача
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        // Якщо доступ не надано — центр на Львові
        const defaultCoords = { latitude: 49.8397, longitude: 24.0297 };
        setRegion({
          ...defaultCoords,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
        setMarker(defaultCoords);
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      setRegion({
        ...coords,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      setMarker(coords);
      setLoading(false);
    };

    initLocation();
  }, [visible]);

  const handleConfirm = () => {
    if (!marker) return;
    const coordinateString = `${marker.latitude.toFixed(
      6,
    )}, ${marker.longitude.toFixed(6)}`;
    onSelect(coordinateString);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        {loading || !region ? (
          <ActivityIndicator size="large" style={{ flex: 1 }} />
        ) : (
          <MapView
            style={styles.map}
            initialRegion={region}
            onPress={(e) => setMarker(e.nativeEvent.coordinate)}
          >
            {marker && (
              <Marker
                coordinate={marker}
                draggable
                onDragEnd={(e) => setMarker(e.nativeEvent.coordinate)}
              />
            )}
          </MapView>
        )}

        <View style={styles.actions}>
          <Pressable style={styles.button} onPress={handleConfirm}>
            <Text style={styles.buttonText}>ОК</Text>
          </Pressable>
          <Pressable
            style={[styles.button, styles.cancelButton]}
            onPress={onClose}
          >
            <Text style={styles.buttonText}>Скасувати</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 15,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#111",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  cancelButton: {
    backgroundColor: "#888",
  },
  buttonText: {
    color: "#fff",
    fontFamily: "Ukrainian-Regular",
  },
});
