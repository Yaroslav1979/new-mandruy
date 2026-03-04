import Logo from "../assets/svg/logo.svg";
import { router } from "expo-router";

import {
  Pressable,
  StyleSheet,
  Text,
  View,
  StyleProp, // ← потрібно імпортувати
  // ImageStyle, // ← потрібно імпортувати
  ViewStyle, // ← потрібно імпортувати
} from "react-native";
import { BurgerMenu } from "./burger-menu";

type Props = {
  overlay?: boolean;
  logoWidth?: number;
  logoHeight?: number;
  logoStyle?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
};

export function HeaderHatContent({
  overlay = false,
  logoWidth,
  logoHeight,
  logoStyle,
  containerStyle, // ← потрібно отримати з props
}: Props) {
  return (
    <View
      style={[
        styles.container,
        overlay && styles.overlay,
        containerStyle, // ← кастомний стиль краще ставити останнім
      ]}
    >
      <BurgerMenu />
      <View>
        <Logo
          width={logoWidth ?? 220}
          height={(logoWidth ?? 220) * (50 / 183)}
          style={logoStyle}
        />
      </View>

      <Pressable
        style={styles.reactBoxAcount}
        onPress={() => router.push("/login")}
      >
        <Text style={styles.reactAcount}>Вхід</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    gap: 15,
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
    marginHorizontal: 10,
  },
  overlay: {
    position: "absolute",
    left: 0,
    right: 0,
  },

  reactBoxAcount: {},
  reactAcount: {
    fontFamily: "Ukrainian-Regular",
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  logo: {
    width: 220,
    height: 60,
    marginBottom: 20,
  },

  title: {
    fontFamily: "Ukrainian-Bold",
    fontSize: 30,
    textAlign: "center",
    marginBottom: 80,
  },
});
