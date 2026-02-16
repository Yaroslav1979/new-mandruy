import { router } from "expo-router";
import { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

export function BurgerMenu() {
  const [menuOpen, setMenuOpen] = useState(false);
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
        <View style={styles.dropdown}>
          <Pressable
            onPress={() => {
              setMenuOpen(false);
              router.push("/search");
            }}
          >
            <Text style={styles.dropdownItem}>Пошук місць</Text>
          </Pressable>

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

  dropdown: {
    position: "absolute",
    top: 80,
    left: 16,
    backgroundColor: "rgba(0,0,0,0.85)",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    gap: 12,
    zIndex: 100,
  },

  dropdownItem: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Ukrainian-Regular",
  },
});
