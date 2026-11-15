import { router } from "expo-router";
import { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View, Modal } from "react-native";
import { useAuth } from "../context/AuthContext";

export function BurgerMenu() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { token, user } = useAuth();

  const navigate = (path: string) => {
    setMenuOpen(false);
    router.push(path as any);
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={() => setMenuOpen((prev) => !prev)}>
        <Image
          source={require("@/assets/images/burger-menu-67.png")}
          style={styles.reactMenu}
        />
      </Pressable>

      {menuOpen && (
        <Modal
          transparent
          animationType="fade"
          supportedOrientations={["portrait", "landscape"]}
          onRequestClose={() => setMenuOpen(false)}
        >
          <Pressable style={styles.overlay} onPress={() => setMenuOpen(false)}>
            <View style={styles.dropdown}>
              <Pressable onPress={() => navigate("/")}>
                <Text style={styles.dropdownItem}>Головна</Text>
              </Pressable>

              <Pressable onPress={() => navigate("/search")}>
                <Text style={styles.dropdownItem}>Пошук місць</Text>
              </Pressable>

              {token && (
                <Pressable onPress={() => navigate("/addPlace")}>
                  <Text style={styles.dropdownItem}>Додати місце</Text>
                </Pressable>
              )}

              <Pressable onPress={() => navigate("/map")}>
                <Text style={styles.dropdownItem}>Мапа</Text>
              </Pressable>

              {user?.role === "admin" && (
                <Pressable onPress={() => navigate("/admin")}>
                  <Text style={styles.dropdownItem}>Адміністрування</Text>
                </Pressable>
              )}

              <Pressable onPress={() => navigate("/aboutUs")}>
                <Text style={styles.dropdownItem}>Про нас</Text>
              </Pressable>
            </View>
          </Pressable>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },

  reactMenu: {
    height: 50,
    width: 50,
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
  },

  dropdown: {
    position: "absolute",
    top: 100,
    left: 16,
    backgroundColor: "rgba(0,0,0,0.95)",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    gap: 12,
  },

  dropdownItem: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Ukrainian-Regular",
  },
});
