import { router } from "expo-router";
import { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View, Modal } from "react-native";
import { useAuth } from "../context/AuthContext";
export function BurgerMenu() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { token } = useAuth();
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
      }}
    >
      <Pressable
        // style={styles.reactBoxMenu}
        onPress={() => setMenuOpen((prev) => !prev)}
      >
        <Image
          source={require("@/assets/images/burger-menu-67.png")}
          style={styles.reactMenu}
        />
      </Pressable>

      {menuOpen && (
        <Modal transparent animationType="fade">
          <Pressable style={styles.overlay} onPress={() => setMenuOpen(false)}>
            <View style={styles.dropdown}>
              <Pressable
                onPress={() => {
                  setMenuOpen(false);
                  router.push("/");
                }}
              >
                <Text style={styles.dropdownItem}>Головна</Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  setMenuOpen(false);
                  router.push("/search");
                }}
              >
                <Text style={styles.dropdownItem}>Пошук місць</Text>
              </Pressable>

              {token && (
                <Pressable
                  onPress={() => {
                    setMenuOpen(false);
                    router.push("/addPlace");
                  }}
                >
                  <Text style={styles.dropdownItem}>Додати місце</Text>
                </Pressable>
              )}

              <Pressable
                onPress={() => {
                  setMenuOpen(false);
                  router.push("/map");
                }}
              >
                <Text style={styles.dropdownItem}>Мапа</Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  setMenuOpen(false);
                  router.push("/aboutUs");
                }}
              >
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
  reactMenu: {
    paddingTop: -50,
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
