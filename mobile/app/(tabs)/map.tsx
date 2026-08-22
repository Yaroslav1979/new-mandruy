import { router, useFocusEffect } from "expo-router";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  useWindowDimensions,
  ScrollView,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import IconMapArrow from "../../assets/svg/IconMapArrow.svg";
import { HeaderHatContent } from "../../components/HeaderHatContent";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { API_URL } from "@/constants/api";
import { PortalProvider } from "@gorhom/portal";

export default function MapScreen() {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const [places, setPlaces] = useState([]);

  const fetchPlaces = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/places`);
      setPlaces(res.data);
    } catch (e) {
      console.log("Помилка завантаження місць:", e);
    }
  };

  useEffect(() => {
    fetchPlaces();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchPlaces();
    }, []),
  );

  // 🔹 парсинг координат
  const parseCoordinate = (coordString: string) => {
    if (!coordString) return null;

    const [lat, lng] = coordString.split(",").map((c) => parseFloat(c.trim()));

    if (isNaN(lat) || isNaN(lng)) return null;

    return { latitude: lat, longitude: lng };
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

      <ScrollView
        contentContainerStyle={[
          styles.container,
          isLandscape && styles.containerLandscape,
        ]}
      >
        <View style={styles.titleWrapper}>
          <Text style={styles.title}>ІНТЕРАКТИВНА МАПА</Text>
        </View>

        <View
          style={[styles.mapWrapper, isLandscape && styles.mapWrapperLandscape]}
        >
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: 49.8397,
              longitude: 24.0297,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
          >
            {places.map((place: any) => {
              const coords = parseCoordinate(place.location?.coordinate);

              if (!coords) return null;

              return (
                <Marker
                  key={place._id}
                  coordinate={coords}
                  title={place.title}
                  description={place.descr}
                  onPress={() =>
                    router.push({
                      pathname: "/(tabs)/placeDetails",
                      params: { id: place._id },
                    })
                  }
                />
              );
            })}

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
          style={[styles.googlBtn, isLandscape && styles.googlBtnLandscape]}
          onPress={() =>
            router.push(
              "https://www.google.com/maps/@50.393338,25.9771985,11.38z?authuser=0&entry=ttu",
            )
          }
        >
          <Text style={styles.text}>Google Maps</Text>
          <IconMapArrow />
        </TouchableOpacity>
      </ScrollView>
    </PortalProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 30,
  },

  containerLandscape: {
    paddingHorizontal: 25,
    paddingBottom: 20,
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

  titleWrapper: {
    alignItems: "center",
    marginVertical: 20,
  },

  title: {
    fontFamily: "Ukrainian-Bold",
    color: "#111",
    fontSize: 20,
  },

  mapWrapper: {
    height: 400,
    marginHorizontal: 20,
    borderRadius: 15,
    overflow: "hidden",
  },

  mapWrapperLandscape: {
    height: 520,
    marginHorizontal: 0,
  },

  map: {
    flex: 1,
  },

  googlBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    marginHorizontal: 20,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#111",
  },

  googlBtnLandscape: {
    width: 260,
    alignSelf: "center",
    marginTop: 25,
  },

  text: {
    fontFamily: "Ukrainian-Regular",
    color: "#eee",
    fontSize: 15,
    marginRight: 10,
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
    lineHeight: 35,
  },

  contacts: {
    position: "absolute",
    left: 120,
    top: 450,
  },

  social: {
    position: "absolute",
    top: 500,
    left: 30,
    gap: 30,
  },

  socialBlock: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },

  svgSocial: {
    width: 40,
    height: 40,
  },
});
