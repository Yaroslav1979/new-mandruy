import { ImageBackground, Text, View } from "react-native";
import { HeaderContent } from "./HeaderContent";
import { HeaderHatContent } from "./HeaderHatContent";

export function HeaderHero({
  isLandscape,
  screenHeight,
}: {
  isLandscape: boolean;
  screenHeight: number;
}) {
  if (isLandscape) {
    return (
      <ImageBackground
        source={require("@/assets/images/synevir.jpg")}
        style={{ height: screenHeight, width: "100%" }}
        resizeMode="cover"
      >
        <HeaderContent overlay />
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={require("@/assets/images/synevir.jpg")}
      style={{ height: 250, width: "100%" }}
      resizeMode="cover"
    >
      <HeaderHatContent
        overlay
        logoWidth={200}
        logoStyle={{ marginTop: 40, top: 80 }}
      />
      <View
        style={{
          display: "flex",
          alignItems: "center",
          top: 210,
        }}
      >
        <Text
          style={{
            fontFamily: "Ukrainian-Bold",
            color: "#fff",
            fontSize: 15,
          }}
        >
          Відкривай нові місця разом з нами!
        </Text>
      </View>
    </ImageBackground>
  );
}
