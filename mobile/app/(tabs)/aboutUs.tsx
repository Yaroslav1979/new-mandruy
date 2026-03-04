import ParallaxScrollView from "@/components/parallax-scroll-view";
import IconMail from "../../assets/svg/iconMail.svg";
import IconSite from "../../assets/svg/iconSite.svg";
import IconTele from "../../assets/svg/iconTele.svg";

import {
  StyleSheet,
  Text,
  Image,
  Pressable,
  TouchableOpacity,
  View,
} from "react-native";

import { HeaderHatContent } from "../../components/HeaderHatContent";

export default function LoginScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#fff", dark: "#1D3D47" }}
      headerHeight={50}
      headerImage={<View />}
    >
      <View style={styles.header}>
        <HeaderHatContent
          containerStyle={{
            gap: 50,
            marginTop: 0,
          }}
          logoStyle={{
            top: 0,
            width: 150,
            height: 40,
            marginBottom: 0,
          }}
        />
      </View>
      <View style={styles.titleWrapper}>
        <Text style={styles.title}>ПРО НАС</Text>
      </View>

      <View style={styles.imgWrapper}>
        <Image
          source={require("../../assets/images/landscape.jpeg")}
          style={styles.img}
        />
        <View style={styles.txtWrapper}>
          <Text style={styles.txt}>
            Отримуй актуальні новини про сервіс “Мандруй” та ділись із друзями.
            Дякуємо за підтримку. Якщо ти маєш якісь пропозиції чи зауваження
            щодо функціоналу або роботи сайту, тоді напиши нам.
          </Text>
        </View>

        <View style={styles.contacts}>
          <Text style={styles.title}>Контакти</Text>
        </View>

        <View style={styles.social}>
          <Pressable style={styles.socialBlock}>
            <IconMail style={styles.svgSocial} />
            <Text style={{ fontFamily: "e-Ukraine-Medium", fontSize: 20 }}>
              ourwebsite.com
            </Text>
          </Pressable>
          <Pressable style={styles.socialBlock}>
            <IconSite style={styles.svgSocial} />
            <Text style={{ fontFamily: "e-Ukraine-Medium", fontSize: 20 }}>
              ouremail1222@gmail.com
            </Text>
          </Pressable>
          <Pressable style={styles.socialBlock}>
            <IconTele style={styles.svgSocial} />
            <Text style={{ fontFamily: "e-Ukraine-Medium", fontSize: 20 }}>
              @telegramnickname
            </Text>
          </Pressable>
        </View>
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
    marginVertical: 20,
  },

  title: {
    fontFamily: "Ukrainian-Bold",
    color: "#111",
    fontSize: 20,
  },

  imgWrapper: {
    position: "relative",
  },

  img: {
    width: "100%",
    flex: 1,
  },
  txtWrapper: {
    position: "absolute",
    top: 100,
    marginHorizontal: 20,
  },

  txt: {
    color: "#111",
    fontFamily: "Ukrainian-Regular",
    fontSize: 20,
    fontStyle: "normal",
    fontWeight: 400,
    lineHeight: 35,
  },

  contacts: {
    position: "absolute",
    display: "flex",
    left: 120,
    top: 450,
  },

  social: {
    position: "absolute",
    top: 500,
    left: 30,
    display: "flex",
    gap: 30,
  },

  socialBlock: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },

  svgSocial: {
    width: 40,
    height: 40,
  },
});
