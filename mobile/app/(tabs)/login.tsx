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

  const [forgotModal, setForgotModal] = useState(false);
  const [resetModal, setResetModal] = useState(false);

  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  // const [loading, setLoading] = useState(false);

  const [emailModal, setEmailModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const resetPasswordForm = () => {
    setResetCode("");
    setNewPassword("");
    setConfirmNewPassword("");
  };

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Заповніть усі поля");
      return;
    }

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

      if (!response.ok) {
        setErrorModal(true);
        return;
      }

      await login(data.token);
      setEmail("");
      setPassword("");

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
            </View>

            <View style={styles.formBlock}>
              <Text style={styles.label}>Пароль / Password:</Text>

              <PasswordInput value={password} onChangeText={setPassword} />
            </View>

            <Pressable
              onPress={() => {
                setEmailModal(true);
              }}
            >
              <Text style={styles.text}>Забули пароль?</Text>
            </Pressable>
          </View>

          <TouchableOpacity style={styles.btn} onPress={handleLogin}>
            <Text style={styles.btnTxt}> Вхід </Text>
          </TouchableOpacity>

          <Pressable
            style={{ display: "flex", alignItems: "center" }}
            onPress={() => router.push("/registr")}
          >
            <Text style={styles.text}>Не зареєстровані? Реєстрація</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>

      {/* SUCCESS MODAL */}

      <Modal visible={successModal} transparent animationType="fade">
        <Pressable style={styles.modal} onPress={() => setSuccessModal(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.success}>{successMessage || "Успішно!"}</Text>

            <TouchableOpacity
              style={styles.btn}
              onPress={() => {
                setSuccessModal(false);

                resetPasswordForm(); // 🔥 очистка reset
                setEmail("");
                setPassword("");

                setSuccessMessage("Успішний вхід!");

                router.replace("/");
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
            <Text style={styles.error}>{"Невірний email або пароль"}</Text>

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

      {/* EMAIL MODAL */}

      <Modal visible={emailModal} transparent animationType="fade">
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <Text style={styles.label}>
              Введіть email для відправлення коду скидання паролю
            </Text>

            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />

            <TouchableOpacity
              style={styles.btn}
              onPress={async () => {
                if (!email) return;

                try {
                  await fetch(`${API_URL}/api/auth/forgot-password`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email }),
                  });

                  setEmailModal(false);
                  setForgotModal(true);
                } catch (e) {
                  console.log(e);
                }
              }}
            >
              <Text style={styles.btnText}>Відправити код</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setEmailModal(false)}>
              <Text style={styles.link}>Скасувати</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* CODE MODAL */}

      <Modal visible={forgotModal} transparent animationType="fade">
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <Text style={styles.label}>
              Введіть відправлений вам на email код
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Код"
              value={resetCode}
              onChangeText={setResetCode}
              keyboardType="number-pad"
            />

            <TouchableOpacity
              style={styles.btn}
              onPress={() => {
                if (!resetCode) return alert("Введіть код");

                setForgotModal(false);
                setResetModal(true);
              }}
            >
              <Text style={styles.btnText}>Скинути пароль</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setForgotModal(false)}>
              <Text style={styles.link}>Скасувати</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* NEW PASSWORD MODAL */}

      <Modal visible={resetModal} transparent animationType="fade">
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <Text style={styles.success}>Пароль успішно скинуто!</Text>

            <Text style={styles.label}>Введіть новий пароль</Text>

            <PasswordInput value={newPassword} onChangeText={setNewPassword} />

            <Text style={styles.label}>Повторіть новий пароль</Text>

            <PasswordInput
              value={confirmNewPassword}
              onChangeText={setConfirmNewPassword}
            />

            <TouchableOpacity
              style={styles.btn}
              onPress={async () => {
                if (!newPassword || !confirmNewPassword) {
                  return alert("Заповніть всі поля");
                }

                if (newPassword !== confirmNewPassword) {
                  return alert("Паролі не співпадають");
                }

                try {
                  const response = await fetch(
                    `${API_URL}/api/auth/reset-password/${resetCode}`,
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        password: newPassword,
                      }),
                    },
                  );

                  const data = await response.json();

                  if (!response.ok) {
                    setResetModal(false);
                    setSuccessMessage(data.message || "Помилка");
                    setErrorModal(true);
                    return;
                  }

                  resetPasswordForm();
                  setResetModal(false);

                  setSuccessMessage("Пароль успішно змінено!");
                  setSuccessModal(true);
                } catch (e) {
                  console.log(e);
                  alert("Помилка сервера");
                }
              }}
            >
              <Text style={styles.btnText}>Змінити пароль</Text>
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

  // title: {
  //   fontFamily: "Ukrainian-Bold",
  //   color: "#eee",
  // },

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
    marginTop: 30,
    marginBottom: 30,
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
    fontFamily: "Ukrainian-Regular",
    color: "#fff",
    fontSize: 18,
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
