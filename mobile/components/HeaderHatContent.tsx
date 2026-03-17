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
  Modal,
} from "react-native";
import { BurgerMenu } from "./burger-menu";
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
  const { token, user, logout } = useAuth();

  const [profileVisible, setProfileVisible] = useState(false);

  const handleLogout = async () => {
    await logout();
    setProfileVisible(false);
    router.replace("/");
  };

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

      <Modal visible={profileVisible} transparent animationType="fade">
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setProfileVisible(false)}
        >
          <View style={styles.modalContent}>
            <Image
              source={require("../assets/images/avatar4.png")}
              style={styles.avatarBig}
            />

            <Text style={styles.name}>{user?.name}</Text>
            <Text style={styles.email}>{user?.email}</Text>

            <Pressable style={styles.logoutBtn} onPress={handleLogout}>
              <Text style={styles.logoutText}>Вийти</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "#00000090",
    justifyContent: "center",
    alignItems: "center",
  },

  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 25,
    alignItems: "center",
    gap: 10,
  },

  avatarBig: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },

  name: {
    fontSize: 20,
    fontWeight: "600",
  },

  email: {
    fontSize: 16,
    color: "#666",
  },

  logoutBtn: {
    marginTop: 10,
    backgroundColor: "#9370db",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },

  logoutText: {
    color: "#fff",
    fontSize: 16,
  },
});
