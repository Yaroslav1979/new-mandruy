// import ParallaxScrollView from "@/components/parallax-scroll-view";
import { router } from "expo-router";
import { API_URL } from "@/constants/api";
import HeaderLog from "../../components/HeaderLog";
import PasswordInput from "../../components/hide-eyes-input";
import {
  ScrollView,
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
import { PortalProvider } from "@gorhom/portal";

export default function RegistrScreen() {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [code, setCode] = useState("");

  const [confirmModal, setConfirmModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const { login } = useAuth();

  const handleRegister = async () => {
    if (!name || !email || !password) {
      alert("Заповніть усі поля");
      return;
    }

    if (password !== confirmPassword) {
      alert("Паролі не співпадають");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      setConfirmModal(true);
    } catch (error) {
      console.log(error);
      alert("Помилка з'єднання з сервером");
    }
  };

  const confirmEmail = async () => {
    try {
      const response = await fetch(`${API_URL}/api/auth/confirm-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          code,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setConfirmModal(false); // Закриваємо модалку вводу
        setErrorModal(true); // Показуємо помилку
        return;
      }

      await login(data.token);

      setConfirmModal(false);
      setSuccessModal(true);
    } catch (error) {
      console.log(error);
      alert("Помилка підтвердження");
    }
  };
  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setCode("");
  };

  return (
    <PortalProvider>
      {/* <ParallaxScrollView
        headerBackgroundColor={{ light: "#fff", dark: "#1D3D47" }}
        headerHeight={35}
        headerImage={<View />}
      > */}
      <HeaderLog />
      <ScrollView>
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
          <View>
            <Text style={styles.title}>Реєстрація</Text>
          </View>
          <View style={[styles.form, isLandscape && styles.formLandscape]}>
            <View
              style={[
                styles.formWrapper,
                isLandscape && styles.formWrapperLandscape,
              ]}
            >
              <View style={styles.formBlock}>
                <Text style={styles.label}>Імʼя:</Text>
                <TextInput
                  style={styles.input}
                  // placeholder="Імʼя"
                  value={name}
                  onChangeText={setName}
                  textAlign="center"
                  autoFocus={false}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <View style={styles.formBlock}>
                <Text style={styles.label}>Електронна адреса:</Text>
                <TextInput
                  style={styles.input}
                  // placeholder="Email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                  textAlign="center"
                  autoFocus={false}
                  autoCorrect={false}
                  textContentType="emailAddress"
                />
              </View>

              <View style={styles.formBlock}>
                <Text style={styles.label}>Пароль:</Text>

                <PasswordInput value={password} onChangeText={setPassword} />
              </View>

              <View style={styles.formBlock}>
                <Text style={styles.label}>Повторіть пароль:</Text>

                <PasswordInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
                {/* </View>
              <View style={styles.formBlock}> */}
                <TouchableOpacity style={styles.btn} onPress={handleRegister}>
                  <Text style={styles.btnText}>Зареєструватися</Text>
                </TouchableOpacity>

                <Pressable onPress={() => router.push("/login")}>
                  <Text style={styles.text}>Вже є акаунт? Увійти</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>

      {/* MODAL CONFIRM CODE */}

      <Modal visible={confirmModal} transparent animationType="fade">
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Введіть код з email</Text>

            <TextInput
              style={styles.input}
              placeholder="Код"
              keyboardType="number-pad"
              value={code}
              onChangeText={setCode}
            />

            <TouchableOpacity style={styles.btn} onPress={confirmEmail}>
              <Text style={styles.btnText}>Підтвердити</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setConfirmModal(false)}>
              <Text style={styles.link}>На головну</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* SUCCESS MODAL */}

      <Modal visible={successModal} transparent animationType="fade">
        <Pressable style={styles.modal} onPress={() => setSuccessModal(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.success}>Вітаємо з успішною реєстрацією!</Text>

            <TouchableOpacity
              style={styles.btn}
              onPress={() => {
                setSuccessModal(false);
                resetForm(); // ✅ очищаємо ВСЕ
                router.replace("/"); // ✅ перехід
              }}
            >
              <Text style={styles.btnText}>Натисніть щоб перейти</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      {/* ERROR MODAL */}

      <Modal visible={errorModal} transparent animationType="fade">
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <Text style={styles.error}>
              Невірний код. Email не підтверджено
            </Text>

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
      {/* </ParallaxScrollView> */}
    </PortalProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    top: 30,
  },

  bgd: {
    width: "100%",
    height: 800,
  },

  title: {
    fontFamily: "Ukrainian-Bold",
    color: "#eee",
    fontSize: 22,
    marginBottom: 10,
  },

  form: {
    width: "100%",
    paddingHorizontal: 40,
    top: 10,
  },

  formLandscape: {
    fontFamily: "Ukrainian-Bold",
    display: "flex",
    alignItems: "center",
    gap: 20,
    width: "100%",
    maxWidth: 800,
    top: 10,
  },

  formWrapper: {
    display: "flex",
    width: "100%",
    flexDirection: "column",
    gap: 20,
  },

  formWrapperLandscape: {
    width: "80%",
    flexDirection: "column",
    gap: 20,
    marginTop: 20,
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
    backgroundColor: "#9370db",
    padding: 15,
    borderWidth: 2,
    borderRadius: 30,
    alignItems: "center",
    height: 60,
  },

  btnText: {
    fontFamily: "Ukrainian-Regular",
    color: "#eee",
    fontSize: 20,
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

  formBlock: {
    flex: 1,
    gap: 20,
  },

  label: {
    fontFamily: "Ukrainian-Regular",
    color: "#eee",
    fontSize: 18,
    paddingLeft: 20,
  },

  text: {
    fontFamily: "Ukrainian-Regular",
    color: "#eee",
    fontSize: 15,
    textAlign: "center",
  },

  modalContent: {
    width: "80%",
    backgroundColor: "#eee",
    padding: 25,
    borderRadius: 15,
    gap: 15,
  },

  modalTitle: {
    fontFamily: "Ukrainian-Regular",
    fontSize: 20,
    textAlign: "center",
  },

  success: {
    fontFamily: "Ukrainian-Regular",
    fontSize: 22,
    textAlign: "center",
    color: "green",
  },

  error: {
    fontFamily: "Ukrainian-Regular",
    fontSize: 20,
    textAlign: "center",
    color: "red",
  },
});
