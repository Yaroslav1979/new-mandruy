import {
  ScrollView,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useRef, useState } from "react";
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

  const scrollViewRef = useRef<ScrollView>(null);
  const [popularQuestionsY, setPopularQuestionsY] = useState(0);

  const handleMorePress = () => {
    scrollViewRef.current?.scrollTo({
      y: popularQuestionsY,
      animated: true,
    });
  };

  if (isLandscape) {
    return (
      <PortalProvider>
        <ScrollView ref={scrollViewRef}>
          <HeaderHero
            isLandscape={isLandscape}
            screenHeight={currentHeaderHeight}
            onMorePress={handleMorePress}
          />

          <View
            onLayout={(event) => {
              setPopularQuestionsY(event.nativeEvent.layout.y);
            }}
          >
            <PopularQuestions />
          </View>
        </ScrollView>
      </PortalProvider>
    );
  }

  return (
    <PortalProvider>
      <View style={{ flex: 1 }}>
        <HeaderHero
          isLandscape={isLandscape}
          screenHeight={currentHeaderHeight}
          onMorePress={handleMorePress}
        />

        <ScrollView ref={scrollViewRef}>
          <ImageBackground
            source={require("../../assets/images/Map.jpg")}
            style={{
              width: "100%",
              height: 600,
            }}
          >
            <View style={styles.container}>
              <Text style={styles.title}>Вітаємо вас на «МАНДРУЙ»</Text>

              <View style={{ paddingBottom: 30 }}>
                <InfoFlags
                  containerStyle={{
                    gap: 50,
                  }}
                />
              </View>

              <View style={styles.buttons}>
                <Pressable
                  style={styles.button}
                  onPress={() => router.push("/search")}
                >
                  <Text style={styles.buttonText}>Розпочати пошук</Text>
                </Pressable>

                <Pressable style={styles.link} onPress={handleMorePress}>
                  <Text style={styles.linkText}>
                    Дізнатися більше <ArrowMore />
                  </Text>
                </Pressable>
              </View>
            </View>
          </ImageBackground>

          <View
            onLayout={(event) => {
              setPopularQuestionsY(event.nativeEvent.layout.y);
            }}
          >
            <PopularQuestions />
          </View>
        </ScrollView>
      </View>
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
