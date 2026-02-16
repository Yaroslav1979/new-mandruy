import { Ionicons } from "@expo/vector-icons"; // Для іконок
import { Image } from "expo-image";
import React, { useState } from "react";
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const HomeScreen = ({ navigation }: any) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn] = useState(false); // Стан авторизації (замінити на логіку з контексту/редаксу)

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header / Hero Section */}
      <ImageBackground
        source={require("@/assets/images/synevir.jpg")}
        style={styles.hero}
      >
        <View style={styles.overlay}>
          <Image
            source={require("@/assets/svg/logo.svg")}
            style={styles.logo}
          />
          <Text style={styles.heroSubTitle}>
            Відкривай нові місця разом з нами
          </Text>
        </View>
      </ImageBackground>

      <ScrollView>
        <ImageBackground
          source={require("../../assets/images/Map.jpg")}
          style={{ flex: 1, height: 800 }}
        >
          {/* Пошук (Доступний всім) */}
          <View style={styles.searchSection}>
            <View style={styles.searchBar}>
              <Ionicons name="search" size={20} color="#888" />
              <TextInput
                style={styles.input}
                placeholder="Що шукаємо?"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
            <TouchableOpacity
              style={styles.searchButton}
              onPress={() =>
                navigation.navigate("PlacesList", { query: searchQuery })
              }
            >
              <Text style={styles.searchButtonText}>Знайти</Text>
            </TouchableOpacity>
          </View>

          {/* Навігаційна сітка (Меню) */}
          <View style={styles.grid}>
            <MenuButton
              title="Всі місця"
              icon="map-outline"
              onPress={() => navigation.navigate("PlacesList")}
            />

            <MenuButton
              title="Карта"
              icon="navigate-circle-outline"
              onPress={() => navigation.navigate("Map")}
            />

            {/* Кнопка додавання — перевірка авторизації */}
            <MenuButton
              title="Додати місце"
              icon="add-circle-outline"
              onPress={() => {
                if (isLoggedIn) {
                  navigation.navigate("AddPlace");
                } else {
                  alert(
                    "Тільки зареєстровані користувачі можуть додавати місця",
                  );
                  navigation.navigate("Login");
                }
              }}
            />

            <MenuButton
              title="Контакти"
              icon="call-outline"
              onPress={() => navigation.navigate("Contacts")}
            />
          </View>

          {/* Секція Авторизації */}
          {!isLoggedIn && (
            <View style={styles.authBox}>
              <Text style={styles.authText}>
                Бажаєте поділитися своїм місцем?
              </Text>
              <TouchableOpacity
                style={styles.loginBtn}
                onPress={() => navigation.navigate("Login")}
              >
                <Text style={styles.loginBtnText}>Увійти в аккаунт</Text>
              </TouchableOpacity>
            </View>
          )}
        </ImageBackground>
      </ScrollView>
    </SafeAreaView>
  );
};

// Допоміжний компонент для кнопок меню
const MenuButton = ({
  title,
  icon,
  onPress,
}: {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <Ionicons name={icon} size={32} color="#2e7d32" />
    <Text style={styles.menuText}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#111",
    backgroundColor: "#f5f5f5",
  },
  hero: {
    width: "100%",
    height: 200,
    justifyContent: "center",
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.4)",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 220,
    height: 60,
    marginTop: 20,
    marginBottom: 20,
  },
  heroTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
  },
  heroSubTitle: {
    fontFamily: "Ukrainian-Bold",
    color: "#fff",
    fontSize: 16,
  },
  searchSection: {
    padding: 20,
    marginTop: 20,
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 15,
    elevation: 5,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eee",
    borderRadius: 20,
    paddingHorizontal: 10,
  },
  input: {
    fontFamily: "Ukrainian-Bold",
    flex: 1,
    height: 45,
    marginLeft: 10,
  },
  searchButton: {
    backgroundColor: "#9370db99",
    marginTop: 10,
    padding: 12,
    borderRadius: 20,
    alignItems: "center",
  },
  searchButtonText: {
    fontFamily: "Ukrainian-Bold",
    color: "#fff",
    fontWeight: "bold",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    padding: 10,
  },
  menuItem: {
    width: "45%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    marginVertical: 10,
    elevation: 2,
  },
  menuText: {
    fontFamily: "Ukrainian-Bold",
    marginTop: 10,
    fontWeight: "500",
  },
  authBox: {
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  authText: {
    fontFamily: "Ukrainian-Bold",
    color: "#666",
    marginBottom: 10,
  },
  loginBtn: {
    borderWidth: 1,
    borderColor: "#2e7d32",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  loginBtnText: {
    fontFamily: "Ukrainian-Bold",
    color: "#2e7d32",
    fontWeight: "bold",
  },
});

export default HomeScreen;
