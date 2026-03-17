import Logo from "../assets/svg/logo.svg";
import { router } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  StyleProp,
  Image,
  ViewStyle,
} from "react-native";
import { BurgerMenu } from "./burger-menu";
import { ProfilesModal } from "@/components/ProfilesModal";
import { useState } from "react";

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
  logoStyle,
  containerStyle, // ← потрібно отримати з props
}: Props) {
  const { token } = useAuth();

  const [profileVisible, setProfileVisible] = useState(false);

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

      {token ? (
        <Pressable onPress={() => setProfileVisible(true)}>
          <Image
            source={require("../assets/images/avatar4.png")}
            style={{ width: 34, height: 34, borderRadius: 17 }}
          />
        </Pressable>
      ) : (
        <Pressable onPress={() => router.push("/login")}>
          <Text style={styles.reactAcount}>Вхід</Text>
        </Pressable>
      )}

      <View>
        <ProfilesModal
          visible={profileVisible}
          setVisible={setProfileVisible}
        />
      </View>
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
