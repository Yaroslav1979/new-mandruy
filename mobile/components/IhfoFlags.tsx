import { Image } from "expo-image";
import { Pressable, StyleSheet, View } from "react-native";

export function InfoFlags() {
  return (
    <View style={styles.wrapperIcons}>
      <Pressable>
        <Image
          source={require("../assets/svg/Group14.svg")}
          style={styles.icon}
        />
      </Pressable>
      <Pressable>
        <Image
          source={require("../assets/svg/Group15.svg")}
          style={styles.icon}
        />
      </Pressable>
      <Pressable>
        <Image
          source={require("../assets/svg/Group16.svg")}
          style={styles.icon}
        />
      </Pressable>
    </View>
  );
}
const styles = StyleSheet.create({
  wrapperIcons: {
    display: "flex",
    flexDirection: "row",
    gap: 100,
    marginBottom: 30,
  },
  icon: {
    width: 60,
    height: 60,
  },
});
