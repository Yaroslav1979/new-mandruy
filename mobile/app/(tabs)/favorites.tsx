import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { HeaderHatContent } from "../../components/HeaderHatContent";
import { PortalProvider } from "@gorhom/portal";
import FavoritesPlaces from "../../components/PlaceModals/FavoritesModal";

export default function LoginScreen() {
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

      <View style={styles.scrollContent}>
        <View style={styles.titleWrapper}>
          <Text style={styles.title}>ОБРАНІ МІСЦЯ</Text>
        </View>

        <FavoritesPlaces />
      </View>
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

  img: {
    width: "100%",
    height: "100%",
  },

  social: {
    display: "flex",
    backgroundColor: "#99999980",
    gap: 20,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },

  socialLandscape: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  socialBlock: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },

  socialBlockLandscape: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 10,
  },

  socialText: {
    fontFamily: "e-Ukraine-Medium",
    fontSize: 18,
  },

  svgSocial: {
    width: 26,
    height: 26,
  },

  txtWrapper: {
    backgroundColor: "#99999980",
    borderRadius: 20,
    padding: 20,
  },

  txt: {
    fontFamily: "Ukrainian-Regular",
    fontStyle: "normal",
    color: "#111",
    fontSize: 18,
    fontWeight: 400,
    lineHeight: 35,
  },
});
