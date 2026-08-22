import { Pressable, StyleSheet, Text } from "react-native";

interface ModalCloseButtonProps {
  onPress: () => void;
}

export function CloseButton({ onPress }: ModalCloseButtonProps) {
  return (
    <Pressable style={styles.closeBtn} onPress={onPress} hitSlop={10}>
      <Text style={styles.closeText}>×</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  closeBtn: {
    position: "absolute",
    top: 8,
    right: 10,
    width: 35,
    height: 35,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },

  closeText: {
    fontSize: 30,
    lineHeight: 32,
    color: "#111",
    fontFamily: "Ukrainian-Regular",
  },
});
