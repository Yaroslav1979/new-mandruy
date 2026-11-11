import React from "react";
import { View, StyleSheet, useWindowDimensions } from "react-native";
import { PortalProvider } from "@gorhom/portal";
import { HeaderHatContent } from "../../components/HeaderHatContent";
import { PlaceForm } from "../../components/PlaceForm";

export default function AddPlaceScreen() {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

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

      <PlaceForm mode="create" />
    </PortalProvider>
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
});
