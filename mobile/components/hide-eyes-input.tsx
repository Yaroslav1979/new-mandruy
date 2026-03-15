import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface PasswordInputProps {
  value: string;
  onChangeText: (text: string) => void;
}

export default function PasswordInput({
  value,
  onChangeText,
}: PasswordInputProps) {
  const [secure, setSecure] = useState(true);

  return (
    <View style={styles.inputContainer}>
      <TextInput
        textAlign="center"
        textContentType="password"
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secure}
      />

      <TouchableOpacity style={styles.icon} onPress={() => setSecure(!secure)}>
        <Ionicons name={secure ? "eye-off" : "eye"} size={22} color="#777" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    position: "relative",
    justifyContent: "center",
  },

  input: {
    width: "100%",
    borderWidth: 2,
    borderColor: "#111",
    height: 60,
    borderRadius: 30,
    fontSize: 20,
    fontFamily: "Ukrainian-Regular",
    color: "#111",
    backgroundColor: "#eeeeee90",
    padding: 12,
    paddingRight: 40,
  },

  icon: {
    position: "absolute",
    right: 12,
  },
});
