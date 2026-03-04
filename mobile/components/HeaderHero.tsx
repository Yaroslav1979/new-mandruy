import { ImageBackground, Text } from "react-native";
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
        <Text
          style={{
            fontFamily: "Ukrainian-Bold",
            color: "#fff",
            fontSize: 16,
            top: 200,
            left: 20,
          }}
        >
          Відкривай нові місця разом з нами
        </Text>
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
      <Text
        style={{
          fontFamily: "Ukrainian-Bold",
          color: "#fff",
          fontSize: 16,
          top: 210,
          left: 30,
        }}
      >
        Відкривай нові місця разом з нами!
      </Text>
    </ImageBackground>
  );
}
