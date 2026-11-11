import {
  Modal,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { HeaderHatContent } from "../../components/HeaderHatContent";
import { PortalProvider } from "@gorhom/portal";
// import { useAuth } from "@/context/AuthContext";
import MyPlaces from "../../components/PlaceModals/MyPlacesModal";
import { useState } from "react";

import { PlaceForm } from "@/components/PlaceForm";

import { Place } from "../../components/PlaceCard";
import { CloseButton } from "../../components/close-btn";

export default function LoginScreen() {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const [editingPlace, setEditingPlace] = useState<Place | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleEditSuccess = () => {
    setEditingPlace(null);
    setRefreshKey((prev) => prev + 1);
  };
  return (
    <PortalProvider>
      <View style={[styles.header, isLandscape && styles.headerLandscape]}>
        <HeaderHatContent
          containerStyle={{
            gap: 50,
            marginTop: 0,
          }}
          logoWidth={150}
        />
      </View>

      <View style={styles.scrollContent}>
        <View style={styles.titleWrapper}>
          <Text style={styles.title}>МОЇ МІСЦЯ</Text>
        </View>

        <MyPlaces onEdit={setEditingPlace} refreshKey={refreshKey} />
      </View>

      <Modal
        visible={!!editingPlace}
        transparent
        animationType="slide"
        onRequestClose={() => setEditingPlace(null)}
      >
        <View style={styles.editOverlay}>
          <View style={styles.editContent}>
            <CloseButton onPress={() => setEditingPlace(null)} />

            {editingPlace && (
              <PlaceForm
                mode="edit"
                place={editingPlace as any}
                onSuccess={handleEditSuccess}
              />
            )}
          </View>
        </View>
      </Modal>
    </PortalProvider>
  );
}
const styles = StyleSheet.create({
  header: {
    display: "flex",
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

  editOverlay: {
    flex: 1,
    backgroundColor: "#00000090",
    justifyContent: "center",
    alignItems: "center",
  },

  editContent: {
    width: "95%",
    maxHeight: "90%",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    overflow: "hidden",
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },

  titleWrapper: {
    alignItems: "center",
    marginBottom: 30,
  },

  title: {
    fontFamily: "Ukrainian-Bold",
    color: "#111",
    fontSize: 20,
  },
});
