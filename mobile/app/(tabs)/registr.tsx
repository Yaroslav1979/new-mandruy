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

// import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

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
      setCode("");
    } catch (error) {
      console.log(error);
      alert("Помилка підтвердження");
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
          {/* <Text style={styles.title}>Реєстрація</Text> */}

          <View
            style={[
              styles.formWrapper,
              isLandscape && styles.formWrapperLandscape,
            ]}
          >
            <View style={styles.formBlock}>
              <Text style={styles.label}>Імʼя/Name:</Text>
              <TextInput
                style={styles.input}
                // placeholder="Імʼя"
                value={name}
                onChangeText={setName}
                textAlign="center"
                autoFocus={false}
                // keyboardType="text"
                autoCapitalize="none"
                autoCorrect={false}
                // textContentType="text"
              />
            </View>

            <View style={styles.formBlock}>
              <Text style={styles.label}>Електронна адреса/Email:</Text>
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
              <Text style={styles.label}>Пароль / Password:</Text>

              <PasswordInput value={password} onChangeText={setPassword} />
            </View>

            <View style={styles.formBlock}>
              <Text style={styles.label}>
                Повторіть пароль/Confirm password:
              </Text>

              <PasswordInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </View>
            <View style={styles.formBlock}>
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
        <Pressable style={styles.modal} onPress={() => router.replace("/")}>
          <View style={styles.modalContent}>
            <Text style={styles.success}>Вітаємо з успішною реєстрацією!</Text>

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
    top: 80,
  },

  formWrapper: {
    display: "flex",
    width: "100%",
    flexDirection: "column",
    gap: 20,
  },

  formWrapperLandscape: {
    width: "100%",
    flexDirection: "column",
    gap: 20,
    marginTop: 20,
  },

  title: {
    fontSize: 28,
    textAlign: "center",
    marginBottom: 20,
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
    color: "#fff",
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

  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 15,
    gap: 15,
  },

  modalTitle: {
    fontSize: 20,
    textAlign: "center",
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

  formBlock: {
    flex: 1,
    gap: 20,
  },

  label: {
    fontFamily: "Ukrainian-Regular",
    color: "#eee",
    fontSize: 15,
  },

  text: {
    fontFamily: "Ukrainian-Regular",
    color: "#eee",
    fontSize: 15,
    textAlign: "center",
  },
});

// import ParallaxScrollView from "@/components/parallax-scroll-view";
// import { router } from "expo-router";
// import {
//   KeyboardAvoidingView,
//   Platform,
//   Pressable,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
//   Image,
//   useWindowDimensions,
// } from "react-native";
// import HeaderLog from "../../components/HeaderLog";
// import PasswordInput from "../../components/hide-eyes-input";
// // import hidePasswordIcon from '../../assets/svg/hide.svg';
// // import showPasswordIcon from '../../assets/svg/eye.svg';

// export default function RegistrScreen() {
//   const { width, height } = useWindowDimensions();
//   const isLandscape = width > height;

//   return (
//     <ParallaxScrollView
//       headerBackgroundColor={{ light: "#fff", dark: "#1D3D47" }}
//       headerHeight={35}
//       headerImage={<View />}
//     >
//       <HeaderLog />

//       <View style={{ position: "relative" }}>
//         <Image
//           source={require("../../assets/images/NightMoon.jpg")}
//           style={styles.bgd}
//         />
//       </View>

//       <KeyboardAvoidingView
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//         style={{
//           flex: 1,
//           position: "absolute",
//           left: 0,
//           right: 0,
//           alignItems: "center",
//         }}
//       >
//         <View style={[styles.form, isLandscape && styles.formLandscape]}>
//           <View
//             style={[
//               styles.formWrapper,
//               isLandscape && styles.formWrapperLandscape,
//             ]}
//           >
//             <View
//               style={[
//                 styles.formBlock,
//                 isLandscape && styles.formBlockLandscape,
//               ]}
//             >
//               <Text style={styles.label}>Електронна пошта / Email:</Text>
//               <TextInput
//                 style={styles.input}
//                 textAlign="center"
//                 autoFocus={false}
//                 keyboardType="email-address"
//                 autoCapitalize="none"
//                 autoCorrect={false}
//                 textContentType="emailAddress"
//               />
//             </View>

//             <View style={styles.formBlock}>
//               <Text style={styles.label}>Пароль / Password:</Text>
//               <PasswordInput />
//               {/* <TextInput
//                 style={styles.input}
//                 textAlign="center"
//                 secureTextEntry={true}
//                 autoFocus={false}
//                 textContentType="password"
//               /> */}
//             </View>

//             <View style={styles.formBlock}>
//               <Text style={styles.label}>
//                 Повторіть пароль/Confirm password:
//               </Text>
//               <PasswordInput />

//               {/* <TextInput
//                 style={styles.input}
//                 textAlign="center"
//                 secureTextEntry={true}
//                 autoFocus={false}
//                 textContentType="password"
//               /> */}
//             </View>
//           </View>
//           <View>
//             <TouchableOpacity style={styles.btn}>
//               <Text style={styles.btnTxt}> Зареєструватися </Text>
//             </TouchableOpacity>

//             <Pressable
//               onPress={() => router.push("/login")}
//               style={{
//                 flex: 1,
//                 position: "absolute",
//                 left: 0,
//                 right: 0,
//                 top: 70,
//                 alignItems: "center",
//               }}
//             >
//               <Text style={styles.text}>Вже зареєстровані? Увійти</Text>
//             </Pressable>
//           </View>
//         </View>
//       </KeyboardAvoidingView>
//     </ParallaxScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   bgd: {
//     flex: 1,
//     width: "100%",
//     height: 800,
//   },

//   title: {
//     fontFamily: "Ukrainian-Bold",
//     color: "#eee",
//   },

//   form: {
//     fontFamily: "Ukrainian-Bold",
//     display: "flex",
//     maxWidth: 500,
//     top: 120,
//     marginHorizontal: 20,
//   },

//   formLandscape: {
//     fontFamily: "Ukrainian-Bold",
//     display: "flex",
//     gap: 20,
//     width: "100%",
//     maxWidth: 800,
//     top: 80,
//   },
//   formWrapper: {
//     display: "flex",
//     flexDirection: "column",
//   },
//   formWrapperLandscape: {
//     display: "flex",
//     flexDirection: "row",
//     gap: 20,
//     marginTop: 20,
//   },

//   formBlock: {
//     flex: 1,
//     gap: 20,
//   },

//   formBlockLandscape: {
//     display: "flex",
//     flex: 1,
//     width: 200,
//     gap: 10,
//   },

//   label: {
//     fontFamily: "Ukrainian-Regular",
//     color: "#eee",
//     fontSize: 15,
//   },
//   input: {
//     borderWidth: 2,
//     borderColor: "#111",
//     height: 60,
//     borderRadius: 30,
//     fontSize: 20,
//     fontFamily: "Ukrainian-Regular",
//     color: "#111",
//     backgroundColor: "#eeeeee90",
//   },
//   btn: {
//     backgroundColor: "#9370db99",
//     borderWidth: 2,
//     height: 60,
//     borderRadius: 30,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   btnTxt: {
//     fontFamily: "Ukrainian-Regular",
//     color: "#eee",
//     fontSize: 20,
//   },
//   text: {
//     fontFamily: "Ukrainian-Regular",
//     color: "#eee",
//     paddingTop: 5,
//     fontSize: 15,
//   },
// });
