import { View, Text, StyleSheet } from "react-native";

type Props = {
  title: string;
  Icon: any;
};

export default function PlaceCategory({ title, Icon }: Props) {
  return (
    <View style={styles.container}>
      <Icon width={19} height={20} />
      <Text style={styles.text}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "#E7E6ED",
    backgroundColor: "#fff",
    gap: 5,
  },

  text: {
    fontFamily: "Ukrainian-Regular",
    marginLeft: 10,
    fontSize: 14,
    fontWeight: "500",
  },
});
