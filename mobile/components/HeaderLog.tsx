import Logo from "../assets/svg/logo.svg";
import { BurgerMenu } from "../components/burger-menu";
import { View, StyleSheet } from "react-native";

export default function HeaderLog() {
  return (
    <View style={styles.pageTitle}>
      <BurgerMenu />
      <View>
        <Logo style={styles.logo} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pageTitle: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#111",
    padding: 10,
    alignItems: "center",
  },

  logo: {
    width: 160,
    height: 40,
  },
});
