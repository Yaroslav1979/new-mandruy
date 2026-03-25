import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View, Image } from "react-native";
import { BurgerMenu } from "./burger-menu";
import { InfoFlags } from "./IhfoFlags";
import Logo from "../assets/svg/logo.svg";
import { useAuth } from "@/context/AuthContext";
import { ProfilesModal } from "@/components/ProfilesModal";
import { useState } from "react";

export function HeaderContent({ overlay = false }: { overlay?: boolean }) {
  const { token, user } = useAuth();
  const userInitial = user?.name?.[0]?.toUpperCase() || "";

  const [profileVisible, setProfileVisible] = useState(false);

  return (
    <View style={[styles.container, overlay && styles.overlay]}>
      <View style={styles.box}>
        <BurgerMenu />

        <Logo style={styles.logo} />

        {token ? (
          <Pressable onPress={() => setProfileVisible(true)}>
            {user?.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatarSmall} />
            ) : (
              <View style={styles.avatarCircleSmall}>
                <Text style={styles.avatarLetterSmall}>{userInitial}</Text>
              </View>
            )}
          </Pressable>
        ) : (
          <Pressable onPress={() => router.push("/login")}>
            <Text style={styles.reactAcount}>Вхід</Text>
          </Pressable>
        )}
      </View>
      <View>
        <ProfilesModal
          visible={profileVisible}
          setVisible={setProfileVisible}
        />
      </View>

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
  avatarSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },

  avatarCircleSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#007bff",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarLetterSmall: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});
