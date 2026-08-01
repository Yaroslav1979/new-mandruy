import {
  ScrollView,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { HeaderHero } from "@/components/HeaderHero";
import { router } from "expo-router";
import { InfoFlags } from "@/components/IhfoFlags";
import { PopularQuestions } from "@/components/PopularQuestions";
import ArrowMore from "../../assets/svg/arrow-more.svg";
import { PortalProvider } from "@gorhom/portal";

export default function HomeScreen() {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const currentHeaderHeight = isLandscape ? height : 250;

  return (
    <PortalProvider>
      <HeaderHero
        isLandscape={isLandscape}
        screenHeight={currentHeaderHeight}
      />
      <ScrollView>
        {!isLandscape && (
          <ImageBackground
            source={require("../../assets/images/Map.jpg")}
            style={{ width: "100%", height: 600 }}
          >
            <View style={styles.container}>
              <Text style={styles.title}>Вітаємо вас на «МАНДРУЙ»</Text>

              <View style={styles.buttons}>
                <Pressable
                  style={styles.button}
                  onPress={() => router.push("/search")}
                >
                  <Text style={styles.buttonText}>Розпочати пошук</Text>
                </Pressable>
                <Pressable style={styles.link}>
                  <Text style={styles.linkText}>
                    Дізнатися більше <ArrowMore />
                  </Text>
                </Pressable>
              </View>

              <View style={{ padding: 50 }}>
                <InfoFlags
                  containerStyle={{
                    gap: 50,
                  }}
                />
              </View>
            </View>
          </ImageBackground>
        )}
        <View>
          <PopularQuestions />
        </View>
      </ScrollView>
    </PortalProvider>
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
    alignItems: "center",
  },
  linkText: {
    fontFamily: "Ukrainian-Bold",
    color: "#111",
    fontSize: 20,
  },
});
