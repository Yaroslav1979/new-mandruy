import Group14 from "../assets/svg/Group14.svg";
import Group15 from "../assets/svg/Group15.svg";
import Group16 from "../assets/svg/Group16.svg";
import {
  Pressable,
  StyleSheet,
  View,
  StyleProp,
  ViewStyle,
} from "react-native";

type Props = {
  containerStyle?: StyleProp<ViewStyle>;
};

export function InfoFlags({ containerStyle }: Props) {
  return (
    <View style={[styles.wrapperIcons, containerStyle]}>
      <Pressable>
        <Group14 style={styles.icon} />
      </Pressable>
      <Pressable>
        <Group15 style={styles.icon} />
      </Pressable>
      <Pressable>
        <Group16 style={styles.icon} />
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
