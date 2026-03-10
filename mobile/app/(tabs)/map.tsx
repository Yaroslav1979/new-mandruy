import ParallaxScrollView from "@/components/parallax-scroll-view";
import { router } from "expo-router";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";
import IconMapArrow from "../../assets/svg/IconMapArrow.svg";
import { HeaderHatContent } from "../../components/HeaderHatContent";

export default function LoginScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#fff", dark: "#1D3D47" }}
      headerHeight={50}
      headerImage={<View />}
    >
      <View style={styles.header}>
        <HeaderHatContent
          containerStyle={{
            gap: 50,
            marginTop: 0,
          }}
          logoWidth={150}
        />
      </View>

      <View style={styles.titleWrapper}>
        <Text style={styles.title}>ІНТЕРАКТИВНА МАПА</Text>
      </View>

      <View style={styles.mapWrapper}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 49.8397,
            longitude: 24.0297,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          <Marker
            coordinate={{
              latitude: 49.8397,
              longitude: 24.0297,
            }}
            title="Львів"
            description="Центр міста"
          />
        </MapView>
      </View>

      <TouchableOpacity
        style={styles.googlBtn}
        onPress={() =>
          router.push(
            "https://www.google.com/maps/@50.393338,25.9771985,11.38z?authuser=0&entry=ttu",
          )
        }
      >
        <Text style={styles.text}>Google Maps</Text>
        <IconMapArrow />
      </TouchableOpacity>
    </ParallaxScrollView>
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
  },
  titleWrapper: {
    alignItems: "center",
    marginVertical: 20,
  },
  title: {
    fontFamily: "Ukrainian-Bold",
    color: "#111",
    fontSize: 20,
  },
  imgWrapper: {
    position: "relative",
  },
  img: {
    width: "100%",
    flex: 1,
  },
  txtWrapper: {
    position: "absolute",
    top: 100,
    marginHorizontal: 20,
  },
  txt: {
    color: "#111",
    fontFamily: "Ukrainian-Regular",
    fontSize: 20,
    fontStyle: "normal",
    fontWeight: 400,
    lineHeight: 35,
  },
  contacts: {
    position: "absolute",
    display: "flex",
    left: 120,
    top: 450,
  },
  social: {
    position: "absolute",
    top: 500,
    left: 30,
    display: "flex",
    gap: 30,
  },
  socialBlock: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  svgSocial: {
    width: 40,
    height: 40,
  },

  mapWrapper: {
    height: 400,
    marginHorizontal: 20,
    borderRadius: 15,
    overflow: "hidden",
  },
  map: {
    flex: 1,
  },

  googlBtn: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: "10",
    marginTop: 20,
    marginHorizontal: 20,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#111",
  },
  text: {
    fontFamily: "Ukrainian-Regular",
    color: "#eee",
    fontSize: 15,
  },
});
