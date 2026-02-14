import ParallaxScrollView from "@/components/parallax-scroll-view";
import { Image } from "expo-image";
import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { BurgerMenu } from "../../components/burger-menu";

export default function LoginScreen() {
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [category, setCategory] = useState("Без категорії");
  const [categoryItems, setCategoryItems] = useState([
    { label: "Без категорії", value: "Без категорії" },
    { label: "Табір", value: "Табір" },
    { label: "Мандрівка", value: "Мандрівка" },
    { label: "Питна вода", value: "Питна вода" },
    { label: "Пам'ятка", value: "Пам'ятка" },
    { label: "Музей", value: "Музей" },
    { label: "Водойма", value: "Водойма" },
    { label: "Автомобіль", value: "Автомобіль" },
  ]);

  const [regionOpen, setRegionOpen] = useState(false);
  const [region, setRegion] = useState("Вся Україна");
  const [regionItems, setRegionItems] = useState([
    { label: "Вся Україна", value: "Вся Україна" },
    { label: "Волинська область", value: "Волинська область" },
    { label: "Вінницька область", value: "Вінницька область" },
    { label: "Дніпропетровська область", value: "Дніпропетровська область" },
    { label: "Донецька область", value: "Донецька область" },
    { label: "Житомирська область", value: "Житомирська область" },
    { label: "Закарпатська область", value: "Закарпатська область" },
    { label: "Запорізька область", value: "Запорізька область" },
    { label: "Івано-Франківська область", value: "Івано-Франківська область" },
    { label: "Київська область", value: "Київська область" },
    { label: "Кіровоградська область", value: "Кіровоградська область" },
    { label: "Луганська область", value: "Луганська область" },
    { label: "Львівська область", value: "Львівська область" },
    { label: "Миколаївська область", value: "Миколаївська область" },
    { label: "Одеська область", value: "Одеська область" },
    { label: "Полтавська область", value: "Полтавська область" },
    { label: "Рівненська область", value: "Рівненська область" },
    { label: "Сумська область", value: "Сумська область" },
    { label: "Тернопільська область", value: "Тернопільська область" },
    { label: "Харківська область", value: "Харківська область" },
    { label: "Херсонська область", value: "Херсонська область" },
    { label: "Хмельницька область", value: "Хмельницька область" },
    { label: "Черкаська область", value: "Черкаська область" },
    { label: "Чернівецька область", value: "Чернівецька область" },
    { label: "Чернігівська область", value: "Чернігівська область" },
    { label: "Крим автономна республіка", value: "Крим автономна республіка" },
  ]);

  const [sortedbyOpen, setSortedbyOpen] = useState(false);
  const [sortedby, setSortedby] = useState("За замовчуванням");
  const [sortedbyItems, setSortedbyItems] = useState([
    { label: "За замовчуванням", value: "За замовчуванням" },
    { label: "За назвою", value: "За назвою" },
    { label: "За датою", value: "За датою" },
  ]);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#fff", dark: "#303638" }}
      headerHeight={50}
      headerImage={<View />}
    >
      <View style={styles.header}>
        <BurgerMenu />
        <Image
          source={require("../../assets/svg/logo.svg")}
          style={styles.logo}
        />
        <Text style={styles.reactAcount}>Вхід</Text>
      </View>
      <View style={styles.titleWrapper}>
        <Text style={styles.title}>ПОШУК МІСЦЬ</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.formBlock}>
          <TextInput
            style={styles.input}
            textAlign="center"
            placeholder="Введіть назву"
          />
          <Image
            source={require("../../assets/images/iconSearch.png")}
            style={styles.searchBtn}
          />
        </View>
        {/* <Text style={styles.subtitle}>Розширений пошук:</Text> */}
        <View style={styles.pickerWrapper}>
          <View style={{ width: "33%", zIndex: 3000, gap: 5 }}>
            <Text style={styles.label}>Категорія:</Text>
            <DropDownPicker
              open={categoryOpen}
              value={category}
              items={categoryItems}
              setOpen={setCategoryOpen}
              setValue={setCategory}
              setItems={setCategoryItems}
              placeholder="Категорія"
              style={styles.dropdown}
              textStyle={styles.dropdownText}
              dropDownContainerStyle={styles.dropdownContainer}
            />
          </View>

          <View style={{ width: "33%", zIndex: 2000, gap: 5 }}>
            <Text style={styles.label}>Область:</Text>
            <DropDownPicker
              open={regionOpen}
              value={region}
              items={regionItems}
              setOpen={setRegionOpen}
              setValue={setRegion}
              setItems={setRegionItems}
              placeholder="Область"
              style={styles.dropdown}
              textStyle={styles.dropdownText}
              dropDownContainerStyle={styles.dropdownContainer}
            />
          </View>

          <View style={{ width: "33%", zIndex: 1000, gap: 5 }}>
            <Text style={styles.label}>Сортувати:</Text>
            <DropDownPicker
              open={sortedbyOpen}
              value={sortedby}
              items={sortedbyItems}
              setOpen={setSortedbyOpen}
              setValue={setSortedby}
              setItems={setSortedbyItems}
              placeholder="Сортувати"
              style={styles.dropdown}
              textStyle={styles.dropdownText}
              dropDownContainerStyle={styles.dropdownContainer}
            />
          </View>
        </View>
        <Text style={styles.label}>лмопасра</Text>
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#111",
    padding: 10,
    alignItems: "center",
  },
  titleWrapper: {
    alignItems: "center",
    marginTop: 20,
  },
  title: {
    fontFamily: "Ukrainian-Bold",
    color: "#111",
    fontSize: 20,
  },

  form: {
    fontFamily: "Ukrainian-Bold",
    display: "flex",
    gap: 20,
    marginTop: 30,
    marginHorizontal: 30,
  },
  formBlock: {
    flex: 1,
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
    alignItems: "center",

    marginBottom: 20,
  },
  label: {
    fontFamily: "Ukrainian-Regular",
    color: "#111",
    fontSize: 15,
  },
  subtitle: {
    fontFamily: "Ukrainian-Bold",
    color: "#111",
    fontSize: 20,
  },
  input: {
    borderWidth: 2,
    borderColor: "#333",
    height: 50,
    borderRadius: 10,
    fontSize: 20,
    fontFamily: "Ukrainian-Regular",
    color: "#555",
    minWidth: 300,
  },
  pickerWrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 5,
  },

  logo: {
    width: 150,
    height: 35,
  },
  searchBtn: {
    width: 50,
    height: 50,
    borderWidth: 2,
    borderColor: "#333",
    borderRadius: 10,
  },
  dropdown: {
    borderColor: "#333",
    borderWidth: 2,
    borderRadius: 10,
    minHeight: 45,
  },

  dropdownContainer: {
    borderColor: "#333",
    // marginHorizontal: 20,
  },

  dropdownText: {
    fontFamily: "Ukrainian-Regular",
    fontSize: 10,
    color: "#111",
  },

  reactAcount: {
    fontFamily: "Ukrainian-Regular",
    color: "#eee",
    fontSize: 20,
    fontWeight: "bold",
  },
});
