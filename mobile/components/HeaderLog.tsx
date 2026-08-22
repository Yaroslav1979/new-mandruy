import Logo from "../assets/svg/logo.svg";
import { BurgerMenu } from "../components/burger-menu";
import { View, StyleSheet, useWindowDimensions } from "react-native";

export default function HeaderLog() {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  return (
    <View style={[styles.pageTitle, isLandscape && styles.pageTitleLandscape]}>
      <BurgerMenu />
      <Logo style={styles.logo} />
    </View>
  );
}

const styles = StyleSheet.create({
  pageTitle: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#111",
    padding: 10,
    marginTop: 50,
  },

  pageTitleLandscape: {
    marginTop: 0,
  },

  logo: {
    width: 160,
    height: 40,
  },
});
