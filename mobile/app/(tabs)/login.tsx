import ParallaxScrollView from "@/components/parallax-scroll-view";
import { router } from "expo-router";
import { API_URL } from "@/constants/api";
import HeaderLog from "../../components/HeaderLog";
import PasswordInput from "../../components/hide-eyes-input";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
  Modal,
  Image,
} from "react-native";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function LoginScreen() {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorModal, setErrorModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Заповніть усі поля");
      return;
    }
    // console.log("LOGIN:", email, password);
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();
      // console.log("SERVER RESPONSE:", data);

      if (!response.ok) {
        setErrorModal(true);
        return;
      }

      await login(data.token);

      setSuccessModal(true);
    } catch (error) {
      console.log(error);
      alert("Помилка з'єднання з сервером");
    }
  };
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#fff", dark: "#1D3D47" }}
      headerHeight={35}
      headerImage={<View />}
    >
      <HeaderLog />

      <View style={{ position: "relative" }}>
        <Image
          source={require("../../assets/images/NightMoon.jpg")}
          style={styles.bgd}
        />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={[styles.form, isLandscape && styles.formLandscape]}>
          <View
            style={[
              styles.formWrapper,
              isLandscape && styles.formWrapperLandscape,
            ]}
          >
            <View
              style={[
                styles.formBlock,
                isLandscape && styles.formBlockLandscape,
              ]}
            >
              <Text style={styles.label}>Електронна пошта / Email:</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                textAlign="center"
                autoFocus={false}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="emailAddress"
              />
              <Pressable onPress={() => router.push("/registr")}>
                <Text style={styles.text}>Не зареєстровані? Реєстрація</Text>
              </Pressable>
            </View>

            <View style={styles.formBlock}>
              <Text style={styles.label}>Пароль / Password:</Text>
              <PasswordInput value={password} onChangeText={setPassword} />
              <Pressable>
                <Text style={styles.text}>Забули пароль?</Text>
              </Pressable>
            </View>
          </View>

          <TouchableOpacity style={styles.btn} onPress={handleLogin}>
            <Text style={styles.btnTxt}> Вхід </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* SUCCESS MODAL */}

      <Modal visible={successModal} transparent animationType="fade">
        <Pressable style={styles.modal} onPress={() => router.replace("/")}>
          <View style={styles.modalContent}>
            <Text style={styles.success}>Успішно!</Text>

            <TouchableOpacity
              style={styles.btn}
              onPress={() => setSuccessModal(false)}
            >
              <Text style={styles.btnText}>Натисніть щоб перейти</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setSuccessModal(false); // Закриваємо перед переходом
                router.replace("/");
              }}
            ></TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      {/* ERROR MODAL */}

      <Modal visible={errorModal} transparent animationType="fade">
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <Text style={styles.error}>Невірний email або пароль</Text>

            {/* Змінюємо логіку тут: замість переходу просто закриваємо модалку */}
            <TouchableOpacity
              style={styles.btn}
              onPress={() => setErrorModal(false)}
            >
              <Text style={styles.btnText}>Спробувати ще</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setErrorModal(false); // Закриваємо перед переходом
                router.replace("/");
              }}
            >
              <Text style={styles.link}>На головну</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
  },

  bgd: {
    flex: 1,
    width: "100%",
    height: 800,
  },

  title: {
    fontFamily: "Ukrainian-Bold",
    color: "#eee",
  },

  form: {
    width: "100%",
    paddingHorizontal: 40,
    top: 120,
  },

  formLandscape: {
    fontFamily: "Ukrainian-Bold",
    display: "flex",
    gap: 20,
    width: "100%",
    maxWidth: 800,
    top: 100,
  },
  formWrapper: {
    display: "flex",
    width: "100%",
    flexDirection: "column",
    gap: 20,
  },
  formWrapperLandscape: {
    display: "flex",
    flexDirection: "row",
    gap: 20,
  },

  formBlock: {
    flex: 1,
    gap: 20,
  },

  formBlockLandscape: {
    display: "flex",
    flex: 1,
    width: 200,
    gap: 10,
  },

  label: {
    fontFamily: "Ukrainian-Regular",
    color: "#eee",
    fontSize: 16,
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
  },
  btn: {
    width: "100%",
    backgroundColor: "#9370db99",
    borderWidth: 2,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  btnTxt: {
    fontFamily: "Ukrainian-Regular",
    color: "#eee",
    fontSize: 20,
  },
  text: {
    fontFamily: "Ukrainian-Regular",
    color: "#eee",
    fontSize: 15,
  },

  link: {
    fontFamily: "Ukrainian-Regular",
    color: "#eee",
    paddingTop: 5,
    fontSize: 15,
    textAlign: "center",
    marginTop: 5,
  },

  modal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00000090",
  },

  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 15,
    gap: 15,
  },
  btnText: {
    color: "#fff",
    fontSize: 18,
  },
  success: {
    fontSize: 22,
    textAlign: "center",
    color: "green",
  },

  error: {
    fontSize: 20,
    textAlign: "center",
    color: "red",
  },
});
