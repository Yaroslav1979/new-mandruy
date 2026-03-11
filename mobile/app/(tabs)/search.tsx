import { useState, useEffect } from "react";
import { router } from "expo-router";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { API_URL } from "../../constants/api";
import { HeaderHatContent } from "../../components/HeaderHatContent";
import StarRating from "../../components/star-rating";

interface Place {
  _id: string;
  title: string;
  imgUrls: string[];
  rating: number;
  location?: {
    region?: string;
    city?: string;
    coordinate?: any;
  };
}

export default function LoginScreen() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlaces();
  }, []);

  const fetchPlaces = async () => {
    try {
      const response = await fetch(`${API_URL}/api/places/approved`);
      const data = await response.json();
      setPlaces(data);
    } catch (error) {
      console.error("Помилка отримання місць:", error);
      console.log("API_URL:", API_URL);
      console.log("FULL URL:", `${API_URL}/api/places/approved`);
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };
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

  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  // const [place, setPlace] = useState<any>(null);

  const [visibleCount, setVisibleCount] = useState(10);

  return (
    <View style={{ flex: 1, marginTop: 30 }}>
      <View style={styles.header}>
        <HeaderHatContent
          containerStyle={{
            gap: 50,
            marginTop: 0,
          }}
          logoWidth={150}
        />
      </View>

      <FlatList<Place>
        data={places.slice(0, visibleCount)}
        style={styles.bgd}
        key={isLandscape ? "landscape" : "portrait"}
        numColumns={isLandscape ? 2 : 1}
        columnWrapperStyle={
          isLandscape ? { justifyContent: "space-between" } : undefined
        }
        contentContainerStyle={{ paddingBottom: 20 }}
        keyExtractor={(item) => item._id}
        ListHeaderComponent={
          <>
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
            </View>
          </>
        }
        renderItem={({ item, index }: { item: Place; index: number }) => {
          const isLastOdd =
            isLandscape &&
            places.length % 2 !== 0 &&
            index === places.length - 1;

          return (
            <TouchableOpacity
              style={[
                styles.placeCard,
                isLandscape && !isLastOdd ? { width: "48%" } : undefined,
                isLandscape && isLastOdd
                  ? { width: "48%", alignSelf: "flex-start" }
                  : undefined,
              ]}
              activeOpacity={0.9}
              onPress={() =>
                router.push({
                  pathname: "/placeDetails",
                  params: { id: item._id },
                })
              }
            >
              {item.imgUrls?.length > 0 && (
                <Image
                  source={{ uri: `${API_URL}${item.imgUrls[0]}` }}
                  style={styles.placeImage}
                />
              )}
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "flex-end",
                  gap: 10,
                }}
              >
                <Text style={styles.placeTitle}>{item.title}</Text>
                <StarRating rating={Number(item.rating) || 0} />
              </View>

              <Text style={styles.placeRegion}>{item.location?.region}</Text>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={() =>
          !loading ? (
            <Text style={{ textAlign: "center", marginTop: 40 }}>
              Місця не знайдені
            </Text>
          ) : null
        }
        ListFooterComponent={
          visibleCount < places.length ? (
            <TouchableOpacity
              style={styles.loadMoreBtn}
              onPress={() => setVisibleCount((prev) => prev + 10)}
            >
              <Text style={styles.loadMoreText}>Показати ще</Text>
            </TouchableOpacity>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#111",
    padding: 10,
    marginTop: 20,
  },

  bgd: {
    backgroundColor: "#eee",
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
    // zIndex: 100,
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

  placeCard: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 15,
    marginTop: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    zIndex: -1,
  },

  placeImage: {
    width: "100%",
    aspectRatio: 16 / 9, // або 4/3 якщо фото інші
    borderRadius: 10,
  },

  placeTitle: {
    fontSize: 18,
    fontFamily: "Ukrainian-Bold",
    marginTop: 8,
  },

  placeRegion: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
  loadMoreBtn: {
    marginVertical: 20,
    alignSelf: "center",
    paddingVertical: 12,
    paddingHorizontal: 25,
    backgroundColor: "#111",
    borderRadius: 8,
  },

  loadMoreText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Ukrainian-Bold",
  },
});
