import { HeaderHero } from "@/components/HeaderHero";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { Image } from "expo-image";
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

export default function HomeScreen() {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const currentHeaderHeight = isLandscape ? height : 250;

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#d7b8b8ff", dark: "#1D3D47" }}
      headerHeight={currentHeaderHeight} // Передає мо висоту сюди!
      headerImage={
        <HeaderHero
          isLandscape={isLandscape}
          screenHeight={currentHeaderHeight}
        />
      }
    >
      {!isLandscape && (
        <ImageBackground
          source={require("../../assets/images/Map.jpg")}
          style={{ width: "100%", height: 600 }}
        >
          <View style={styles.container}>
            <Text style={styles.title}>Вітаємо вас на «МАНДРУЙ»</Text>

            <View style={styles.buttons}>
              <Pressable style={styles.button}>
                <Text style={styles.buttonText}>Розпочати пошук</Text>
              </Pressable>
              <Pressable style={styles.link}>
                <Text style={styles.linkText}>Дізнатися більше</Text>
              </Pressable>
            </View>

            <View style={styles.wrapperIcons}>
              <Pressable>
                <Image
                  source={require("../../assets/svg/Group14.svg")}
                  style={styles.icon}
                />
              </Pressable>
              <Pressable>
                <Image
                  source={require("../../assets/svg/Group15.svg")}
                  style={styles.icon}
                />
              </Pressable>
              <Pressable>
                <Image
                  source={require("../../assets/svg/Group16.svg")}
                  style={styles.icon}
                />
              </Pressable>
            </View>
          </View>
        </ImageBackground>
      )}
    </ParallaxScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
  },

  title: {
    fontFamily: "Ukrainian-Bold",
    fontSize: 38,
    textAlign: "center",
    color: "#222",
    marginTop: 20,
    marginBottom: 60,
  },
  overlayText: {
    color: "#eee",
  },
  buttons: {
    display: "flex",
    flexDirection: "column",
    gap: 40,
  },
  button: {
    backgroundColor: "#9370db99",
    borderWidth: 2,
    borderColor: "#00000050",
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 30,
  },
  buttonText: {
    fontFamily: "Ukrainian-Bold",
    color: "#eee",
    fontSize: 20,
  },
  link: {
    paddingVertical: 14,
    borderWidth: 2,
    borderColor: "#00000050",
    borderRadius: 30,
    alignItems: "center",
    backgroundColor: "#a9a9a980",
  },
  linkText: {
    fontFamily: "Ukrainian-Bold",
    color: "#222",
    fontSize: 20,
  },

  wrapperIcons: {
    display: "flex",
    flexDirection: "row",
    gap: 50,
    marginTop: 50,
  },
  icon: {
    width: 60,
    height: 60,
  },
});
