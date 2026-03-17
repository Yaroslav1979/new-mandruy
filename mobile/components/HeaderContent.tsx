import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View, Image, Modal } from "react-native";
import { BurgerMenu } from "./burger-menu";
import { InfoFlags } from "./IhfoFlags";
import Logo from "../assets/svg/logo.svg";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

export function HeaderContent({ overlay = false }: { overlay?: boolean }) {
  const { token, user, logout } = useAuth();

  const [profileVisible, setProfileVisible] = useState(false);

  const handleLogout = async () => {
    await logout();
    setProfileVisible(false);
    router.replace("/");
  };

  return (
    <View style={[styles.container, overlay && styles.overlay]}>
      <View style={styles.box}>
        <BurgerMenu />

        <Logo style={styles.logo} />

        {token ? (
          <Pressable onPress={() => setProfileVisible(true)}>
            <Image
              source={require("../assets/images/avatar4.png")}
              style={{ width: 32, height: 32, borderRadius: 16 }}
            />
          </Pressable>
        ) : (
          <Pressable onPress={() => router.push("/login")}>
            <Text style={styles.reactAcount}>Вхід</Text>
          </Pressable>
        )}
      </View>

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

      <Text style={[styles.title, overlay && styles.overlayText]}>
        Вітаємо вас на «МАНДРУЙ»
      </Text>

      <InfoFlags />

      <View style={styles.buttons}>
        <Pressable style={styles.button} onPress={() => router.push("/search")}>
          <Text style={styles.buttonText}>Розпочати пошук</Text>
        </Pressable>
        <Pressable style={styles.link}>
          <Text style={styles.linkText}>Дізнатися більше</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },

  overlay: {
    position: "absolute",
    left: 0,
    right: 0,
  },

  box: {
    display: "flex",
    flexDirection: "row",
    gap: 200,
    alignItems: "center",
    justifyContent: "space-between",
  },

  reactBoxMenu: {},
  reactBoxAcount: {},

  reactAcount: {
    fontFamily: "Ukrainian-Regular",
    color: "#eee",
    fontSize: 20,
    fontWeight: "bold",
  },

  logo: {
    width: 220,
    height: 60,
    marginTop: 20,
    marginBottom: 20,
  },
  title: {
    fontFamily: "Ukrainian-Bold",
    fontSize: 30,
    textAlign: "center",
    marginBottom: 30,
  },
  overlayText: {
    color: "#eee",
  },
  buttons: {
    display: "flex",
    flexDirection: "row",
    gap: 40,
  },
  button: {
    backgroundColor: "#9370db70",
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
    borderColor: "grey",
    borderRadius: 30,
  },
  linkText: {
    fontFamily: "Ukrainian-Bold",
    color: "#eee",
    fontSize: 20,
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
