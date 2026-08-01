import IconMail from "../../assets/svg/iconMail.svg";
import IconSite from "../../assets/svg/iconSite.svg";
import IconTele from "../../assets/svg/iconTele.svg";

import {
  ScrollView,
  StyleSheet,
  Text,
  Pressable,
  View,
  ImageBackground,
  useWindowDimensions,
} from "react-native";

import { HeaderHatContent } from "../../components/HeaderHatContent";
import { PortalProvider } from "@gorhom/portal";

export default function LoginScreen() {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  return (
    <PortalProvider>
      <View style={[styles.header, isLandscape && styles.headerLandscape]}>
        <HeaderHatContent
          containerStyle={{
            gap: 50,
            marginTop: 0,
          }}
          logoWidth={150}
        />
      </View>
      <ImageBackground
        source={require("../../assets/images/landscape.jpeg")}
        style={styles.img}
        resizeMode="cover"
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.titleWrapper}>
            <Text style={styles.title}>КОНТАКТИ</Text>
          </View>

          <View style={[styles.social, isLandscape && styles.socialLandscape]}>
            <Pressable
              style={[
                styles.socialBlock,
                isLandscape && styles.socialBlockLandscape,
              ]}
            >
              <IconMail style={styles.svgSocial} />
              <Text style={styles.socialText}>ourwebsite.com</Text>
            </Pressable>
            <Pressable
              style={[
                styles.socialBlock,
                isLandscape && styles.socialBlockLandscape,
              ]}
            >
              <IconSite style={styles.svgSocial} />
              <Text style={styles.socialText}>ouremail1222@gmail.com</Text>
            </Pressable>
            <Pressable
              style={[
                styles.socialBlock,
                isLandscape && styles.socialBlockLandscape,
              ]}
            >
              <IconTele style={styles.svgSocial} />
              <Text style={styles.socialText}>@telegramnickname</Text>
            </Pressable>
          </View>
          <View style={styles.txtWrapper}>
            <Text style={styles.txt}>
              Отримуй актуальні новини про сервіс “Мандруй” та ділись із
              друзями. Якщо ти маєш якісь пропозиції чи зауваження щодо
              функціоналу або роботи сайту, тоді напиши нам. Дякуємо за
              підтримку!
            </Text>
          </View>
        </ScrollView>
      </ImageBackground>
    </PortalProvider>
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
    marginTop: 50,
  },

  headerLandscape: {
    marginTop: 0,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },

  titleWrapper: {
    alignItems: "center",
    marginBottom: 30,
  },

  title: {
    fontFamily: "Ukrainian-Bold",
    color: "#111",
    fontSize: 20,
  },

  img: {
    // top: 50,
    width: "100%",
    height: "100%",
  },

  social: {
    display: "flex",
    backgroundColor: "#99999980",
    gap: 20,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },

  socialLandscape: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  socialBlock: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },

  socialBlockLandscape: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 10,
  },

  socialText: {
    fontFamily: "e-Ukraine-Medium",
    fontSize: 18,
  },

  svgSocial: {
    width: 26,
    height: 26,
  },

  txtWrapper: {
    backgroundColor: "#99999980",
    borderRadius: 20,
    padding: 20,
  },

  txt: {
    fontFamily: "Ukrainian-Regular",
    fontStyle: "normal",
    color: "#111",
    fontSize: 18,
    fontWeight: 400,
    lineHeight: 35,
  },
});
